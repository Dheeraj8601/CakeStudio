using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Application.DTOs.Payment
{
    public class VerifyPaymentResponseDto
    {
        public bool IsPaid { get; set; }
        public string PaymentStatus { get; set; } = string.Empty;
    }
}
