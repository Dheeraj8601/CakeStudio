using CakeStudio.Application.Common.Exceptions;
using CakeStudio.Application.DTOs.Cake;
using CakeStudio.Application.DTOs.User;
using CakeStudio.Application.Interfaces;
using Org.BouncyCastle.Crypto.Generators;
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
        private readonly IUserContext _userContext;
        private readonly IPasswordService _passwordService;

        public UserService(IUserRepository repository, IUserContext userContext, IPasswordService passwordService)
        {
            _repository = repository;
            _userContext = userContext;
            _passwordService = passwordService;
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
                CreatedAt = user.CreatedAt,
                PhoneNumber = user.PhoneNumber
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

        public async Task UpdateAsync(UpdateUserRequestDto request)
        {
            var user =
                await _repository.GetByIdAsync(request.Id);

            if (user == null)
                throw new NotFoundException("User not found.");

            if (user.Email != request.Email)
            {
                var existingUser = await _repository.GetByEmailAsync(request.Email);

                if (existingUser != null && existingUser.Id != request.Id)
                {
                    throw new BadRequestException("Email is already registered.");
                }

                user.Email = request.Email;
            }

            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            user.PhoneNumber = request.PhoneNumber;

            await _repository.UpdateAsync(user);
        }

        public async Task ChangePasswordAsync(ChangePasswordRequestDto request)
        {
            var currentUser = _userContext.GetCurrentUser();

            var user = await _repository.GetByIdAsync(currentUser.UserId);

            if (user == null)
            {
                throw new NotFoundException("User not found.");
            }

            var currentPasswordHash = _passwordService.HashPassword(request.CurrentPassword);

            if (user.PasswordHash != currentPasswordHash)
            {
                throw new BadRequestException("Current password is incorrect.");
            }

            if (request.NewPassword != request.ConfirmPassword)
            {
                throw new BadRequestException("Passwords do not match.");
            }

            user.PasswordHash = _passwordService.HashPassword(request.NewPassword);

            await _repository.UpdateAsync(user);
        }
    }
}
