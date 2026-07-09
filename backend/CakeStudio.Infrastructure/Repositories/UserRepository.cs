using CakeStudio.API.DbContexts.models;
using CakeStudio.Application.DTOs.Cake;
using CakeStudio.Application.DTOs.User;
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
    public class UserRepository : IUserRepository
    {
        private readonly CakeStudioDbContext _context;
        private readonly IUserContext _userContext;

        public UserRepository(CakeStudioDbContext context, IUserContext userContext)
        {
            _context = context;
            _userContext = userContext;
        }

        public async Task<User?> GetByEmailAsync(
            string email)
        {
            return await _context.Users
                .FirstOrDefaultAsync(x =>
                    x.Email == email);
        }

        public async Task<User?> GetByIdAsync(
            int userId)
        {
            return await _context.Users
                .FirstOrDefaultAsync(x =>
                    x.Id == userId);
        }

        public async Task AddUserAsync(
            User user)
        {
            await _context.Users.AddAsync(user);
        }


        public async Task<List<User>> GetAllAsync()
        {
            return await _context.Users
                .Where(x => !x.IsDeleted)
                .OrderBy(x => x.FirstName)
                .ToListAsync();
        }

        public async Task<PagedResult<User>> GetPagedAsync(
            UserPagedRequestDto request)
        {
            var query = _context.Users.AsQueryable();

            var totalRecords = await query.CountAsync();

            if (!string.IsNullOrWhiteSpace(request.search))
            {
                query = query.Where(x => x.FirstName.Contains(request.search) || x.LastName.Contains(request.search) || x.Email.Contains(request.search));
            }

            if(!string.IsNullOrWhiteSpace(request.isActive) && request.isActive != "All")
            {
                bool isActive = request.isActive == "Active";
                query = query.Where(x => x.IsActive == isActive);
            }

            var users = await query
                .Where(x => !x.IsDeleted)
                .OrderBy(x => x.FirstName)
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync();

            return new PagedResult<User>
            {
                Page = request.Page,
                PageSize = request.PageSize,
                TotalRecords = totalRecords,
                TotalPages =
                    (int)Math.Ceiling(
                        totalRecords / (double)request.PageSize),
                Data = users
            };
        }

        public async Task ToggleActiveStatusAsync(int id)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.Id == id);

            if (user == null)
                throw new Exception("User not found.");

            user.IsActive = !user.IsActive;
        }

        public async Task DeleteAsync(int id)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.Id == id);

            if (user == null)
                throw new Exception("User not found.");

            int userId =  _userContext.GetCurrentUser().UserId;

            user.IsDeleted = true;
            user.DeletedAt = DateTime.UtcNow;
            //user.DeletedBy = userId;

            await SaveChangesAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(User user)
        {
            _context.Users.Update(user);

            await _context.SaveChangesAsync();
        }
    }
}
