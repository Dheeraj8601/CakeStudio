using CakeStudio.Application.DTOs.Address;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Application.DTOs.Order
{
    public class OrderResponseDto
    {
        public int OrderId { get; set; }

        public decimal TotalAmount { get; set; }

        public string OrderStatus { get; set; } = string.Empty;

        public string PaymentStatus { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = string.Empty;
        public decimal RefundedAmount { get; set; }

        public decimal RefundableAmount { get; set; }
        public string? EstimatedDelivery { get; set; }
        public string? StripePaymentIntentId { get; set; }

        public DateTime? PaymentDate { get; set; }
        public AddressResponseDto? ShippingAddress { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<RefundHistoryDto> Refunds { get; set; } = new();
        public List<OrderItemDto> Items { get; set; }
            = new();
    }
}
