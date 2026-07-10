using CakeStudio.Application.DTOs.Cake;
using CakeStudio.Application.DTOs.Review;
using CakeStudio.Persistence.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Application.Interfaces
{
    public interface IReviewRepository
    {
        Task<Review?> GetByUserOrderItemAsync(int userId,int orderItemId);

        Task AddAsync(Review review);

        Task<Review?> GetByIdAsync(int reviewId);

        Task<List<Review>> GetByCakeIdAsync(int cakeId);

        Task DeleteAsync(Review review);

        Task SaveChangesAsync();

        Task<Review?> GetByOrderItemAsync(int orderItemId);
        Task<PagedResult<AdminReviewResponseDto>> GetPagedReviewsAsync(ReviewPagedRequestDto request);
    }
}
