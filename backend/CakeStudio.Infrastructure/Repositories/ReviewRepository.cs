using CakeStudio.API.DbContexts.models;
using CakeStudio.Application.DTOs.Cake;
using CakeStudio.Application.DTOs.Review;
using CakeStudio.Application.Interfaces;
using CakeStudio.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Infrastructure.Repositories
{
    public class ReviewRepository : IReviewRepository
    {
        private readonly CakeStudioDbContext _context;

        public ReviewRepository(
            CakeStudioDbContext context)
        {
            _context = context;
        }

        public async Task<Review?> GetByUserOrderItemAsync(
    int userId,
    int orderItemId)
        {
            return await _context.Reviews
                .FirstOrDefaultAsync(x =>
                    x.UserId == userId &&
                    x.OrderItemId == orderItemId);
        }

        public async Task AddAsync(Review review)
        {
            _context.Reviews.Add(review);

            await _context.SaveChangesAsync();
        }

        public async Task<Review?> GetByIdAsync(int reviewId)
        {
            return await _context.Reviews
                .Include(x => x.User).Include(x => x.Cake)
                .FirstOrDefaultAsync(
                    x => x.Id == reviewId);
        }

        public async Task<List<Review>>
            GetByCakeIdAsync(int cakeId)
        {
            return await _context.Reviews
                .Include(x => x.User)
                .Where(x => x.CakeId == cakeId)
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();
        }

        public async Task DeleteAsync(Review review)
        {
            _context.Reviews.Remove(review);

            await _context.SaveChangesAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task<Review?> GetByOrderItemAsync(int orderItemId)
        {
            return await _context.Reviews
                .FirstOrDefaultAsync(x =>
                    x.OrderItemId == orderItemId);
        }

        public async Task<PagedResult<AdminReviewResponseDto>> GetPagedReviewsAsync(ReviewPagedRequestDto request)
        {
            var query = _context.Reviews

                .Include(x => x.User)

                .Include(x => x.Cake)

                .Include(x => x.OrderItem)

                .ThenInclude(x => x.Order)

                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.Search))
            {
                query = query.Where(x =>

                    x.User.FirstName.Contains(request.Search) ||

                    x.User.LastName.Contains(request.Search) ||

                    x.User.Email.Contains(request.Search) ||

                    x.Cake.Name.Contains(request.Search));
            }

            if (request.Rating.HasValue)
            {
                query = query.Where(x =>
                    x.Rating == request.Rating);
            }

            var totalRecords = await query.CountAsync();

            var data = await query

                .OrderByDescending(x => x.CreatedAt)

                .Skip((request.PageNumber - 1) * request.PageSize)

                .Take(request.PageSize)

                .Select(x => new AdminReviewResponseDto
                {
                    ReviewId = x.Id,

                    OrderId = x.OrderItem.OrderId,

                    OrderItemId = x.OrderItemId,

                    CustomerName =
                        x.User.FirstName + " " + x.User.LastName,

                    Email = x.User.Email,

                    CakeName = x.Cake.Name,

                    Rating = x.Rating,

                    Comment = x.Comment,
                    Status = x.Status,
                    RepliedOn = x.RepliedAt,
                    Reply = x.AdminReply,

                    CreatedAt = x.CreatedAt
                })

                .ToListAsync();

            return new PagedResult<AdminReviewResponseDto>
            {
                Page = request.PageNumber,

                PageSize = request.PageSize,

                TotalRecords = totalRecords,

                TotalPages = (int)Math.Ceiling(
                    totalRecords / (double)request.PageSize),

                Data = data
            };
        }
    }
}
