using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Application.DTOs.Cake
{
    public class CartItemResponseDto
    {
        public int Id { get; set; }
        public int productId { get; set; }
        public string Name { get; set; } = string.Empty;

        public decimal Price { get; set; }

        public string? ImageUrl { get; set; }

        public bool IsAvailable { get; set; }
    }
}
