using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Application.DTOs.Order
{
    public class CreateOrderRequestDto
    {
        public int? AddressId { get; set; }

        public GuestAddressDto? GuestAddress { get; set; }
        public List<GuestOrderItemDto> Items { get; set; } = [];

        public string PaymentMethod { get; set; } = string.Empty;
    }
}
