using CakeStudio.Application.DTOs.Cake;
using CakeStudio.Application.DTOs.Wishlist;
using CakeStudio.Persistence.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Application.Interfaces
{
    public interface IWishlistRepository
    {
        Task<Wishlist?> GetAsync(int userId,int cakeId);

        Task<List<Wishlist>> GetByUserIdAsync(int userId);

        Task<Wishlist?> GetByIdAsync(int wishlistId);

        Task AddAsync(Wishlist wishlist);

        Task DeleteAsync(Wishlist wishlist);

        Task<PagedResult<Wishlist>> GetPagedWishlistAsync(int userId,WishlistFilterRequestDto request);
    }
}
