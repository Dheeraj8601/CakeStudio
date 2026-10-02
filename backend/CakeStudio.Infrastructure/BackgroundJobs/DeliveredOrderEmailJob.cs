using CakeStudio.API.DbContexts.models;
using CakeStudio.Application.Common.Exceptions;
using CakeStudio.Application.DTOs.Email;
using CakeStudio.Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace CakeStudio.Infrastructure.BackgroundJobs
{
    public class DeliveredOrderEmailJob : IDeliveredOrderEmailJob
    {
        private readonly CakeStudioDbContext _context;
        private readonly IInvoiceService _invoiceService;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;
        private readonly ILogger<DeliveredOrderEmailJob> _logger;

        public DeliveredOrderEmailJob(
            CakeStudioDbContext context,
            IInvoiceService invoiceService,
            IEmailService emailService,
            IConfiguration configuration,
            ILogger<DeliveredOrderEmailJob> logger)
        {
            _context = context;
            _invoiceService = invoiceService;
            _emailService = emailService;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendAsync(int orderId)
        {
            _logger.LogInformation(
                "Delivered invoice email job started for Order {OrderId}",
                orderId);

            var order = await _context.Orders
                .AsNoTracking()
                .Include(x => x.Address)
                .Include(x => x.User)
                .FirstOrDefaultAsync(x => x.Id == orderId);

            if (order == null)
            {
                throw new NotFoundException("Order not found.");
            }

            if (order.Address == null)
            {
                throw new BadRequestException(
                    "Order does not have a delivery address.");
            }

            // Safety check:
            // Invoice email should only be generated for delivered orders.
            if (!order.OrderStatus.Equals(
                    "Delivered",
                    StringComparison.OrdinalIgnoreCase))
            {
                throw new BadRequestException(
                    "Invoice email can only be sent for a delivered order.");
            }

            var recipientEmail = order.Address.Email;

            if (string.IsNullOrWhiteSpace(recipientEmail))
            {
                recipientEmail = order.User?.Email;
            }

            if (string.IsNullOrWhiteSpace(recipientEmail))
            {
                throw new BadRequestException(
                    "Customer email address is not available.");
            }

            // Generate PDF inside the Hangfire worker.
            var pdfBytes =
                await _invoiceService.GenerateInvoiceAsync(orderId);

            var frontendBaseUrl =
                _configuration.GetValue<string>("Frontend:BaseUrl");

            var body = BuildDeliveredEmail(
                order.Id,
                order.Address.FullName,
                frontendBaseUrl);

            var emailRequest = new EmailRequestDto
            {
                To = recipientEmail,

                Subject =
                    $"CakeStudio - Order #{order.Id} Delivered",

                Body = body,

                Attachments =
                [
                    new EmailAttachmentDto
                    {
                        FileName =
                            $"CakeStudio_Invoice_{order.Id}.pdf",

                        Content = pdfBytes,

                        ContentType = "application/pdf"
                    }
                ]
            };

            // Same CC behavior you already use:
            // if delivery email differs from account email,
            // also send a copy to account email.
            if (order.User != null &&
                !string.IsNullOrWhiteSpace(order.User.Email) &&
                !string.Equals(
                    order.User.Email,
                    recipientEmail,
                    StringComparison.OrdinalIgnoreCase))
            {
                emailRequest.Cc =
                [
                    order.User.Email
                ];
            }

            await _emailService.SendEmailAsync(emailRequest);

            _logger.LogInformation(
                "Delivered invoice email job completed for Order {OrderId}",
                orderId);
        }

        private static string BuildDeliveredEmail(
            int orderId,
            string customerName,
            string? frontendBaseUrl)
        {
            var orderUrl =
                string.IsNullOrWhiteSpace(frontendBaseUrl)
                    ? null
                    : $"{frontendBaseUrl.TrimEnd('/')}/orders/{orderId}";

            var viewOrderButton =
                string.IsNullOrWhiteSpace(orderUrl)
                    ? ""
                    : $"""
                        <div style="margin-top:24px;">
                            <a href="{orderUrl}"
                               style="
                                   display:inline-block;
                                   padding:12px 20px;
                                   background:#222;
                                   color:#fff;
                                   text-decoration:none;
                                   border-radius:5px;">
                                View Order
                            </a>
                        </div>
                        """;

            return $"""
                <!DOCTYPE html>
                <html>
                <body style="
                    margin:0;
                    padding:0;
                    font-family:Arial,Helvetica,sans-serif;
                    background:#f5f5f5;">

                    <div style="
                        max-width:600px;
                        margin:30px auto;
                        background:#ffffff;
                        padding:30px;">

                        <h2 style="margin-top:0;">
                            Your order has been delivered 🎂
                        </h2>

                        <p>
                            Hi {System.Net.WebUtility.HtmlEncode(customerName)},
                        </p>

                        <p>
                            Your CakeStudio order
                            <strong>#{orderId}</strong>
                            has been delivered successfully.
                        </p>

                        <p>
                            Your invoice is attached to this email as a PDF.
                        </p>

                        {viewOrderButton}

                        <p style="
                            margin-top:30px;
                            color:#666;">
                            Thank you for choosing CakeStudio!
                        </p>

                    </div>

                </body>
                </html>
                """;
        }
    }
}