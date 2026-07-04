using CakeStudio.Application.DTOs.Cake;
using CakeStudio.Application.DTOs.User;
using CakeStudio.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Infrastructure.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _repository;

        public UserService(
            IUserRepository repository)
        {
            _repository = repository;
        }

        public async Task<UserResponseDto?> GetByIdAsync(int id)
        {
            var user =
                await _repository.GetByIdAsync(id);

            if (user == null)
                return null;

            return new UserResponseDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Role = user.Role,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt
            };
        }

        public async Task<List<UserResponseDto>> GetAllAsync()
        {
            var users =
                await _repository.GetAllAsync();

            return users.Select(user =>
                new UserResponseDto
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    Role = user.Role,
                    IsActive = user.IsActive,
                    CreatedAt = user.CreatedAt
                })
                .ToList();
        }

        public async Task<PagedResult<UserResponseDto>>
            GetPagedAsync(UserPagedRequestDto request)
        {
            var result =
                await _repository.GetPagedAsync(
                    request);

            return new PagedResult<UserResponseDto>
            {
                Page = result.Page,
                PageSize = result.PageSize,
                TotalRecords = result.TotalRecords,
                TotalPages = result.TotalPages,

                Data = result.Data
                    .Select(user =>
                        new UserResponseDto
                        {
                            Id = user.Id,
                            FirstName = user.FirstName,
                            LastName = user.LastName,
                            Email = user.Email,
                            Role = user.Role,
                            IsActive = user.IsActive,
                            CreatedAt = user.CreatedAt
                        })
                    .ToList()
            };
        }

        public async Task ToggleActiveStatusAsync(int id)
        {
            await _repository.ToggleActiveStatusAsync(id);

            await _repository.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);

            await _repository.SaveChangesAsync();
        }
    }
}
