using CakeStudio.API.DbContexts.models;
using CakeStudio.Application.Common.Exceptions;
using CakeStudio.Application.DTOs.Invoice;
using CakeStudio.Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Playwright;
using System.Drawing;
using System.Net;
using static System.Net.Mime.MediaTypeNames;

namespace CakeStudio.Infrastructure.Services
{
    public class InvoiceService : IInvoiceService
    {
        private readonly CakeStudioDbContext _context;

        public InvoiceService(CakeStudioDbContext context)
        {
            _context = context;
        }

        public async Task<byte[]> GenerateInvoiceAsync(int orderId)
        {
            // ---------------------------------------------------------
            // 1. Get complete order information
            // ---------------------------------------------------------

            var order = await _context.Orders
                .AsNoTracking()
                .Include(x => x.Address)
                .Include(x => x.Payment)
                .Include(x => x.OrderItems)
                    .ThenInclude(x => x.Cake)
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


            // ---------------------------------------------------------
            // 2. Map database entities to InvoiceDto
            // ---------------------------------------------------------

            var invoice = new InvoiceDto
            {
                InvoiceNumber = $"CS-INV-{order.Id:D6}",

                InvoiceDate =
                    order.Payment?.PaidAt ?? DateTime.UtcNow,

                OrderId = order.Id,

                OrderDate = order.CreatedAt,

                OrderStatus = order.OrderStatus,

                CustomerName = order.Address.FullName,

                CustomerEmail = order.Address.Email,

                CustomerMobile = order.Address.Mobile,

                AddressLine1 = order.Address.AddressLine1,

                AddressLine2 = order.Address.AddressLine2,

                City = order.Address.City,

                State = order.Address.State,

                PostalCode = order.Address.PostalCode,

                Country = order.Address.Country,

                TotalAmount = order.TotalAmount,

                PaymentMethod = order.PaymentMethod,

                PaymentStatus = order.PaymentStatus,

                Currency = order.Payment?.Currency ?? "INR",

                TransactionId =
                    order.Payment?.StripePaymentIntentId,

                PaidAt =
                    order.Payment?.PaidAt,

                Items = order.OrderItems
                    .Select(item => new InvoiceItemDto
                    {
                        CakeName = item.Cake.Name,

                        Quantity = item.Quantity,

                        UnitPrice = item.UnitPrice,

                        TotalPrice =
                            item.UnitPrice * item.Quantity
                    })
                    .ToList()
            };


            // ---------------------------------------------------------
            // 3. Build invoice HTML
            // ---------------------------------------------------------

            var html = BuildInvoiceHtml(invoice);


            // ---------------------------------------------------------
            // 4. Start Playwright
            // ---------------------------------------------------------

            using var playwright =
                await Playwright.CreateAsync();

            await using var browser =
                await playwright.Chromium.LaunchAsync(
                    new BrowserTypeLaunchOptions
                    {
                        Headless = true
                    });


            // ---------------------------------------------------------
            // 5. Create browser page
            // ---------------------------------------------------------

            var page = await browser.NewPageAsync();


            // ---------------------------------------------------------
            // 6. Render HTML
            // ---------------------------------------------------------

            await page.SetContentAsync(
                html,
                new PageSetContentOptions
                {
                    WaitUntil = WaitUntilState.Load
                });


            // ---------------------------------------------------------
            // 7. Convert HTML to PDF
            // ---------------------------------------------------------

            var pdf = await page.PdfAsync(
                new PagePdfOptions
                {
                    Format = "A4",

                    PrintBackground = true,

                    Margin = new Margin
                    {
                        Top = "15mm",
                        Bottom = "15mm",
                        Left = "15mm",
                        Right = "15mm"
                    }
                });


            // ---------------------------------------------------------
            // 8. Return PDF bytes
            // ---------------------------------------------------------

            return pdf;
        }


        // =============================================================
        // BUILD INVOICE HTML
        // =============================================================

        private static string BuildInvoiceHtml(InvoiceDto invoice)
        {
            var itemRows = string.Join(
                "",
                invoice.Items.Select((item, index) =>
                {
                    return $$"""
                <tr>
                    <td>{{index + 1}}</td>

                    <td>
                        {{Encode(item.CakeName)}}
                    </td>

                    <td class="center">
                        {{item.Quantity}}
                    </td>

                    <td class="right">
                        {{FormatMoney(item.UnitPrice)}}
                    </td>

                    <td class="right">
                        {{FormatMoney(item.TotalPrice)}}
                    </td>
                </tr>
                """;
                }));

            var addressLine2 =
                string.IsNullOrWhiteSpace(invoice.AddressLine2)
                    ? ""
                    : $"{Encode(invoice.AddressLine2)}<br/>";

            var email =
                string.IsNullOrWhiteSpace(invoice.CustomerEmail)
                    ? ""
                    : $"""
                <div>
                    <strong>Email:</strong>
                    {Encode(invoice.CustomerEmail)}
                </div>
                """;

            var transaction =
                string.IsNullOrWhiteSpace(invoice.TransactionId)
                    ? ""
                    : $"""
                <div class="payment-row">
                    <span>Transaction ID</span>
                    <strong>
                        {Encode(invoice.TransactionId)}
                    </strong>
                </div>
                """;

            var paidAt =
                invoice.PaidAt.HasValue
                    ? $"""
                <div class="payment-row">
                    <span>Paid At</span>
                    <strong>
                        {invoice.PaidAt.Value:dd MMM yyyy, hh:mm tt}
                    </strong>
                </div>
                """
                    : "";

            return $$"""
        <!DOCTYPE html>

        <html>

        <head>

            <meta charset="UTF-8">

            <style>

                * {
                    box-sizing: border-box;
                }

                body {
                    margin: 0;
                    padding: 0;

                    font-family:
                        Arial,
                        Helvetica,
                        sans-serif;

                    color: #2b2b2b;
                    font-size: 13px;
                }

                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;

                    padding-bottom: 25px;

                    border-bottom: 2px solid #222;
                }

                .brand h1 {
                    margin: 0;

                    font-size: 30px;

                    letter-spacing: 1px;
                }

                .brand p {
                    margin-top: 6px;

                    color: #777;
                }

                .invoice-title {
                    text-align: right;
                }

                .invoice-title h2 {
                    margin: 0;

                    font-size: 25px;

                    text-transform: uppercase;
                }

                .invoice-number {
                    margin-top: 8px;

                    font-weight: bold;
                }

                .summary {
                    display: flex;

                    justify-content: space-between;

                    margin-top: 25px;

                    gap: 40px;
                }

                .summary-section {
                    width: 50%;
                }

                .section-title {
                    margin-bottom: 10px;

                    font-size: 11px;

                    font-weight: bold;

                    text-transform: uppercase;

                    letter-spacing: 1px;

                    color: #777;
                }

                .customer-name {
                    font-size: 16px;

                    font-weight: bold;

                    margin-bottom: 7px;
                }

                .address {
                    line-height: 1.6;
                }

                .info-row {
                    display: flex;

                    justify-content: space-between;

                    padding: 6px 0;

                    border-bottom: 1px solid #eee;
                }

                table {
                    width: 100%;

                    margin-top: 35px;

                    border-collapse: collapse;
                }

                thead {
                    background: #f3f3f3;
                }

                th {
                    padding: 11px;

                    font-size: 11px;

                    text-align: left;

                    text-transform: uppercase;

                    border-bottom: 2px solid #333;
                }

                td {
                    padding: 12px 11px;

                    border-bottom: 1px solid #e5e5e5;
                }

                .center {
                    text-align: center;
                }

                .right {
                    text-align: right;
                }

                .total-container {
                    display: flex;

                    justify-content: flex-end;

                    margin-top: 20px;
                }

                .total-box {
                    width: 300px;
                }

                .grand-total {
                    display: flex;

                    justify-content: space-between;

                    padding-top: 14px;

                    border-top: 2px solid #333;

                    font-size: 18px;

                    font-weight: bold;
                }

                .payment {
                    margin-top: 35px;

                    padding: 18px;

                    background: #f7f7f7;

                    border-radius: 5px;
                }

                .payment h3 {
                    margin-top: 0;

                    margin-bottom: 12px;

                    font-size: 14px;
                }

                .payment-row {
                    display: flex;

                    justify-content: space-between;

                    gap: 30px;

                    margin-top: 7px;
                }

                .payment-row strong {
                    text-align: right;

                    word-break: break-all;
                }

                .footer {
                    margin-top: 45px;

                    padding-top: 20px;

                    border-top: 1px solid #ddd;

                    text-align: center;

                    color: #777;

                    font-size: 11px;
                }

            </style>

        </head>

        <body>

            <div class="header">

                <div class="brand">

                    <h1>CakeStudio</h1>

                    <p>
                        Freshly baked for every celebration
                    </p>

                </div>

                <div class="invoice-title">

                    <h2>Invoice</h2>

                    <div class="invoice-number">
                        {{Encode(invoice.InvoiceNumber)}}
                    </div>

                </div>

            </div>

            <div class="summary">

                <div class="summary-section">

                    <div class="section-title">
                        Bill To
                    </div>

                    <div class="customer-name">
                        {{Encode(invoice.CustomerName)}}
                    </div>

                    <div class="address">

                        {{Encode(invoice.AddressLine1)}}
                        <br/>

                        {{addressLine2}}

                        {{Encode(invoice.City)}},
                        {{Encode(invoice.State)}}
                        -
                        {{Encode(invoice.PostalCode)}}

                        <br/>

                        {{Encode(invoice.Country)}}

                        <br/><br/>

                        <div>
                            <strong>Phone:</strong>
                            {{Encode(invoice.CustomerMobile)}}
                        </div>

                        {{email}}

                    </div>

                </div>

                <div class="summary-section">

                    <div class="section-title">
                        Order Information
                    </div>

                    <div class="info-row">

                        <span>Order ID</span>

                        <strong>
                            #{{invoice.OrderId}}
                        </strong>

                    </div>

                    <div class="info-row">

                        <span>Order Date</span>

                        <strong>
                            {{invoice.OrderDate.ToString("dd MMM yyyy")}}
                        </strong>

                    </div>

                    <div class="info-row">

                        <span>Invoice Date</span>

                        <strong>
                            {{invoice.InvoiceDate.ToString("dd MMM yyyy")}}
                        </strong>

                    </div>

                    <div class="info-row">

                        <span>Order Status</span>

                        <strong>
                            {{Encode(invoice.OrderStatus)}}
                        </strong>

                    </div>

                </div>

            </div>

            <table>

                <thead>

                    <tr>

                        <th style="width: 7%">
                            #
                        </th>

                        <th style="width: 43%">
                            Item
                        </th>

                        <th
                            class="center"
                            style="width: 12%">
                            Qty
                        </th>

                        <th
                            class="right"
                            style="width: 18%">
                            Unit Price
                        </th>

                        <th
                            class="right"
                            style="width: 20%">
                            Amount
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {{itemRows}}

                </tbody>

            </table>

            <div class="total-container">

                <div class="total-box">

                    <div class="grand-total">

                        <span>
                            Total
                        </span>

                        <span>
                            {{FormatMoney(invoice.TotalAmount)}}
                        </span>

                    </div>

                </div>

            </div>

            <div class="payment">

                <h3>
                    Payment Information
                </h3>

                <div class="payment-row">

                    <span>
                        Payment Method
                    </span>

                    <strong>
                        {{Encode(invoice.PaymentMethod)}}
                    </strong>

                </div>

                <div class="payment-row">

                    <span>
                        Payment Status
                    </span>

                    <strong>
                        {{Encode(invoice.PaymentStatus)}}
                    </strong>

                </div>

                <div class="payment-row">

                    <span>
                        Currency
                    </span>

                    <strong>
                        {{Encode(invoice.Currency)}}
                    </strong>

                </div>

                {{transaction}}

                {{paidAt}}

            </div>

            <div class="footer">

                <strong>
                    Thank you for choosing CakeStudio!
                </strong>

                <br/><br/>

                This invoice was generated electronically.

            </div>

        </body>

        </html>
        """;
        }


        // =============================================================
        // FORMAT MONEY
        // =============================================================

        private static string FormatMoney(decimal amount)
        {
            return $"₹{amount:N2}";
        }


        // =============================================================
        // HTML ENCODE
        // =============================================================

        private static string Encode(string? value)
        {
            return WebUtility.HtmlEncode(value ?? string.Empty);
        }
    }
}