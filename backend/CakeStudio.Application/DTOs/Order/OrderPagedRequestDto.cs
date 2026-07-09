using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Application.DTOs.Order
{
    public class OrderPagedRequestDto
    {
        public string? Search { get; set; }

        public string? PaymentStatus { get; set; }

        public string? OrderStatus { get; set; }

        public int PageNumber { get; set; } = 1;

        public int PageSize { get; set; } = 10;
    }
}
