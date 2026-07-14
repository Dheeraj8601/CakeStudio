using CakeStudio.Application.Common.Exceptions;
using CakeStudio.Application.DTOs.Cart;
using CakeStudio.Application.DTOs.Wishlist;
using CakeStudio.Application.Interfaces;
using CakeStudio.Persistence.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Infrastructure.Services
{
    public class WishlistService : IWishlistService
    {
        private readonly IUserContext _userContext;
        private readonly IWishlistRepository _wishlistRepository;
        private readonly ICartService _cartService;
        private readonly IFileUpload _fileUpload;

        public WishlistService(IUserContext userContext, IWishlistRepository wishlistRepository, ICartService cartService, IFileUpload fileUpload)
        {
            _userContext = userContext;
            _wishlistRepository = wishlistRepository;
            _cartService = cartService;
            _fileUpload = fileUpload;
        }
        public async Task AddAsync(AddWishlistRequestDto request)
        {
            var currentUser =
                _userContext.GetCurrentUser();

            var existing =
                await _wishlistRepository.GetAsync(
                    currentUser.UserId,
                    request.CakeId);

            if (existing != null)
            {
                throw new Exception(
                    "Cake already exists in wishlist");
            }

            await _wishlistRepository.AddAsync(
                new Wishlist
                {
                    UserId = currentUser.UserId,
                    CakeId = request.CakeId,
                    CreatedAt = DateTime.UtcNow
                });
        }
        public async Task<List<WishlistResponseDto>> GetMyWishlistAsync()
        {
            var currentUser =
                _userContext.GetCurrentUser();

            var items =
                await _wishlistRepository
                    .GetByUserIdAsync(
                        currentUser.UserId);

            return items.Select(x =>
                new WishlistResponseDto
                {
                    WishlistId = x.Id,
                    CakeId = x.CakeId,
                    CakeName = x.Cake.Name,
                    Price = x.Cake.Price,
                    ImageUrl = x.Cake.ImageUrl,
                    IsEggless = x.Cake.IsEggless
                })
                .ToList();
        }
        public async Task RemoveAsync(int wishlistId)
        {
            var currentUser =
                _userContext.GetCurrentUser();

            var wishlist =
                await _wishlistRepository
                    .GetByIdAsync(wishlistId);

            if (wishlist == null)
                throw new Exception(
                    "Wishlist item not found");

            if (wishlist.UserId != currentUser.UserId)
                throw new Exception(
                    "Access denied");

            await _wishlistRepository
                .DeleteAsync(wishlist);
        }

        public async Task RemoveByCakeId(int id)
        {
            var currentUser = _userContext.GetCurrentUser();

            var wishlist = await _wishlistRepository.GetByUserIdAsync(currentUser.UserId);

            if(wishlist == null)
            {
                throw new Exception("Wishlist item not found");
            }

            var cake = wishlist.FirstOrDefault(x => x.CakeId == id);
            if(cake == null)
            {
                throw new Exception("Cake not found.");
            }
            await _wishlistRepository.DeleteAsync(cake);
        }
        public async Task<WishlistPagedResponseDto> GetWishlistAsync(WishlistFilterRequestDto request)
        {
            var currentUser = _userContext.GetCurrentUser();

            var result = await _wishlistRepository.GetPagedWishlistAsync(currentUser.UserId,request);

            return new WishlistPagedResponseDto
            {
                Page = result.Page,

                PageSize = result.PageSize,

                TotalRecords = result.TotalRecords,

                TotalPages = result.TotalPages,

                Data = result.Data.Select(x => new WishlistItemDto
                {
                    WishlistId = x.Id,

                    CakeId = x.CakeId,

                    Name = x.Cake.Name,

                    ImageUrl = _fileUpload.GetImageUrl(x.Cake.ImageUrl),

                    Price = x.Cake.Price,

                    Description = x.Cake.Description,

                    InStock = x.Cake.StockQuantity > 0,
                    Weight = "1.0 Kg",

                    //Rating = x.Cake.AverageRating,

                    Reviews = x.Cake.Reviews.Count
                }).ToList()
            };
        }

        public async Task MoveAllToCartAsync()
        {
            var currentUser =
                _userContext.GetCurrentUser();

            var wishlists =
                await _wishlistRepository
                    .GetByUserIdAsync(currentUser.UserId);

            if (!wishlists.Any())
            {
                throw new BadRequestException(
                    "Wishlist is empty.");
            }

            foreach (var wishlist in wishlists)
            {
                await _cartService.AddToCartAsync(
                    new AddToCartRequestDto
                    {
                        CakeId = wishlist.CakeId,
                        Quantity = 1
                    });
            }

            await _wishlistRepository.DeleteRangeAsync(wishlists);
        }

        public async Task<List<int>> GetWishlistCakeIdsAsync()
        {
            var currentUser =
                _userContext.GetCurrentUser();

            return await _wishlistRepository
                .GetWishlistCakeIdsAsync(
                    currentUser.UserId);
        }
    }
}
