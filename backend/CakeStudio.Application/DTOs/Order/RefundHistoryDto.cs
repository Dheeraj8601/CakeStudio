using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Application.DTOs.Order
{
    public class RefundHistoryDto
    {
        public decimal Amount { get; set; }

        public string Status { get; set; } = string.Empty;

        public string? StripeRefundId { get; set; }

        public string? RefundReason { get; set; }

        public DateTime RequestedAt { get; set; }

        public DateTime? RefundedAt { get; set; }
    }
}
