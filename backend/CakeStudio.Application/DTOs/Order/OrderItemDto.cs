using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Application.DTOs.Order
{
    public class OrderItemDto
    {
        public int OrderItemId { get; set; }

        public int CakeId { get; set; }

        public string CakeName { get; set; } = string.Empty;

        public string ImageUrl { get; set; } = string.Empty;

        public int Quantity { get; set; }

        public decimal UnitPrice { get; set; }

        public decimal TotalPrice { get; set; }

        public bool HasReviewed { get; set; }

        public int? ReviewId { get; set; }

        public int? Rating { get; set; }

        public string? Comment { get; set; }
    }
}
