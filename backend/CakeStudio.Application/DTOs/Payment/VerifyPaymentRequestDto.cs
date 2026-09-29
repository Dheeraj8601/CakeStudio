using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Application.DTOs.Payment
{
    public class VerifyPaymentRequestDto
    {
        public int OrderId { get; set; }
        public string SessionId { get; set; } = string.Empty;
    }
}
