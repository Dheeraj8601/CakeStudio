using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Application.DTOs.Payment
{
    public class PaymentDetailsResponseDto
    {
        public int OrderId { get; set; }

        public string PaymentMethod { get; set; } =
            string.Empty;

        public string PaymentStatus { get; set; } =
            string.Empty;

        public decimal Amount { get; set; }

        public decimal RefundedAmount { get; set; }

        public decimal RefundableAmount { get; set; }

        public string? StripePaymentIntentId { get; set; }
    }
}
