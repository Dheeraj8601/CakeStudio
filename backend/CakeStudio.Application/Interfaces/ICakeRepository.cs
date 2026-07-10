

using CakeStudio.Application.DTOs.Cake;
using CakeStudio.Application.DTOs.Review;
using CakeStudio.Persistence.Entities;

namespace CakeStudio.Application.Interfaces
{
    public interface ICakeRepository
    {
        Task<Cake> AddAsync(Cake cake);

        Task<Cake?> GetByIdAsync(int id);

        Task<List<Cake>> GetAllAsync();

        Task UpdateAsync(Cake cake);

        Task DeleteAsync(Cake cake);
        Task<PagedResult<Cake>> GetPagedCakesAsync(CakeFilterRequestDto request);
        Task<PagedResult<Cake>> GetCatalogAsync(CakeCatalogFilterDto request);

        Task<Cake?> GetByIdAsyncCatalog(int id);

        Task<List<Cake>> GetCartItems(List<int> ids);
        Task<List<RatingFilterResponseDto>> GetRatingFiltersAsync();
    }
}
