using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Application.DTOs.Cake
{
    public class CartItemsRequestDto
    {
        public List<int> ProductIds { get; set; } = [];
    }
}
