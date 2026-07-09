using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Application.DTOs.Cart
{
    public class CartResponseDto
    {
        //public int CartId { get; set; }

        //public decimal GrandTotal { get; set; }

        //public List<CartItemResponseDto> Items { get; set; }
        //    = new();
        public int cartItemId { get; set; }
        public int productId { get; set; }
        public int quantity { get; set; }
    }
}
