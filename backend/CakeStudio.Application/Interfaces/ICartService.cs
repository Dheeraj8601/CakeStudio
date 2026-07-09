using CakeStudio.Application.DTOs.Cart;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Application.Interfaces
{
    public interface ICartService
    {
        Task AddToCartAsync(AddToCartRequestDto request);

        Task UpdateQuantityAsync(UpdateCartItemRequestDto request);

        Task RemoveItemAsync(int cartItemId);

        Task<List<CartResponseDto>> GetMyCartAsync();
    }
}
