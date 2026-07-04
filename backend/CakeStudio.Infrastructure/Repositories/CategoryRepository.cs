using CakeStudio.API.DbContexts.models;
using CakeStudio.Application.Common.Exceptions;
using CakeStudio.Application.DTOs.Cake;
using CakeStudio.Application.DTOs.Category;
using CakeStudio.Application.Helpers;
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
    public class CategoryRepository : ICategoryRepository
    {
        private readonly CakeStudioDbContext _context;

        public CategoryRepository(CakeStudioDbContext context)
        {
            _context = context;
        }
        public async Task<Category> AddAsync(Category category)
        {
            _context.Categories.Add(category);

            await _context.SaveChangesAsync();

            return category;
        }

        public async Task DeleteAsync(Category category)
        {
            

            _context.Categories.Remove(category);

            await _context.SaveChangesAsync();
        }

        public async Task<List<Category>> GetAllAsync()
        {
            return await _context.Categories.ToListAsync();
        }

        public async Task<Category?> GetByIdAsync(int id)
        {
            return await _context.Categories.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<PagedResult<Category>> GetPagedCakesAsync(CategoryFilterDto request)
        {
            IQueryable<Category> query = _context.Categories;

            // Search

            if (!string.IsNullOrWhiteSpace(request.Search))
            {
                query = query.Where(x => x.Name.Contains(request.Search));
            }

            // Category

            if (!string.IsNullOrWhiteSpace(request.CategoryName))
            {
                query = query.Where(x => x.Name == request.CategoryName);
            }

            // Min Price

            if (!string.IsNullOrWhiteSpace(request.status))
            {
                bool status = request.status.ToLower() == "active" ? true : false;
                query = query.Where(x => x.IsActive == status);
            }

            

            var totalRecords = await query.CountAsync();

            var categories = await query.OrderBy(x => x.Name).Skip((request.Page - 1) * request.PageSize).Take(request.PageSize).ToListAsync();

            return new PagedResult<Category>
            {
                Page = request.Page,

                PageSize = request.PageSize,

                TotalRecords = totalRecords,

                TotalPages =
                    (int)Math.Ceiling(
                        totalRecords /
                        (double)request.PageSize),

                Data = categories
            };
        }

        public async Task UpdateAsync(Category category)
        {
            _context.Categories.Update(category);

            await _context.SaveChangesAsync();
        }
    }
}
