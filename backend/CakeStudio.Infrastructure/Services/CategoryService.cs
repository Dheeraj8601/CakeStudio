using CakeStudio.Application.Common.Exceptions;
using CakeStudio.Application.DTOs.Cake;
using CakeStudio.Application.DTOs.Category;
using CakeStudio.Application.Helpers;
using CakeStudio.Application.Interfaces;
using CakeStudio.Application.Services;
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
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IAuditService _auditService;
        private readonly IUserContext _userContext;
        private readonly IFileUpload _fileupload;

        public CategoryService(ICategoryRepository categoryRepository, IAuditService auditService, IUserContext userContext, IFileUpload fileUpload)
        {
            _categoryRepository = categoryRepository;
            _auditService = auditService;
            _userContext = userContext;
            _fileupload = fileUpload;
        }
        public async Task<CategoryResponseDto> CreateAsync(CategoryRequestDto request)
        {
            string url = await FileUploadHelper.UploadImageAsync(request.imageFile, "Category");
            var category = new Category
            {
                Name = request.CategoryName,
                Description = request.Description,
                ImageUrl = url,
                IsActive = request.isActive,
                CreatedDate = DateTime.Now,
                ModifiedDate = DateTime.Now
            };

            await _categoryRepository.AddAsync(category);

            await _auditService.LogAsync("Create", "Cake", category.Id.ToString(), null, new
            {
                category.Name,
                category.Description
            });

            return new CategoryResponseDto
            {
                Id = category.Id,
                CategoryName = category.Name,
                Description = category.Description,
                createdOn = category.CreatedDate,
                imageUrl = category.ImageUrl,
                isActive= category.IsActive
            };
        }

        public async Task DeleteAsync(int id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);

            if (category == null)
            {
                throw new BadRequestException($"Category with ID {category.Id} not found");
            }
            if (!string.IsNullOrWhiteSpace(category.ImageUrl))
            {
                FileUploadHelper.DeleteImage(category.ImageUrl);
            }

            _categoryRepository.DeleteAsync(category);

        }

        public async Task<List<CategoryResponseDto>> GetAllAsync()
        {
            var category = await _categoryRepository.GetAllAsync();
            return category.Select(x => new CategoryResponseDto
            {
                Id = x.Id,
                CategoryName = x.Name,
                Description = x.Description,
                createdOn = x.CreatedDate,
                imageUrl = x.ImageUrl,
                isActive = x.IsActive
            }).ToList();

        }

        public async Task<CategoryResponseDto?> GetByIdAsync(int id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);

            return new CategoryResponseDto
            {
                Id = category.Id,
                CategoryName = category.Name,
                Description = category.Description,
                createdOn = category.CreatedDate,
                imageUrl = category.ImageUrl,
                isActive = category.IsActive
            };
        }

        public async Task<PagedResult<CategoryResponseDto>> GetCakesAsync(CategoryFilterDto request)
        {
            var result =
                await _categoryRepository
                    .GetPagedCakesAsync(
                        request);

            return new PagedResult<
                CategoryResponseDto>
            {
                Page = result.Page,

                PageSize = result.PageSize,

                TotalRecords =
                    result.TotalRecords,

                TotalPages =
                    result.TotalPages,

                Data =
                    result.Data.Select(x =>
                        new CategoryResponseDto
                        {
                            Id = x.Id,
                            CategoryName = x.Name,
                            Description = x.Description,
                            isActive = x.IsActive,
                            imageUrl =  _fileupload.GetImageUrl(x.ImageUrl),
                            createdOn =
                                x.CreatedDate
                        })
                    .ToList()
            };
        }

        public async Task<CategoryResponseDto> UpdateAsync(CategoryRequestDto request)
        {
            var category = await _categoryRepository.GetByIdAsync(request.Id);

            if (category == null)
                throw new NotFoundException("category not found");

            var oldData = new
            {
                category.Name,
                category.Description,
                category.IsActive
            };

            category.Name = request.CategoryName;
            category.Description = request.Description;
            category.IsActive = request.isActive;
            category.ModifiedDate = DateTime.Now;
            category.ModifiedBy = _userContext.GetCurrentUser().UserId;
            

            var newData = new
            {
                category.Name,
                category.Description,
                category.IsActive
            };

            await _auditService.LogAsync("Update", "Cake", category.Id.ToString(), oldData, newData);

            await _categoryRepository.UpdateAsync(category);
            return new CategoryResponseDto
            {
                Id = category.Id,
                CategoryName = category.Name,
                Description = category.Description,
                createdOn = category.CreatedDate,
                imageUrl = category.ImageUrl,
                isActive = category.IsActive
            };
        }
    }
}
