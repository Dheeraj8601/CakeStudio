using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Application.DTOs.Wishlist
{
    public class WishlistItemDto
    {
        public int WishlistId { get; set; }

        public int CakeId { get; set; }

        public string Name { get; set; } = string.Empty;

        public string? ImageUrl { get; set; }

        public decimal Price { get; set; }

        public decimal Rating { get; set; }

        public int Reviews { get; set; }

        public bool InStock { get; set; }

        public string Weight { get; set; }

        public string? Description { get; set; }
    }
}
