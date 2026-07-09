using CakeStudio.API.DbContexts.models;
using CakeStudio.Application.DTOs.Cake;
using CakeStudio.Application.Interfaces;
using CakeStudio.Infrastructure.Services;
using CakeStudio.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Infrastructure.Repositories
{
    public class CakeRepository : ICakeRepository
    {
        private readonly CakeStudioDbContext _context;

        public CakeRepository(CakeStudioDbContext context, IUserContext userContext)
        {
            _context = context;
        }

        public async Task<Cake> AddAsync(Cake cake)
        {
            _context.Cakes.Add(cake);

            await _context.SaveChangesAsync();

            return cake;
        }

        public async Task<Cake?> GetByIdAsync(int id)
        {
            return await _context.Cakes.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<List<Cake>> GetAllAsync()
        {
            return await _context.Cakes.Where(x => x.IsDeleted == false).ToListAsync();
        }

        public async Task UpdateAsync(Cake cake)
        {
            _context.Cakes.Update(cake);

            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Cake cake)
        {
            await _context.SaveChangesAsync();
        }

        public async Task<PagedResult<Cake>> GetPagedCakesAsync(CakeFilterRequestDto request)
        {
            IQueryable<Cake> query = _context.Cakes.Where(x => !x.IsDeleted).Include(x => x.Category).Include(x => x.DeletedByNavigation);

            // Search

            if (!string.IsNullOrWhiteSpace(request.Search))
            {
                query = query.Where(x => x.Name.Contains(request.Search));
            }

            // Category

            if (!string.IsNullOrWhiteSpace(request.Category))
            {
                query = query.Where(x => x.Category.Name == request.Category);
            }

            // Min Price

            if (request.MinPrice.HasValue)
            {
                query = query.Where(x => x.Price >= request.MinPrice.Value);
            }

            // Max Price

            if (request.MaxPrice.HasValue)
            {
                query = query.Where(x => x.Price <= request.MaxPrice.Value);
            }

            var totalRecords = await query.CountAsync();

            var cakes = await query.OrderBy(x => x.Name).Skip((request.Page - 1) * request.PageSize).Take(request.PageSize).ToListAsync(); //89

            return new PagedResult<Cake>
            {
                Page = request.Page,

                PageSize = request.PageSize,

                TotalRecords = totalRecords,

                TotalPages =
                    (int)Math.Ceiling(
                        totalRecords /
                        (double)request.PageSize),

                Data = cakes
            };
        }

        public async Task<PagedResult<Cake>> GetCatalogAsync(CakeCatalogFilterDto request)
        {
            IQueryable<Cake> query =
                _context.Cakes
                    .Include(x => x.Category)
                    .Include(x => x.Reviews)
                    .Where(x =>
                        !x.IsDeleted &&
                        x.IsAvailable);

            if (!string.IsNullOrWhiteSpace(request.Search))
            {
                query = query.Where(x =>
                    x.Name.Contains(request.Search));
            }

            if (request.CategoryIds != null && request.CategoryIds.Any())
            {
                query = query.Where(x =>
                    request.CategoryIds.Contains(
                        x.CategoryId));
            }

            if (request.MinPrice.HasValue)
            {
                query = query.Where(x =>
                    x.Price >= request.MinPrice);
            }

            if (request.MaxPrice.HasValue)
            {
                query = query.Where(x =>
                    x.Price <= request.MaxPrice);
            }

            if (request.Ratings != null && request.Ratings.Any())
            {
                query = query.Where(x => x.Reviews.Any() && request.Ratings.Contains((int)Math.Floor(x.Reviews.Average(r => r.Rating))));
            }

            query = request.SortBy switch
            {
                "priceLow" =>
                    query.OrderBy(x => x.Price),

                "priceHigh" =>
                    query.OrderByDescending(x => x.Price),

                "rating" =>
                    query.OrderByDescending(x =>
                        x.Reviews.Any()
                            ? x.Reviews.Average(r => r.Rating)
                            : 0),

                "newest" =>
                    query.OrderByDescending(x =>
                        x.CreatedAt),

                _ =>
                    query.OrderBy(x => x.Name)
            };

            var totalRecords = await query.CountAsync();

            var cakes = await query.Skip((request.Page - 1) * request.PageSize).Take(request.PageSize).ToListAsync();

            return new PagedResult<Cake>
            {
                Page = request.Page,
                PageSize = request.PageSize,
                TotalRecords = totalRecords,
                TotalPages = (int)Math.Ceiling(totalRecords /(double)request.PageSize),
                Data = cakes
            };


        }

        public async Task<Cake?> GetByIdAsyncCatalog(int id)
        {
            return await _context.Cakes

                .Include(x => x.Category)

                .Include(x => x.Reviews)

                .FirstOrDefaultAsync(x =>
                    x.Id == id &&
                    !x.IsDeleted);
        }

        public Task<List<Cake>> GetCartItems(List<int> ids)
        {
            return _context.Cakes
                .Where(x => ids.Contains(x.Id))
                .ToListAsync();
        }
    }
}
