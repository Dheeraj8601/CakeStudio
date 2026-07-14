using CakeStudio.Application.Common.Exceptions;
using CakeStudio.Application.DTOs.Cake;
using CakeStudio.Application.DTOs.Review;
using CakeStudio.Application.Helpers;
using CakeStudio.Application.Interfaces;
using CakeStudio.Persistence.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Infrastructure.Services
{
    public class CakeService : ICakeService
    {
        private readonly ICakeRepository _cakeRepository;
        private readonly IAuditService _auditService;
        private readonly IUserContext _userContext;
        private readonly IFileUpload _fileUpload;

        public CakeService(ICakeRepository cakeRepository, IAuditService auditService, IUserContext userContext, IFileUpload fileUpload)
        {
            _cakeRepository = cakeRepository;
            _auditService = auditService;
            _userContext = userContext;
            _fileUpload = fileUpload;
        }

        public async Task<CakeResponseDto> CreateAsync(CreateCakeRequestDto request)
        {
            string url = await FileUploadHelper.UploadImageAsync(request.ImageFile, "Cakes");
            var cake = new Cake
            {
                CategoryId = request.CategoryId,
                Name = request.Name,
                Description = request.Description,
                Price = request.Price,
                StockQuantity = request.StockQuantity,
                ImageUrl = url,
                IsEggless = request.IsEggless,
                IsAvailable = true
            };

            await _cakeRepository.AddAsync(cake);

            await _auditService.LogAsync("Create","Cake",cake.Id.ToString(),null,new
            {
                cake.Name,
                cake.Price,
                cake.StockQuantity
            });

            return new CakeResponseDto
            {
                Id = cake.Id,
                Name = cake.Name,
                Price = cake.Price,
                StockQuantity = cake.StockQuantity,
                ImageUrl = url,
                IsAvailable = cake.IsAvailable
            };
        }

        public async Task<List<CakeResponseDto>> GetAllAsync()
        {
            var cakes = await _cakeRepository.GetAllAsync();

            return cakes.Select(x => new CakeResponseDto
            {
                Id = x.Id,
                Name = x.Name,
                Price = x.Price,
                StockQuantity = x.StockQuantity,
                ImageUrl = x.ImageUrl,
                IsAvailable = x.IsAvailable
            }).ToList();
        }

        public async Task<CakeResponseDto?> GetByIdAsync(int id)
        {
            var cake = await _cakeRepository.GetByIdAsync(id);

            if (cake == null)
                return null;

            return new CakeResponseDto
            {
                Id = cake.Id,
                Name = cake.Name,
                Price = cake.Price,
                IsEggless = cake.IsEggless,
                Description = cake.Description,
                category = cake.CategoryId,
                StockQuantity = cake.StockQuantity,
                ImageUrl = _fileUpload.GetImageUrl(cake.ImageUrl),
                IsAvailable = cake.IsAvailable
            };
        }

        public async Task<CakeResponseDto> UpdateAsync(UpdateCakeRequestDto request)
        { 
            string? url = request.ImageUrl ?? "";
            if (request.ImageFile != null)
            {
                 url = await FileUploadHelper.UploadImageAsync(request.ImageFile, "Cakes");
            }
            var cake = await _cakeRepository.GetByIdAsync(request.Id);


            if (cake == null)
                throw new NotFoundException("Cake not found");

            var oldData = new
            {
                cake.Name,
                cake.Price,
                cake.StockQuantity
            };

            cake.Name = request.Name;
            cake.Description = request.Description;
            cake.Price = request.Price;
            cake.StockQuantity = request.StockQuantity;
            cake.ImageUrl = url != "" ? url : cake.ImageUrl;
            cake.IsEggless = request.IsEggless;
            cake.IsAvailable = request.IsAvailable;

            var newData = new
            {
                cake.Name,
                cake.Price,
                cake.StockQuantity
            };

            await _auditService.LogAsync("Update","Cake",cake.Id.ToString(),oldData,newData);

            await _cakeRepository.UpdateAsync(cake);

            return new CakeResponseDto
            {
                Id = cake.Id,
                Name = cake.Name,
                Price = cake.Price,
                StockQuantity = cake.StockQuantity,
                ImageUrl = cake.ImageUrl,
                IsAvailable = cake.IsAvailable
            };
        }

        public async Task DeleteAsync(int id)
        {
            var cake = await _cakeRepository.GetByIdAsync(id);

            if (cake == null)
                throw new NotFoundException("Cake not found");

            cake.IsDeleted = true;
            cake.DeletedAt = DateTime.UtcNow;
            cake.DeletedBy = _userContext.GetCurrentUser().UserId;

            await _cakeRepository.DeleteAsync(cake);
        }

        public async Task<PagedResult<CakeListResponseDto>> GetCakesAsync(CakeFilterRequestDto request)
        {
            var result =
                await _cakeRepository
                    .GetPagedCakesAsync(
                        request);

            return new PagedResult<
                CakeListResponseDto>
            {
                Page = result.Page,

                PageSize = result.PageSize,

                TotalRecords =
                    result.TotalRecords,

                TotalPages =
                    result.TotalPages,

                Data =
                    result.Data.Select(x =>
                        new CakeListResponseDto //176
                        {
                            CakeId = x.Id,
                            Name = x.Name,
                            Price = x.Price,
                            Category = x.Category.Name,
                            ImageUrl = _fileUpload.GetImageUrl(x.ImageUrl),
                            StockQuantity =
                                x.StockQuantity
                        })
                    .ToList()
            };
        }

        public async Task<PagedResult<CakeCatalogResponseDto>> GetCatalogAsync(CakeCatalogFilterDto request)
        {
            var result =
                await _cakeRepository
                    .GetCatalogAsync(request);

            return new PagedResult<CakeCatalogResponseDto>
            {
                Page = result.Page,

                PageSize = result.PageSize,

                TotalRecords = result.TotalRecords,

                TotalPages = result.TotalPages,

                Data = result.Data.Select(x => new CakeCatalogResponseDto
                {
                    Id = x.Id,

                    Name = x.Name,

                    Price = x.Price,

                    ImageUrl =_fileUpload.GetImageUrl(x.ImageUrl),

                    Category = x.Category.Name,

                    IsEggless = x.IsEggless,

                    IsAvailable = x.IsAvailable,

                    StockQuantity = x.StockQuantity,

                    AverageRating =
                        x.Reviews.Any()
                            ? Math.Round(
                                x.Reviews.Average(r => r.Rating),
                                1)
                            : 0,
                    rating = x.Reviews.Any()
                            ? Math.Round(
                                x.Reviews.Average(r => r.Rating),
                                1)
                            : 0,
                    reviewCount = x.Reviews.Count,
                    TotalReviews = 
                        x.Reviews.Count
                })
                .ToList()
            };
        }

        public async Task<CakeCatalogResponseDto?> GetCatalogCakeByIdAsync(int id)
        {
            var cake = await _cakeRepository.GetByIdAsyncCatalog(id);

            if (cake == null)
            {
                return null;
            }

            return new CakeCatalogResponseDto
            {
                Id = cake.Id,

                Name = cake.Name,

                Price = cake.Price,

                ImageUrl = _fileUpload.GetImageUrl(cake.ImageUrl),

                Category = cake.Category.Name,

                IsEggless = cake.IsEggless,

                IsAvailable = cake.IsAvailable,

                StockQuantity = cake.StockQuantity,

                weight = "0.5 kg, 1 kg",

                delievery = "Same Day / Next Day",

                rating = cake.Reviews.Any()
                                    ? Math.Round( cake.Reviews.Average(x => x.Rating),1)
                                    : 0,

                reviewCount =cake.Reviews.Count,
                flavour = cake.Category.Name,
                images = Enumerable.Repeat(_fileUpload.GetImageUrl(cake.ImageUrl), 5).ToList(),

                AverageRating =
                    cake.Reviews.Any()
                        ? Math.Round(
                            cake.Reviews.Average(x => x.Rating),
                            1)
                        : 0,

                TotalReviews =
                    cake.Reviews.Count
            };
        }

        public async Task<List<CartItemResponseDto>> GetCartItemsAsync(CartItemsRequestDto request)
        {
            var cake = await _cakeRepository.GetCartItems(request.ProductIds);

            var data = cake.Select(x => new CartItemResponseDto
            {
                Id = x.Id,
                productId = x.Id,
                Name = x.Name,
                Price = x.Price,
                ImageUrl = _fileUpload.GetImageUrl(x.ImageUrl),
                IsAvailable = true

            }).ToList();

            return data;
        }

        public async Task<List<RatingFilterResponseDto>> GetRatingFiltersAsync()
        {
            return await _cakeRepository
                .GetRatingFiltersAsync();
        }

        public async Task<List<CakeCardResponseDto>> GetFeaturedCakesAsync()
        {
            var cakes =
                await _cakeRepository
                    .GetFeaturedCakesAsync(4);

            return cakes.Select(cake =>

                new CakeCardResponseDto
                {
                    Id = cake.Id,

                    Name = cake.Name,

                    Price = cake.Price,

                    ImageUrl =
                        _fileUpload.GetImageUrl(
                            cake.ImageUrl),

                    Rating =
                        cake.Reviews.Any()
                            ? Math.Round(
                                cake.Reviews.Average(x => x.Rating),
                                1)
                            : 0,

                    TotalReviews =
                        cake.Reviews.Count
                })

                .ToList();
        }
    }
}
