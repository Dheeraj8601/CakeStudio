using CakeStudio.Application.DTOs.Cake;
using CakeStudio.Application.DTOs.Review;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Application.Interfaces
{
    public interface IReviewService
    {
        Task CreateAsync(CreateReviewRequestDto request);
        Task UpdateAsync(UpdateReviewRequestDto request);
        Task DeleteAsync(int reviewId);
        Task<List<CakeReviewResponseDto>> GetCakeReviewsAsync(int cakeId);
        Task<ReviewResponseDto?> GetByOrderItemAsync(int orderItemId);
        Task<PagedResult<AdminReviewResponseDto>> GetPagedReviewsAsync(ReviewPagedRequestDto request);
        Task ReplyAsync(ReplyReviewRequestDto request);
    }
}
