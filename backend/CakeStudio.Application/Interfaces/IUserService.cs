using CakeStudio.Application.DTOs.Cake;
using CakeStudio.Application.DTOs.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Application.Interfaces
{
    public interface IUserService
    {
        Task<UserResponseDto?> GetByIdAsync(int id);

        Task<List<UserResponseDto>> GetAllAsync();

        Task<PagedResult<UserResponseDto>> GetPagedAsync(UserPagedRequestDto request);

        Task ToggleActiveStatusAsync(int id);

        Task DeleteAsync(int id);

        Task UpdateAsync(UpdateUserRequestDto request);

        Task ChangePasswordAsync(ChangePasswordRequestDto request);
    }
}
