using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Application.DTOs.Invoice
{
    public class InvoiceDto
    {
        // Invoice
        public string InvoiceNumber { get; set; } = string.Empty;

        public DateTime InvoiceDate { get; set; }

        // Order
        public int OrderId { get; set; }

        public DateTime OrderDate { get; set; }

        public string OrderStatus { get; set; } = string.Empty;

        // Customer / Delivery details
        public string CustomerName { get; set; } = string.Empty;

        public string? CustomerEmail { get; set; }

        public string CustomerMobile { get; set; } = string.Empty;

        // Delivery address
        public string AddressLine1 { get; set; } = string.Empty;

        public string? AddressLine2 { get; set; }

        public string City { get; set; } = string.Empty;

        public string State { get; set; } = string.Empty;

        public string PostalCode { get; set; } = string.Empty;

        public string Country { get; set; } = string.Empty;

        // Items
        public List<InvoiceItemDto> Items { get; set; } = [];

        // Amount
        public decimal TotalAmount { get; set; }

        // Payment
        public string PaymentMethod { get; set; } = string.Empty;

        public string PaymentStatus { get; set; } = string.Empty;

        public string Currency { get; set; } = "INR";

        public string? TransactionId { get; set; }

        public DateTime? PaidAt { get; set; }
    }
}
