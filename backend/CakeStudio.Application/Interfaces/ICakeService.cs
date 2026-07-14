using CakeStudio.Application.DTOs.Cake;
using CakeStudio.Application.DTOs.Review;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Application.Interfaces
{
    public interface ICakeService
    {
        Task<CakeResponseDto> CreateAsync(CreateCakeRequestDto request);
        Task<CakeResponseDto> UpdateAsync(UpdateCakeRequestDto request);
        Task DeleteAsync(int id);
        Task<List<CakeResponseDto>> GetAllAsync();
        Task<CakeResponseDto?> GetByIdAsync(int id);
        Task<PagedResult<CakeListResponseDto>> GetCakesAsync(CakeFilterRequestDto request);
        Task<PagedResult<CakeCatalogResponseDto>> GetCatalogAsync(CakeCatalogFilterDto request);
        Task<CakeCatalogResponseDto?> GetCatalogCakeByIdAsync(int id);
        Task<List<CartItemResponseDto>> GetCartItemsAsync(CartItemsRequestDto request);
        Task<List<RatingFilterResponseDto>> GetRatingFiltersAsync();
        Task<List<CakeCardResponseDto>> GetFeaturedCakesAsync();
    }
}
