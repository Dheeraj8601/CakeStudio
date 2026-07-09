using CakeStudio.API.DbContexts.models;
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
        public async Task<PaymentSessionResponseDto> CreateSessionAsync(int orderId)
        {
            StripeConfiguration.ApiKey =
                _configuration["StripeSettings:SecretKey"];

            var order = await _context.Orders
                .Include(x => x.OrderItems)
                .ThenInclude(x => x.Cake)
                .FirstOrDefaultAsync(x => x.Id == orderId);

            if (order == null)
                throw new Exception("Order not found");

            var lineItems = order.OrderItems
                .Select(item => new SessionLineItemOptions
                {
                    Quantity = item.Quantity,

                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        Currency = "inr",

                        UnitAmountDecimal =
                            item.UnitPrice * 100,

                        ProductData =
                            new SessionLineItemPriceDataProductDataOptions
                            {
                                Name = item.Cake.Name
                            }
                    }
                })
                .ToList();

            var options = new SessionCreateOptions
            {
                Mode = "payment",

                SuccessUrl = _configuration["StripeSettings:SuccessUrl"],

                CancelUrl = _configuration["StripeSettings:CancelUrl"],

                LineItems = lineItems,

                Metadata = new Dictionary<string, string>
                           {
                                {
                                    "OrderId",
                                    order.Id.ToString()
                                }
                            }
            };

            var service = new SessionService();

            var session =
                await service.CreateAsync(options);

            order.StripeSessionId = session.Id;
            order.StripePaymentIntentId = session.PaymentIntentId;     
            order.PaymentStatus = "Pending";

            await _context.SaveChangesAsync();

            return new PaymentSessionResponseDto
            {
                SessionId = session.Id,
                CheckoutUrl = session.Url
            };
        }
        public async Task PaymentFailedAsync(string paymentIntentId)
        {
            using var transaction =
                await _context.Database
                .BeginTransactionAsync();

            try
            {
                var order =
                    await _context.Orders
                    .FirstOrDefaultAsync(
                        x =>
                        x.StripePaymentIntentId ==
                        paymentIntentId);


                if (order == null)
                    return;


                order.PaymentStatus =
                    "Failed";


                order.OrderStatus =
                    "Cancelled";


                _context.PaymentAudits.Add(
                    new PaymentAudit
                    {
                        OrderId = order.Id,

                        StripeSessionId =
                            order.StripeSessionId,

                        Status = "Failed",

                        Remarks =
                        "Stripe payment failed",

                        CreatedAt =
                        DateTime.UtcNow
                    });


                await _context.SaveChangesAsync();


                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();

                throw;
            }
        }

        public async Task PaymentSuccessAsync(string sessionId)
        {
            var order = await _context.Orders
                .Include(x => x.User)
                .Include(x => x.OrderItems)
                    .ThenInclude(x => x.Cake)
                .FirstOrDefaultAsync(
                    x => x.StripeSessionId == sessionId);

            if (order == null)
            {
                return;
            }

            // Idempotency Check
            if (order.PaymentStatus == "Paid")
            {
                return;
            }

            using var transaction =
                await _context.Database
                    .BeginTransactionAsync();

            try
            {
                order.PaymentStatus = "Paid";

                order.OrderStatus = "Confirmed";

                foreach (var item in order.OrderItems)
                {
                    item.Cake.StockQuantity -= item.Quantity;

                    await _inventoryRepository
                        .AddTransactionAsync(
                            new InventoryTransaction
                            {
                                CakeId = item.CakeId,

                                Quantity = -item.Quantity,

                                TransactionType = "Sale",

                                Remarks =
                                    $"Order #{order.Id}",

                                CreatedBy =
                                    order.UserId ?? 0,

                                CreatedAt =
                                    DateTime.UtcNow
                            });
                }

                // Optional Payment Audit
                _context.PaymentAudits.Add(
                    new PaymentAudit
                    {
                        OrderId = order.Id,

                        StripeSessionId = sessionId,

                        Status = "Paid",

                        Remarks =
                            "Stripe payment successful",

                        CreatedAt =
                            DateTime.UtcNow
                    });

                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                await _emailService.SendEmailAsync(
                    new EmailRequestDto
                    {
                        To = order.User.Email,

                        Subject =
                            "Payment Successful - CakeStudio",

                        Body =
                            EmailTemplateService
                                .PaymentSuccessTemplate(
                                    order.User.FirstName,
                                    order.Id,
                                    order.TotalAmount,
                                    order.StripePaymentIntentId,
                                    "UPI",
                                    DateTime.Now.ToString(
                                        "dd MMM yyyy, hh:mm tt"))
                    });

                _logger.LogInformation(
                    "Payment successful for OrderId {OrderId}",
                    order.Id);
            }
            catch
            {
                await transaction.RollbackAsync();

                throw;
            }
        }
    }
}
