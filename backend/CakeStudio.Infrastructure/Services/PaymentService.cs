using CakeStudio.API.DbContexts.models;
using CakeStudio.Application.Common.Exceptions;
using CakeStudio.Application.DTOs.Email;
using CakeStudio.Application.DTOs.Payment;
using CakeStudio.Application.Interfaces;
using CakeStudio.Infrastructure.Repositories;
using CakeStudio.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Stripe;
using Stripe.Checkout;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Infrastructure.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly CakeStudioDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;
        private readonly ILogger<PaymentService> _logger;
        private readonly IInventoryRepository _inventoryRepository;

        public PaymentService(
            CakeStudioDbContext context,
            IConfiguration configuration,
            IEmailService emailService,
            ILogger<PaymentService> logger,
            IInventoryRepository inventoryRepository
            )
        {
            _context = context;
            _configuration = configuration;
            _emailService = emailService;
            _logger = logger;
            _inventoryRepository = inventoryRepository;
        }

        private static string NormalizeRefundStatus(string? stripeStatus)
        {
            if (string.Equals(
                    stripeStatus,
                    "succeeded",
                    StringComparison.OrdinalIgnoreCase))
            {
                return "Succeeded";
            }

            if (string.Equals(
                    stripeStatus,
                    "failed",
                    StringComparison.OrdinalIgnoreCase))
            {
                return "Failed";
            }

            if (string.Equals(
                    stripeStatus,
                    "canceled",
                    StringComparison.OrdinalIgnoreCase))
            {
                return "Cancelled";
            }

            return "Pending";
        }
        private static long ToMinorUnits(decimal amount)
        {
            return checked(
                (long)Math.Round(
                    amount * 100m,
                    0,
                    MidpointRounding.AwayFromZero));
        }
        private async Task<bool> IsEventProcessedAsync(string stripeEventId)
        {
            return await _context.StripeWebhookEvents
                .AnyAsync(x =>
                    x.StripeEventId == stripeEventId);
        }
        public async Task<PaymentSessionResponseDto> CreateSessionAsync(int orderId)
        {
            var order = await _context.Orders
                .Include(x => x.OrderItems)
                .ThenInclude(x => x.Cake)
                .FirstOrDefaultAsync(x => x.Id == orderId);

            if (order == null)
            {
                throw new NotFoundException(
                    "Order not found.");
            }

            // -------------------------------------------------
            // ONLY CARD ORDERS CAN USE STRIPE
            // -------------------------------------------------

            if (!order.PaymentMethod.Equals(
                    "card",
                    StringComparison.OrdinalIgnoreCase))
            {
                throw new BadRequestException(
                    "Stripe payment can only be created for card orders.");
            }

            // -------------------------------------------------
            // FIND EXISTING PAYMENT
            // -------------------------------------------------

            var existingPayment =
                await _context.Payments
                    .FirstOrDefaultAsync(
                        x => x.OrderId == order.Id);

            // -------------------------------------------------
            // PREVENT DOUBLE PAYMENT
            // -------------------------------------------------

            if (existingPayment != null)
            {
                var paymentStatus =
                    existingPayment.PaymentStatus;

                if (
                    paymentStatus.Equals(
                        "Paid",
                        StringComparison.OrdinalIgnoreCase) ||

                    paymentStatus.Equals(
                        "PartiallyRefunded",
                        StringComparison.OrdinalIgnoreCase) ||

                    paymentStatus.Equals(
                        "Refunded",
                        StringComparison.OrdinalIgnoreCase)
                )
                {
                    throw new BadRequestException(
                        "This order is already paid.");
                }
            }

            // -------------------------------------------------
            // CHECK EXISTING STRIPE SESSION
            // -------------------------------------------------

            if (!string.IsNullOrWhiteSpace(
                    existingPayment?.StripeCheckoutSessionId))
            {
                try
                {
                    var existingSessionService =
                        new SessionService();

                    var existingSession =
                        await existingSessionService
                            .GetAsync(
                                existingPayment
                                    .StripeCheckoutSessionId);

                    // Existing checkout is still usable.
                    // Return it instead of creating duplicates.

                    if (existingSession.Status == "open")
                    {
                        return new PaymentSessionResponseDto
                        {
                            SessionId =
                                existingSession.Id,

                            CheckoutUrl =
                                existingSession.Url
                        };
                    }

                    // Stripe says the old session is expired.
                    // Mark our local payment accordingly.

                    if (
                        existingSession.Status == "expired" &&
                        existingPayment != null &&
                        existingPayment.PaymentStatus.Equals(
                            "Pending",
                            StringComparison.OrdinalIgnoreCase)
                    )
                    {
                        existingPayment.PaymentStatus =
                            "Expired";

                        existingPayment.UpdatedAt =
                            DateTime.UtcNow;

                        await _context.SaveChangesAsync();
                    }
                }
                catch (StripeException)
                {
                    // Do not reuse an invalid/unavailable
                    // Stripe Checkout Session.
                    //
                    // We will create a fresh session below.
                }
            }

            // -------------------------------------------------
            // CREATE OR REUSE PAYMENT RECORD
            // -------------------------------------------------

            var payment =
                existingPayment ??
                new Payment
                {
                    OrderId = order.Id,

                    PaymentMethod = "Stripe",

                    PaymentStatus = "Pending",

                    Amount = order.TotalAmount,

                    Currency = "INR",

                    CreatedAt = DateTime.UtcNow
                };

            if (existingPayment == null)
            {
                _context.Payments.Add(payment);

                // We need Payment.Id before adding it
                // to Stripe metadata.

                await _context.SaveChangesAsync();
            }
            else
            {
                // -------------------------------------------------
                // RESET FAILED / EXPIRED PAYMENT FOR RETRY
                // -------------------------------------------------

                payment.PaymentStatus =
                    "Pending";

                payment.FailureReason =
                    null;

                payment.StripeCheckoutSessionId =
                    null;

                payment.StripePaymentIntentId =
                    null;

                payment.PaidAt =
                    null;

                payment.Amount =
                    order.TotalAmount;

                payment.Currency =
                    "INR";

                payment.UpdatedAt =
                    DateTime.UtcNow;

                await _context.SaveChangesAsync();
            }

            // -------------------------------------------------
            // STRIPE LINE ITEMS
            // -------------------------------------------------

            var lineItems =
                order.OrderItems
                    .Select(item =>
                        new SessionLineItemOptions
                        {
                            Quantity =
                                item.Quantity,

                            PriceData =
                                new SessionLineItemPriceDataOptions
                                {
                                    Currency =
                                        "inr",

                                    UnitAmount =
                                        ToMinorUnits(
                                            item.UnitPrice),

                                    ProductData =
                                        new SessionLineItemPriceDataProductDataOptions
                                        {
                                            Name =
                                                item.Cake.Name
                                        }
                                }
                        })
                    .ToList();

            // -------------------------------------------------
            // FRONTEND URL
            // -------------------------------------------------

            var frontendBaseUrl =
                _configuration["Frontend:BaseUrl"]
                ?? "http://localhost:5173";

            // -------------------------------------------------
            // CREATE STRIPE CHECKOUT OPTIONS
            // -------------------------------------------------

            var options =
                new SessionCreateOptions
                {
                    Mode = "payment",

                    SuccessUrl =
                        $"{frontendBaseUrl}/payment/success" +
                        $"?orderId={order.Id}" +
                        $"&session_id={{CHECKOUT_SESSION_ID}}",

                    CancelUrl =
                        $"{frontendBaseUrl}/payment/cancel" +
                        $"?orderId={order.Id}",

                    ClientReferenceId =
                        order.Id.ToString(),

                    LineItems =
                        lineItems,

                    PaymentIntentData =
                        new SessionPaymentIntentDataOptions
                        {
                            Metadata =
                                new Dictionary<string, string>
                                {
                                    ["OrderId"] =
                                        order.Id.ToString(),

                                    ["PaymentId"] =
                                        payment.Id.ToString()
                                }
                        },

                    Metadata =
                        new Dictionary<string, string>
                        {
                            ["OrderId"] =
                                order.Id.ToString(),

                            ["PaymentId"] =
                                payment.Id.ToString()
                        }
                };

            // -------------------------------------------------
            // STRIPE IDEMPOTENCY
            // -------------------------------------------------
            //
            // Do NOT use only:
            //
            // checkout-order-{order.Id}
            //
            // because retrying an expired/failed checkout
            // must be able to create a new Stripe session.
            //
            // Payment.UpdatedAt changes for each retry.

            var retryVersion =
                payment.UpdatedAt?.Ticks
                ?? payment.CreatedAt.Ticks;

            var requestOptions =
                new RequestOptions
                {
                    IdempotencyKey =
                        $"checkout-order-{order.Id}-{retryVersion}"
                };

            // -------------------------------------------------
            // CREATE STRIPE SESSION
            // -------------------------------------------------

            var session =
                await new SessionService()
                    .CreateAsync(
                        options,
                        requestOptions);

            // -------------------------------------------------
            // SAVE STRIPE SESSION
            // -------------------------------------------------

            payment.StripeCheckoutSessionId =
                session.Id;

            payment.UpdatedAt =
                DateTime.UtcNow;

            order.StripeSessionId =
                session.Id;

            await _context.SaveChangesAsync();

            // -------------------------------------------------
            // RESPONSE
            // -------------------------------------------------

            return new PaymentSessionResponseDto
            {
                SessionId =
                    session.Id,

                CheckoutUrl =
                    session.Url
            };
        }
        public async Task PaymentFailedAsync(string stripeEventId,string paymentIntentId,string? failureReason)
        {
            // 1. Stripe may send the same webhook more than once.
            if (await IsEventProcessedAsync(stripeEventId))
            {
                _logger.LogInformation(
                    "Stripe event {StripeEventId} already processed.",
                    stripeEventId);

                return;
            }

            // 2. Find the Payment using Stripe PaymentIntent ID.
            var payment = await _context.Payments
                .Include(x => x.Order)
                .FirstOrDefaultAsync(x =>
                    x.StripePaymentIntentId == paymentIntentId);

            /*
             * Important:
             * StripePaymentIntentId might not yet have been saved in our
             * database if the payment failed before checkout completed.
             *
             * Therefore, retrieve the PaymentIntent from Stripe and use
             * OrderId stored in its metadata.
             */
            if (payment == null)
            {
                var paymentIntentService =
                    new PaymentIntentService();

                var paymentIntent =
                    await paymentIntentService.GetAsync(
                        paymentIntentId);

                if (paymentIntent.Metadata.TryGetValue(
                        "OrderId",
                        out var orderIdValue) &&
                    int.TryParse(
                        orderIdValue,
                        out var orderId))
                {
                    payment = await _context.Payments
                        .Include(x => x.Order)
                        .FirstOrDefaultAsync(x =>
                            x.OrderId == orderId);

                    if (payment != null)
                    {
                        payment.StripePaymentIntentId =
                            paymentIntentId;
                    }
                }
            }

            if (payment == null)
            {
                _logger.LogWarning(
                    "Payment not found for Stripe PaymentIntent {PaymentIntentId}",
                    paymentIntentId);

                throw new NotFoundException(
                    "Payment record not found for Stripe PaymentIntent.");
            }

            using var transaction =
                await _context.Database
                    .BeginTransactionAsync();

            try
            {
                // 3. Update Payment table.
                payment.PaymentStatus =
                    "Failed";

                payment.FailureReason =
                    failureReason;

                payment.UpdatedAt =
                    DateTime.UtcNow;

                // 4. Keep existing Order fields synchronized.
                payment.Order.StripePaymentIntentId =
                    paymentIntentId;

                payment.Order.PaymentStatus =
                    "Failed";

                payment.Order.OrderStatus =
                    "Cancelled";

                // 5. Keep your existing PaymentAudit.
                _context.PaymentAudits.Add(
                    new PaymentAudit
                    {
                        OrderId =
                            payment.OrderId,

                        StripeSessionId =
                            payment.StripeCheckoutSessionId,

                        Status =
                            "Failed",

                        Remarks =
                            string.IsNullOrWhiteSpace(
                                failureReason)
                            ? "Stripe payment failed"
                            : $"Stripe payment failed: {failureReason}",

                        CreatedAt =
                            DateTime.UtcNow
                    });

                // 6. Record Stripe event.
                // If Stripe retries this same event,
                // IsEventProcessedAsync() will stop it.
                _context.StripeWebhookEvents.Add(
                    new StripeWebhookEvent
                    {
                        StripeEventId =
                            stripeEventId,

                        EventType =
                            "payment_intent.payment_failed",

                        ProcessedAt =
                            DateTime.UtcNow
                    });

                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                _logger.LogWarning(
                    "Stripe payment failed for OrderId {OrderId}. PaymentIntent {PaymentIntentId}. Reason: {FailureReason}",
                    payment.OrderId,
                    paymentIntentId,
                    failureReason);
            }
            catch
            {
                await transaction.RollbackAsync();

                throw;
            }
        }
        public async Task PaymentSuccessAsync(string stripeEventId,string sessionId)
        {
            // STEP 1:
            // Has this Stripe webhook already been processed?
            if (await IsEventProcessedAsync(stripeEventId))
            {
                _logger.LogInformation(
                    "Stripe event {StripeEventId} already processed.",
                    stripeEventId);

                return;
            }

            // STEP 2:
            // Get the Checkout Session directly from Stripe.
            var sessionService = new SessionService();

            var session = await sessionService.GetAsync(
                sessionId,
                new SessionGetOptions
                {
                    Expand = new List<string>
                    {
                "payment_intent"
                    }
                });

            // STEP 3:
            // Get OrderId stored in Stripe metadata.
            if (!session.Metadata.TryGetValue(
                    "OrderId",
                    out var orderIdValue) ||
                !int.TryParse(orderIdValue, out var orderId))
            {
                throw new InvalidOperationException(
                    "Stripe Checkout Session does not contain a valid OrderId.");
            }

            // STEP 4:
            // Load order + payment + products.
            var order = await _context.Orders
                        .Include(x => x.User)
                        .Include(x => x.Address)
                        .Include(x => x.OrderItems)
                            .ThenInclude(x => x.Cake)
                        .FirstOrDefaultAsync(x => x.Id == orderId);

            if (order == null)
            {
                throw new NotFoundException(
                    "Order not found for Stripe payment.");
            }

            var payment = await _context.Payments
                .FirstOrDefaultAsync(x =>
                    x.OrderId == order.Id);

            if (payment == null)
            {
                throw new NotFoundException(
                    "Payment record not found.");
            }

            // STEP 5:
            // Verify that this Stripe Session belongs
            // to the payment stored in our database.
            if (!string.Equals(
                    payment.StripeCheckoutSessionId,
                    session.Id,
                    StringComparison.Ordinal))
            {
                throw new InvalidOperationException(
                    "Stripe Checkout Session does not match the payment record.");
            }

            // STEP 6:
            // Stripe must say the payment is actually paid.
            if (!string.Equals(
                    session.PaymentStatus,
                    "paid",
                    StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidOperationException(
                    "Stripe payment is not marked as paid.");
            }

            // STEP 7:
            // Verify amount.
            var expectedAmount =
                ToMinorUnits(order.TotalAmount);

            if (session.AmountTotal != expectedAmount)
            {
                throw new InvalidOperationException(
                    $"Stripe amount mismatch. " +
                    $"Expected {expectedAmount}, " +
                    $"received {session.AmountTotal}.");
            }

            // STEP 8:
            // Verify currency.
            if (!string.Equals(
                    session.Currency,
                    "inr",
                    StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidOperationException(
                    "Stripe currency mismatch.");
            }

            // Extra safety:
            // Even if a different Stripe event somehow arrives,
            // don't process an already-paid payment again.
            if (payment.PaymentStatus == "Paid")
            {
                return;
            }

            using var transaction =
                await _context.Database.BeginTransactionAsync();

            try
            {
                // STEP 9:
                // Get PaymentIntent ID.
                var paymentIntentId =
                    session.PaymentIntentId;

                payment.StripePaymentIntentId =
                    paymentIntentId;

                payment.PaymentStatus =
                    "Paid";

                payment.PaidAt =
                    DateTime.UtcNow;

                payment.UpdatedAt =
                    DateTime.UtcNow;

                // Keep existing Order payment fields
                // synchronized for your current application.
                order.StripePaymentIntentId =
                    paymentIntentId;

                order.PaymentStatus =
                    "Paid";

                order.OrderStatus =
                    "Confirmed";

                // STEP 10:
                // Reduce inventory only after verified payment.
                foreach (var item in order.OrderItems)
                {
                    if (item.Cake.StockQuantity < item.Quantity)
                    {
                        throw new InvalidOperationException(
                            $"Insufficient stock for CakeId {item.CakeId}.");
                    }

                    item.Cake.StockQuantity -=
                        item.Quantity;

                    await _inventoryRepository
                        .AddTransactionAsync(
                            new InventoryTransaction
                            {
                                CakeId =
                                    item.CakeId,

                                Quantity =
                                    -item.Quantity,

                                TransactionType =
                                    "Sale",

                                Remarks =
                                    $"Order #{order.Id}",

                                CreatedBy = order.UserId,

                                CreatedAt =
                                    DateTime.UtcNow
                            });
                }

                // Clear the authenticated customer's cart
                // only after Stripe payment has been verified.
                if (order.UserId.HasValue)
                {
                    var cart = await _context.Carts
                        .Include(x => x.CartItems)
                        .FirstOrDefaultAsync(x =>
                            x.UserId == order.UserId.Value);

                    if (cart != null &&
                        cart.CartItems.Any())
                    {
                        _context.CartItems.RemoveRange(
                            cart.CartItems);

                        _logger.LogInformation(
                            "Cart cleared after successful Stripe payment for UserId {UserId}, OrderId {OrderId}",
                            order.UserId.Value,
                            order.Id);
                    }
                }

                // STEP 11:
                // Keep your existing PaymentAudit.
                _context.PaymentAudits.Add(
                    new PaymentAudit
                    {
                        OrderId =
                            order.Id,

                        StripeSessionId =
                            session.Id,

                        Status =
                            "Paid",

                        Remarks =
                            "Stripe payment successful",

                        CreatedAt =
                            DateTime.UtcNow
                    });

                // STEP 12:
                // Mark this Stripe webhook event as processed.
                _context.StripeWebhookEvents.Add(
                    new StripeWebhookEvent
                    {
                        StripeEventId =
                            stripeEventId,

                        EventType =
                            "checkout.session.completed",

                        ProcessedAt =
                            DateTime.UtcNow
                    });

                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                _logger.LogInformation(
                    "Stripe payment successful for OrderId {OrderId}. Event {EventId}",
                    order.Id,
                    stripeEventId);
            }
            catch
            {
                await transaction.RollbackAsync();

                throw;
            }

            // STEP 13:
            // Send payment-success email AFTER the database
            // transaction has successfully committed.
            //
            // Email failure must never roll back a successful payment.

            try
            {
                string? customerEmail = null;
                string customerName = "Customer";

                // ------------------------------------------
                // PREFER SHIPPING ADDRESS EMAIL
                // ------------------------------------------

                if (order.Address != null &&
                    !string.IsNullOrWhiteSpace(order.Address.Email))
                {
                    customerEmail = order.Address.Email;

                    if (!string.IsNullOrWhiteSpace(order.Address.FullName))
                    {
                        customerName = order.Address.FullName;
                    }
                }

                // ------------------------------------------
                // FALLBACK TO LOGGED-IN USER EMAIL
                // ------------------------------------------

                if (string.IsNullOrWhiteSpace(customerEmail) &&
                    order.User != null &&
                    !string.IsNullOrWhiteSpace(order.User.Email))
                {
                    customerEmail = order.User.Email;

                    customerName =
                        $"{order.User.FirstName} {order.User.LastName}"
                            .Trim();
                }

                // ------------------------------------------
                // SEND EMAIL
                // ------------------------------------------

                if (!string.IsNullOrWhiteSpace(customerEmail))
                {
                    var emailRequest =
                        new EmailRequestDto
                        {
                            To = customerEmail,

                            Subject =
                                $"CakeStudio - Payment Successful for Order #{order.Id}",

                            Body =
                                EmailTemplateService
                                    .PaymentSuccessTemplate(
                                        customerName,
                                        order.Id,
                                        order.TotalAmount,
                                        order.StripePaymentIntentId,
                                        "Stripe",
                                        DateTime.Now.ToString(
                                            "dd MMM yyyy, hh:mm tt"))
                        };


                    // Logged-in customer may have a different
                    // account email from shipping email.
                    if (order.User != null &&
                        !string.IsNullOrWhiteSpace(order.User.Email) &&
                        !string.Equals(
                            order.User.Email,
                            customerEmail,
                            StringComparison.OrdinalIgnoreCase))
                    {
                        emailRequest.Cc =
                            new List<string>
                            {
                    order.User.Email
                            };
                    }


                    await _emailService
                        .SendEmailAsync(emailRequest);


                    _logger.LogInformation(
                        "Payment success email sent for OrderId {OrderId} to {Email}",
                        order.Id,
                        customerEmail);
                }
                else
                {
                    _logger.LogWarning(
                        "Payment succeeded for OrderId {OrderId}, but no customer email address was available.",
                        order.Id);
                }
            }
            catch (Exception ex)
            {
                // Payment has already succeeded.
                // Email failure must not change payment status.

                _logger.LogError(
                    ex,
                    "Payment succeeded but confirmation email failed for OrderId {OrderId}",
                    order.Id);
            }
        }
        public async Task CheckoutExpiredAsync(string stripeEventId,string sessionId)
        {
            // Stripe may retry the same webhook.
            if (await IsEventProcessedAsync(stripeEventId))
            {
                _logger.LogInformation(
                    "Stripe event {StripeEventId} already processed.",
                    stripeEventId);

                return;
            }

            var payment = await _context.Payments
                .Include(x => x.Order)
                .FirstOrDefaultAsync(x =>
                    x.StripeCheckoutSessionId == sessionId);

            if (payment == null)
            {
                _logger.LogWarning(
                    "Payment not found for expired Stripe session {SessionId}",
                    sessionId);

                throw new NotFoundException(
                    "Payment record not found for expired Stripe session.");
            }

            /*
             * Very important:
             * Never overwrite a successful payment.
             *
             * This is defensive protection in case webhook events
             * arrive in an unexpected order.
             */
            if (string.Equals(
                    payment.PaymentStatus,
                    "Paid",
                    StringComparison.OrdinalIgnoreCase))
            {
                _context.StripeWebhookEvents.Add(
                    new StripeWebhookEvent
                    {
                        StripeEventId = stripeEventId,
                        EventType = "checkout.session.expired",
                        ProcessedAt = DateTime.UtcNow
                    });

                await _context.SaveChangesAsync();

                _logger.LogWarning(
                    "Expired event received for already-paid OrderId {OrderId}. No payment status changed.",
                    payment.OrderId);

                return;
            }

            using var transaction =
                await _context.Database
                    .BeginTransactionAsync();

            try
            {
                payment.PaymentStatus =
                    "Expired";

                payment.UpdatedAt =
                    DateTime.UtcNow;

                payment.Order.PaymentStatus =
                    "Expired";

                payment.Order.OrderStatus =
                    "Cancelled";

                _context.PaymentAudits.Add(
                    new PaymentAudit
                    {
                        OrderId =
                            payment.OrderId,

                        StripeSessionId =
                            sessionId,

                        Status =
                            "Expired",

                        Remarks =
                            "Stripe Checkout Session expired before payment was completed.",

                        CreatedAt =
                            DateTime.UtcNow
                    });

                _context.StripeWebhookEvents.Add(
                    new StripeWebhookEvent
                    {
                        StripeEventId =
                            stripeEventId,

                        EventType =
                            "checkout.session.expired",

                        ProcessedAt =
                            DateTime.UtcNow
                    });

                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                _logger.LogInformation(
                    "Stripe Checkout Session {SessionId} expired for OrderId {OrderId}.",
                    sessionId,
                    payment.OrderId);
            }
            catch
            {
                await transaction.RollbackAsync();

                throw;
            }
        }
        public async Task ProcessRefundWebhookAsync(string stripeEventId,string stripeRefundId,string status)
        {
            // 1. Prevent duplicate webhook processing.
            if (await IsEventProcessedAsync(stripeEventId))
            {
                _logger.LogInformation(
                    "Stripe refund event {StripeEventId} has already been processed.",
                    stripeEventId);

                return;
            }

            // 2. Find our refund record.
            var paymentRefund =
                await _context.PaymentRefunds
                    .Include(x => x.Payment)
                        .ThenInclude(x => x.Order)
                    .FirstOrDefaultAsync(x =>
                        x.StripeRefundId == stripeRefundId);

            if (paymentRefund == null)
            {
                _logger.LogWarning(
                    "PaymentRefund not found for Stripe Refund {StripeRefundId}.",
                    stripeRefundId);

                throw new NotFoundException(
                    "Payment refund record not found.");
            }

            using var transaction =
                await _context.Database
                    .BeginTransactionAsync();

            try
            {
                // 3. Update our refund record based on Stripe.
                if (string.Equals(
                        status,
                        "succeeded",
                        StringComparison.OrdinalIgnoreCase))
                {
                    paymentRefund.RefundStatus =
                        "Succeeded";

                    paymentRefund.RefundedAt =
                        DateTime.UtcNow;

                    paymentRefund.FailureReason =
                        null;
                }
                else if (string.Equals(
                             status,
                             "failed",
                             StringComparison.OrdinalIgnoreCase))
                {
                    paymentRefund.RefundStatus =
                        "Failed";

                    paymentRefund.FailureReason =
                        "Stripe refund failed.";
                }
                else if (string.Equals(
                             status,
                             "canceled",
                             StringComparison.OrdinalIgnoreCase))
                {
                    paymentRefund.RefundStatus =
                        "Cancelled";

                    paymentRefund.FailureReason =
                        "Stripe refund was cancelled.";
                }
                else
                {
                    // For another Stripe refund state,
                    // keep the local refund pending.
                    paymentRefund.RefundStatus =
                        "Pending";
                }

                // 4. Calculate how much has actually been
                // successfully refunded.
                var otherSuccessfulRefunds =
                    await _context.PaymentRefunds
                        .Where(x =>
                            x.PaymentId ==
                                paymentRefund.PaymentId &&
                            x.Id != paymentRefund.Id &&
                            x.RefundStatus ==
                                "Succeeded")
                        .SumAsync(x =>
                            (decimal?)x.Amount)
                    ?? 0m;

                var totalRefunded =
                    otherSuccessfulRefunds;

                if (paymentRefund.RefundStatus ==
                    "Succeeded")
                {
                    totalRefunded +=
                        paymentRefund.Amount;
                }

                var payment =
                    paymentRefund.Payment;

                // 5. Update Payment and Order status.
                if (totalRefunded >= payment.Amount)
                {
                    payment.PaymentStatus =
                        "Refunded";

                    payment.Order.PaymentStatus =
                        "Refunded";
                }
                else if (totalRefunded > 0)
                {
                    payment.PaymentStatus =
                        "PartiallyRefunded";

                    payment.Order.PaymentStatus =
                        "PartiallyRefunded";
                }
                else
                {
                    // A failed/cancelled refund should not
                    // turn the original successful payment
                    // into Failed.
                    payment.PaymentStatus =
                        "Paid";

                    payment.Order.PaymentStatus =
                        "Paid";
                }

                payment.UpdatedAt =
                    DateTime.UtcNow;

                // 6. Audit.
                _context.PaymentAudits.Add(
                    new PaymentAudit
                    {
                        OrderId =
                            payment.OrderId,

                        StripeSessionId =
                            payment.StripeCheckoutSessionId,

                        Status =
                            paymentRefund.RefundStatus,

                        Remarks =
                            $"Stripe refund {stripeRefundId}: " +
                            $"{paymentRefund.RefundStatus}. " +
                            $"Amount: {paymentRefund.Amount}",

                        CreatedAt =
                            DateTime.UtcNow
                    });

                // 7. Record webhook event for idempotency.
                _context.StripeWebhookEvents.Add(
                    new StripeWebhookEvent
                    {
                        StripeEventId =
                            stripeEventId,

                        EventType =
                            "refund.updated",

                        ProcessedAt =
                            DateTime.UtcNow
                    });

                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                _logger.LogInformation(
                    "Stripe refund {StripeRefundId} processed. OrderId {OrderId}, RefundStatus {RefundStatus}, TotalRefunded {TotalRefunded}.",
                    stripeRefundId,
                    payment.OrderId,
                    paymentRefund.RefundStatus,
                    totalRefunded);
            }
            catch
            {
                await transaction.RollbackAsync();

                throw;
            }
        }
        public async Task RefundAsync(int orderId,decimal? amount,int adminUserId,string? reason)
        {
            // 1. Load payment + order + previous refunds.
            var payment = await _context.Payments
                .Include(x => x.Order)
                .Include(x => x.PaymentRefunds)
                .FirstOrDefaultAsync(x =>
                    x.OrderId == orderId);

            if (payment == null)
            {
                throw new NotFoundException(
                    "Payment record not found.");
            }

            // 2. COD was never processed by Stripe.
            if (string.Equals(
                    payment.Order.PaymentMethod,
                    "cod",
                    StringComparison.OrdinalIgnoreCase))
            {
                throw new BadRequestException(
                    "COD payments cannot be refunded through Stripe.");
            }

            // 3. Only successfully paid Stripe payments
            // can be refunded.
            if (!string.Equals(
                    payment.PaymentStatus,
                    "Paid",
                    StringComparison.OrdinalIgnoreCase) &&
                !string.Equals(
                    payment.PaymentStatus,
                    "PartiallyRefunded",
                    StringComparison.OrdinalIgnoreCase))
            {
                throw new BadRequestException(
                    "This payment is not refundable.");
            }

            if (string.IsNullOrWhiteSpace(
                    payment.StripePaymentIntentId))
            {
                throw new BadRequestException(
                    "Stripe PaymentIntent ID is missing.");
            }

            // 4. Calculate money that has already been
            // successfully refunded OR is currently pending.
            //
            // Pending is included so an admin cannot submit
            // another refund while Stripe is still processing
            // the previous one.
            var alreadyRefundedOrPending =
                payment.PaymentRefunds
                    .Where(x =>
                        string.Equals(
                            x.RefundStatus,
                            "Succeeded",
                            StringComparison.OrdinalIgnoreCase) ||
                        string.Equals(
                            x.RefundStatus,
                            "Pending",
                            StringComparison.OrdinalIgnoreCase))
                    .Sum(x => x.Amount);

            var refundableAmount =
                payment.Amount -
                alreadyRefundedOrPending;

            if (refundableAmount <= 0)
            {
                throw new BadRequestException(
                    "This payment has already been fully refunded or has a pending full refund.");
            }

            // null means:
            // "refund all remaining refundable money"
            var requestedAmount =
                amount ?? refundableAmount;

            if (requestedAmount <= 0)
            {
                throw new BadRequestException(
                    "Refund amount must be greater than zero.");
            }

            if (requestedAmount > refundableAmount)
            {
                throw new BadRequestException(
                    $"Refund amount cannot exceed the refundable balance of {refundableAmount:0.00}.");
            }

            // 5. Create our local refund record FIRST.
            //
            // This gives us a unique database Refund ID that
            // can also be used for Stripe idempotency.
            var paymentRefund = new PaymentRefund
            {
                PaymentId = payment.Id,
                Amount = requestedAmount,
                RefundStatus = "Pending",
                RequestedByUserId = adminUserId,
                RequestedAt = DateTime.UtcNow,
                RefundReason = string.IsNullOrWhiteSpace(reason) ? null : reason.Trim()
            };

            _context.PaymentRefunds.Add(
                paymentRefund);

            await _context.SaveChangesAsync();

            try
            {
                // 6. Ask Stripe to refund the PaymentIntent.
                var refundOptions =
                    new RefundCreateOptions
                    {
                        PaymentIntent =
                            payment.StripePaymentIntentId,

                        Amount =
                            ToMinorUnits(
                                requestedAmount),

                        Metadata =
                            new Dictionary<string, string>
                            {
                                ["OrderId"] =
                                    orderId.ToString(),

                                ["PaymentId"] =
                                    payment.Id.ToString(),

                                ["PaymentRefundId"] =
                                    paymentRefund.Id.ToString(),

                                ["RequestedByAdminId"] =
                                    adminUserId.ToString()
                            }
                    };

                var requestOptions =
                    new RequestOptions
                    {
                        IdempotencyKey =
                            $"refund-{paymentRefund.Id}"
                    };

                var refundService =
                    new RefundService();

                var stripeRefund =
                    await refundService.CreateAsync(
                        refundOptions,
                        requestOptions);

                // 7. Store Stripe's refund ID.
                paymentRefund.StripeRefundId =
                    stripeRefund.Id;

                /*
                 * Do NOT immediately mark the whole Payment
                 * as Refunded here.
                 *
                 * Step 23's webhook will determine:
                 *
                 * Paid
                 * PartiallyRefunded
                 * Refunded
                 */

                paymentRefund.RefundStatus =
                    NormalizeRefundStatus(
                        stripeRefund.Status);

                await _context.SaveChangesAsync();

                _logger.LogInformation(
                    "Stripe refund {StripeRefundId} requested for OrderId {OrderId}. Amount {Amount}. Admin {AdminId}.",
                    stripeRefund.Id,
                    orderId,
                    requestedAmount,
                    adminUserId);
            }
            catch (StripeException ex)
            {
                paymentRefund.RefundStatus =
                    "Failed";

                paymentRefund.FailureReason =
                    ex.Message;

                await _context.SaveChangesAsync();

                _logger.LogError(
                    ex,
                    "Stripe refund request failed for OrderId {OrderId}.",
                    orderId);

                throw;
            }
        }
        public async Task<PaymentDetailsResponseDto?> GetPaymentByOrderAsync(int orderId,int userId,bool isAdmin)
        {
            var payment = await _context.Payments
                .AsNoTracking()
                .Include(x => x.Order)
                .Include(x => x.PaymentRefunds)
                .FirstOrDefaultAsync(x =>
                    x.OrderId == orderId);

            if (payment == null)
            {
                return null;
            }

            if (!isAdmin)
            {
                if (!payment.Order.UserId.HasValue ||
                    payment.Order.UserId.Value != userId)
                {
                    throw new UnauthorizedAccessException(
                        "You are not authorized to view this payment.");
                }
            }

            // Only successful refunds count as money
            // that has actually been refunded.
            var refundedAmount =
                payment.PaymentRefunds
                    .Where(x =>
                        string.Equals(
                            x.RefundStatus,
                            "Succeeded",
                            StringComparison.OrdinalIgnoreCase))
                    .Sum(x => x.Amount);

            // Pending refunds must also be reserved so that
            // the UI doesn't tell the admin they can refund
            // money that is already being processed.
            var pendingRefundAmount =
                payment.PaymentRefunds
                    .Where(x =>
                        string.Equals(
                            x.RefundStatus,
                            "Pending",
                            StringComparison.OrdinalIgnoreCase))
                    .Sum(x => x.Amount);

            var refundableAmount =
                payment.Amount -
                refundedAmount -
                pendingRefundAmount;

            if (refundableAmount < 0)
            {
                refundableAmount = 0;
            }

            return new PaymentDetailsResponseDto
            {
                OrderId =
                    payment.OrderId,

                PaymentMethod =
                    payment.PaymentMethod,

                PaymentStatus =
                    payment.PaymentStatus,

                Amount =
                    payment.Amount,

                RefundedAmount =
                    refundedAmount,

                RefundableAmount =
                    refundableAmount,

                StripePaymentIntentId =
                    payment.StripePaymentIntentId
            };
        }
        public async Task<VerifyPaymentResponseDto> VerifyPaymentAsync(int orderId,string sessionId)
        {
            if (string.IsNullOrWhiteSpace(sessionId))
            {
                throw new ArgumentException(
                    "Stripe session ID is required.");
            }

            var payment = await _context.Payments
                .AsNoTracking()
                .FirstOrDefaultAsync(x =>
                    x.OrderId == orderId &&
                    x.StripeCheckoutSessionId == sessionId);

            if (payment == null)
            {
                return new VerifyPaymentResponseDto
                {
                    IsPaid = false,
                    PaymentStatus = "Invalid"
                };
            }

            var sessionService = new SessionService();

            var session = await sessionService.GetAsync(sessionId);

            if (!session.Metadata.TryGetValue(
                    "OrderId",
                    out var stripeOrderId) ||
                stripeOrderId != orderId.ToString())
            {
                return new VerifyPaymentResponseDto
                {
                    IsPaid = false,
                    PaymentStatus = "Invalid"
                };
            }

            var isPaid =
                string.Equals(
                    session.PaymentStatus,
                    "paid",
                    StringComparison.OrdinalIgnoreCase)
                &&
                string.Equals(
                    payment.PaymentStatus,
                    "Paid",
                    StringComparison.OrdinalIgnoreCase);

            return new VerifyPaymentResponseDto
            {
                IsPaid = isPaid,
                PaymentStatus =
                    isPaid
                        ? "Paid"
                        : payment.PaymentStatus
            };
        }
    }
}
