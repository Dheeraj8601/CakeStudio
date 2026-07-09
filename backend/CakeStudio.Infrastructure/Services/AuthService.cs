using CakeStudio.API.DbContexts.models;
using CakeStudio.Application.DTOs.Auth;
using CakeStudio.Application.DTOs.Email;
using CakeStudio.Application.Interfaces;
using CakeStudio.Application.Services;
using CakeStudio.Infrastructure.Security;
using CakeStudio.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Infrastructure.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IRefreshTokenRepository _refreshTokenRepository;
        private readonly IPasswordService _passwordService;
        private readonly IJwtService _jwtService;
        private readonly IRefreshTokenService _refreshTokenService;
        private readonly IEmailService _emailService;
        private readonly ILogger<AuthService> _logger;

        public AuthService(IUserRepository userRepository, IRefreshTokenRepository refreshTokenRepository, IPasswordService passwordService,IJwtService jwtService,IRefreshTokenService refreshTokenService,IEmailService emailService,ILogger<AuthService> logger)
        {
            _userRepository = userRepository;
            _passwordService = passwordService;
            _refreshTokenRepository = refreshTokenRepository;
            _jwtService = jwtService;
            _refreshTokenService = refreshTokenService;
            _emailService = emailService;
            _logger = logger;
        }

        public async Task<RegisterResponseDto> RegisterAsync(RegisterRequestDto request)
        {
            var existingUser = await _userRepository.GetByEmailAsync(request.Email);

            if (existingUser != null)
            {
                return new RegisterResponseDto
                {
                    Success = false,
                    Message = "Email already exists"
                };
            }

            var user = new User
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                PasswordHash = _passwordService.HashPassword(request.Password),
                Role = "Customer",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            await _userRepository.AddUserAsync(user);

            await _userRepository.SaveChangesAsync();

            await _emailService.SendEmailAsync(new EmailRequestDto
            {
                To = user.Email,

                Subject = "Welcome To CakeStudio 🎂",

                Body = EmailTemplateService.WelcomeTemplate(user.FirstName,user.Email,user.PhoneNumber ?? "Not Provided")
            });

            _logger.LogInformation("User {Email} registered successfully",request.Email);

            return new RegisterResponseDto
            {
                Success = true,
                Message = "Registration successful"
            };
        }
        public async Task<LoginResponseDto> LoginAsync(LoginRequestDto request)
        {
            var passwordHash =
                _passwordService.HashPassword(request.Password);

            var user = await _userRepository.GetByEmailAsync(request.Email);

            if (user == null || user.PasswordHash != passwordHash)
            {
                _logger.LogWarning("Failed login attempt for {Email}",request.Email);
                return new LoginResponseDto
                {
                    Success = false,
                    Message = "Invalid email or password"
                };
            }

            var accessToken = _jwtService.GenerateToken(user);

            await _refreshTokenRepository.RemoveUserRefreshTokensAsync(user.Id);//102

            var refreshToken = _refreshTokenService.GenerateRefreshToken();

            var dbRefreshToken = new RefreshToken
            {
                UserId = user.Id,
                Token = refreshToken,
                ExpiryDate = DateTime.UtcNow.AddDays(7),
                IsRevoked = false
            };

            await _refreshTokenRepository.AddAsync(dbRefreshToken);

            await _refreshTokenRepository.SaveChangesAsync();

            _logger.LogInformation("User {Email} logged in successfully",request.Email);

            return new LoginResponseDto
            {
                Success = true,
                Message = "Login successful",
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                UserId = user.Id,
                Role = user.Role
            };
        }
        public async Task<RefreshTokenResponseDto> RefreshTokenAsync(RefreshTokenRequestDto request)
        {
            var refreshToken = await _refreshTokenRepository.GetValidTokenAsync(request.RefreshToken);

            if (refreshToken == null)
            {
                throw new Exception("Invalid refresh token");
            }

            if (refreshToken.ExpiryDate < DateTime.UtcNow)
            {
                throw new Exception("Refresh token expired");
            }

            var newAccessToken =
                _jwtService.GenerateToken(refreshToken.User);

            return new RefreshTokenResponseDto
            {
                AccessToken = newAccessToken
            };
        }
    }
}
