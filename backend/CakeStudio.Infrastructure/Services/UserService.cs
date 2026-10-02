using CakeStudio.Application.Common.Exceptions;
using CakeStudio.Application.DTOs.Cake;
using CakeStudio.Application.DTOs.Email;
using CakeStudio.Application.DTOs.User;
using CakeStudio.Application.Interfaces;
using CakeStudio.Infrastructure.Repositories;
using CakeStudio.Persistence.Entities;
using Org.BouncyCastle.Crypto.Generators;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Infrastructure.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _repository;
        private readonly IUserContext _userContext;
        private readonly IPasswordService _passwordService;
        private readonly IPasswordChangeOtpRepository _passwordChangeOtpRepository;
        private readonly IEmailService _emailService;
        private readonly IRefreshTokenRepository _refreshTokenRepository;

        public UserService(IUserRepository repository, IUserContext userContext, IPasswordService passwordService, IPasswordChangeOtpRepository passwordChangeOtpRepository, IEmailService emailService, IRefreshTokenRepository refreshTokenRepository)
        {
            _repository = repository;
            _userContext = userContext;
            _passwordService = passwordService;
            _passwordChangeOtpRepository = passwordChangeOtpRepository;
            _emailService = emailService;
            _refreshTokenRepository = refreshTokenRepository;
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
            var currentUser =
                _userContext.GetCurrentUser();

            var user =
                await _repository.GetByIdAsync(
                    currentUser.UserId);

            if (user == null)
            {
                throw new NotFoundException(
                    "User not found.");
            }


            // ==========================================
            // VALIDATE PASSWORD
            // ==========================================

            if (string.IsNullOrWhiteSpace(
                request.NewPassword))
            {
                throw new BadRequestException(
                    "New password is required.");
            }

            if (request.NewPassword.Length < 8)
            {
                throw new BadRequestException(
                    "Password must be at least 8 characters.");
            }

            if (request.NewPassword !=
                request.ConfirmPassword)
            {
                throw new BadRequestException(
                    "Passwords do not match.");
            }


            // ==========================================
            // VALIDATE OTP
            // ==========================================

            if (string.IsNullOrWhiteSpace(
                request.Otp))
            {
                throw new BadRequestException(
                    "OTP is required.");
            }


            var otpHash =
                Convert.ToHexString(
                    SHA256.HashData(
                        Encoding.UTF8.GetBytes(
                            request.Otp.Trim())));


            var passwordChangeOtp =
                await _passwordChangeOtpRepository
                    .GetValidOtpAsync(
                        user.Id,
                        otpHash);


            if (passwordChangeOtp == null)
            {
                throw new BadRequestException(
                    "Invalid or expired OTP.");
            }


            // ==========================================
            // UPDATE PASSWORD
            // ==========================================

            user.PasswordHash =
                _passwordService.HashPassword(
                    request.NewPassword);

            user.UpdatedAt =
                DateTime.UtcNow;


            // ==========================================
            // MARK OTP AS USED
            // ==========================================

            passwordChangeOtp.IsUsed = true;


            // ==========================================
            // SAVE
            // ==========================================

            await _repository.UpdateAsync(user);

            await _passwordChangeOtpRepository
                .SaveChangesAsync();


            // ==========================================
            // REVOKE LOGIN SESSIONS
            // ==========================================

            await _refreshTokenRepository.RemoveUserRefreshTokensAsync(user.Id);
        }

        public async Task SendChangePasswordOtpAsync(SendChangePasswordOtpRequestDto request)
        {
            var currentUser =
                _userContext.GetCurrentUser();

            var user =
                await _repository.GetByIdAsync(
                    currentUser.UserId);

            if (user == null)
            {
                throw new NotFoundException(
                    "User not found.");
            }


            // ------------------------------------------
            // VERIFY CURRENT PASSWORD
            // ------------------------------------------

            if (string.IsNullOrWhiteSpace(
                user.PasswordHash))
            {
                throw new BadRequestException(
                    "This account does not currently have a password.");
            }


            var currentPasswordHash =
                _passwordService.HashPassword(
                    request.CurrentPassword);

            if (user.PasswordHash !=
                currentPasswordHash)
            {
                throw new BadRequestException(
                    "Current password is incorrect.");
            }


            // ------------------------------------------
            // INVALIDATE PREVIOUS OTP
            // ------------------------------------------

            await _passwordChangeOtpRepository
                .InvalidateUserOtpsAsync(
                    user.Id);


            // ------------------------------------------
            // GENERATE 6-DIGIT OTP
            // ------------------------------------------

            var otp =
                RandomNumberGenerator
                    .GetInt32(
                        100000,
                        1000000)
                    .ToString();


            // ------------------------------------------
            // HASH OTP
            // ------------------------------------------

            var otpHash =
                Convert.ToHexString(
                    SHA256.HashData(
                        Encoding.UTF8.GetBytes(
                            otp)));


            // ------------------------------------------
            // SAVE OTP
            // ------------------------------------------

            var passwordChangeOtp =
                new PasswordChangeOtp
                {
                    UserId = user.Id,

                    OtpHash = otpHash,

                    ExpiryDate =
                        DateTime.UtcNow
                            .AddMinutes(5),

                    IsUsed = false,

                    CreatedAt =
                        DateTime.UtcNow
                };


            await _passwordChangeOtpRepository.AddAsync(passwordChangeOtp);

            await _passwordChangeOtpRepository.SaveChangesAsync();


            // ------------------------------------------
            // SEND EMAIL
            // ------------------------------------------

            var customerName = $"{user.FirstName} {user.LastName}".Trim();

            var emailBody = EmailTemplateService.PasswordChangeOtpTemplate(customerName,otp);

            await _emailService.SendEmailAsync(
                    new EmailRequestDto
                    {
                        To = user.Email,
                        Subject = "CakeStudio - Password Change OTP",
                        Body = emailBody
                    });
        }
    }
}
