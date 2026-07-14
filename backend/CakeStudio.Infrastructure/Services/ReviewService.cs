using CakeStudio.API.DbContexts.models;
using CakeStudio.Application.Common.Exceptions;
using CakeStudio.Application.DTOs.Cake;
using CakeStudio.Application.DTOs.Email;
using CakeStudio.Application.DTOs.Review;
using CakeStudio.Application.Interfaces;
using CakeStudio.Infrastructure.Repositories;
using CakeStudio.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Infrastructure.Services
{
    public class ReviewService : IReviewService
    {
        private readonly IUserContext _userContext;
        private readonly IReviewRepository _reviewRepository;
        private readonly CakeStudioDbContext _context;
        private readonly IEmailService _emailService;

        public ReviewService(IUserContext userContext, IReviewRepository reviewRepository, CakeStudioDbContext context, IEmailService emailService)
        {
            _userContext = userContext;
            _reviewRepository = reviewRepository;
            _context = context;
            _emailService = emailService;
        }

        public async Task CreateAsync(CreateReviewRequestDto request)
        {
            if (request.Rating < 1 ||
                request.Rating > 5)
            {
                throw new BadRequestException(
                    "Rating must be between 1 and 5");
            }

            var currentUser =
                _userContext.GetCurrentUser();

            var existingReview =
                await _reviewRepository
                    .GetByUserOrderItemAsync(
                        currentUser.UserId,
                        request.OrderItemId);

            if (existingReview != null)
            {
                throw new BadRequestException(
                    "Review already submitted");
            }


            var orderItem =
                            await _context.OrderItems
                                          .Include(x => x.Order)
                                          .FirstOrDefaultAsync(x =>
                                                                    x.Id == request.OrderItemId &&
                                                                    x.Order.UserId == currentUser.UserId &&
                                                                    x.Order.OrderStatus == "Delivered"
                                                                );

            if (orderItem == null)
            {
                throw new BadRequestException(
                    "Purchase required before review.");
            }

            if (orderItem.CakeId != request.CakeId)
            {
                throw new BadRequestException(
                    "Invalid cake.");
            }

            await _reviewRepository.AddAsync(
                                    new Review
                                    {
                                        UserId = currentUser.UserId,
                                        OrderItemId = request.OrderItemId,
                                        CakeId = request.CakeId,
                                        Rating = request.Rating,
                                        Comment = request.Comment,
                                        CreatedAt = DateTime.UtcNow,
                                        Status = "Pending"
                                    });
        }

        public async Task DeleteAsync(int reviewId)
        {
            var currentUser =
                _userContext.GetCurrentUser();

            var review =
                await _reviewRepository
                    .GetByIdAsync(reviewId);

            if (review == null)
                throw new NotFoundException("Review not found");

            if (review.UserId != currentUser.UserId)
                throw new NotFoundException("Access denied");

            await _reviewRepository.DeleteAsync(
                review);
        }

        public async Task<List<CakeReviewResponseDto>> GetCakeReviewsAsync(int cakeId)
        {
            return await _context.Reviews
                .Where(x => x.CakeId == cakeId)
                .OrderByDescending(x => x.CreatedAt)
                .Select(x => new CakeReviewResponseDto
                {
                    ReviewId = x.Id,
                    Rating = x.Rating,
                    Comment = x.Comment,
                    CreatedAt = x.CreatedAt,
                    UserName = x.User.FirstName + " " + x.User.LastName,
                    Reply = x.AdminReply,
                    ReviewCommentedDate = x.RepliedAt,
                    Status = x.Status
                })
                .ToListAsync();
        }

        public async Task UpdateAsync(UpdateReviewRequestDto request)
        {
            var currentUser =
                _userContext.GetCurrentUser();

            var review =
                await _reviewRepository
                    .GetByIdAsync(request.ReviewId);

            if (review == null)
                throw new NotFoundException("Review not found");

            if (review.UserId != currentUser.UserId)
                throw new UnauthorizedException("Access denied");

            review.Rating = request.Rating;
            review.Comment = request.Comment;
            review.UpdatedAt = DateTime.UtcNow;

            await _reviewRepository.SaveChangesAsync();
        }

        public async Task<ReviewResponseDto?> GetByOrderItemAsync(int orderItemId)
        {
            var review =
                await _reviewRepository
                    .GetByOrderItemAsync(orderItemId);

            if (review == null)
            {
                return null;
            }

            return new ReviewResponseDto
            {
                ReviewId = review.Id,

                OrderItemId = review.OrderItemId,

                CakeId = review.CakeId,

                Rating = review.Rating,

                Comment = review.Comment,

                CreatedAt = review.CreatedAt,

                UpdatedAt = review.UpdatedAt
            };
        }

        public async Task<PagedResult<AdminReviewResponseDto>> GetPagedReviewsAsync(ReviewPagedRequestDto request)
        {
            return await _reviewRepository
                .GetPagedReviewsAsync(request);
        }

        public async Task ReplyAsync(ReplyReviewRequestDto request)
        {
            var review =
                await _reviewRepository
                    .GetByIdAsync(request.ReviewId);

            if (review == null)
            {
                throw new NotFoundException(
                    "Review not found.");
            }

            review.AdminReply = request.Reply;

            review.RepliedAt = DateTime.UtcNow;

            review.Status = "Replied";

            await _reviewRepository.SaveChangesAsync();

            await _emailService.SendEmailAsync(
                new EmailRequestDto
                {
                    To = review.User.Email,

                    Subject = "CakeStudio has replied to your review 💌",

                    Body =
                        EmailTemplateService
                        .ReviewReplyTemplate(
                            review.User.FirstName,
                            review.Cake.Name,
                            review.Comment ?? "",
                            request.Reply)
                });
        }
    }
}
