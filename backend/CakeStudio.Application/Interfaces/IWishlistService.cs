using CakeStudio.Application.DTOs.Wishlist;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Application.Interfaces
{
    public interface IWishlistService
    {
        Task AddAsync(AddWishlistRequestDto request);
        Task RemoveAsync(int wishlistId);
        Task<List<WishlistResponseDto>> GetMyWishlistAsync();
        Task<WishlistPagedResponseDto> GetWishlistAsync(WishlistFilterRequestDto request);
        Task MoveAllToCartAsync();
        Task<List<int>> GetWishlistCakeIdsAsync();
        Task RemoveByCakeId(int id);
    }
}
