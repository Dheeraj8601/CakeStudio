using CakeStudio.Application.DTOs.Cake;
using CakeStudio.Application.DTOs.User;
using CakeStudio.Persistence.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Application.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetByEmailAsync(string email);

        Task<User?> GetByIdAsync(int userId);

        Task AddUserAsync(User user);

        Task SaveChangesAsync();

        Task<List<User>> GetAllAsync();

        Task<PagedResult<User>> GetPagedAsync(
            UserPagedRequestDto request);

        Task ToggleActiveStatusAsync(int id);

        Task DeleteAsync(int id);

        Task UpdateAsync(User user);

    }
}
