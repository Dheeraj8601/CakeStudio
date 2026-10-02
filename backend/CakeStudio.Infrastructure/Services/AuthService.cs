using CakeStudio.API.DbContexts.models;
using CakeStudio.Application.DTOs.Auth;
using CakeStudio.Application.DTOs.Email;
using CakeStudio.Application.Interfaces;
using CakeStudio.Application.Services;
using CakeStudio.Infrastructure.Security;
using CakeStudio.Infrastructure.Services;
using CakeStudio.Persistence.Entities;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Google.Apis.Auth;
using Hangfire;

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
        private readonly IPasswordResetTokenRepository _passwordResetTokenRepository;
        private readonly IConfiguration _configuration;
        private readonly IBackgroundJobClient _backgroundJobClient;

        public AuthService(IUserRepository userRepository, IRefreshTokenRepository refreshTokenRepository, IPasswordService passwordService,IJwtService jwtService,IRefreshTokenService refreshTokenService,IEmailService emailService,ILogger<AuthService> logger, IPasswordResetTokenRepository passwordResetTokenRepository, IConfiguration configuration, IBackgroundJobClient backgroundJobClient)
        {
            _userRepository = userRepository;
            _passwordService = passwordService;
            _refreshTokenRepository = refreshTokenRepository;
            _jwtService = jwtService;
            _passwordResetTokenRepository = passwordResetTokenRepository;
            _refreshTokenService = refreshTokenService;
            _emailService = emailService;
            _logger = logger;
            _configuration = configuration;
            _backgroundJobClient = backgroundJobClient;
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

            _backgroundJobClient.Enqueue<IEmailBackgroundJob>(job => job.SendEmailAsync(
                                        new EmailRequestDto
                                        {
                                            To = user.Email,
                                            Subject = "Welcome To CakeStudio 🎂",
                                            Body = EmailTemplateService.WelcomeTemplate(user.FirstName,user.Email,user.PhoneNumber ?? "Not Provided")
                                        }
            ));

            _logger.LogInformation("User {Email} registered successfully",request.Email);

            return new RegisterResponseDto
            {
                Success = true,
                Message = "Registration successful"
            };
        }
        public async Task<LoginResponseDto> LoginAsync(LoginRequestDto request)
        {
            var user =
                await _userRepository
                    .GetByEmailAsync(request.Email);

            // User doesn't exist OR account has no local password
            if (
                user == null ||
                string.IsNullOrWhiteSpace(user.PasswordHash)
            )
            {
                _logger.LogWarning(
                    "Failed login attempt for {Email}",
                    request.Email);

                return new LoginResponseDto
                {
                    Success = false,
                    Message = "Invalid email or password"
                };
            }

            var passwordHash =
                _passwordService.HashPassword(
                    request.Password);

            if (user.PasswordHash != passwordHash)
            {
                _logger.LogWarning(
                    "Failed login attempt for {Email}",
                    request.Email);

                return new LoginResponseDto
                {
                    Success = false,
                    Message = "Invalid email or password"
                };
            }

            var accessToken =
                _jwtService.GenerateToken(user);

            await _refreshTokenRepository
                .RemoveUserRefreshTokensAsync(user.Id);

            var refreshToken =
                _refreshTokenService
                    .GenerateRefreshToken();

            var dbRefreshToken =
                new RefreshToken
                {
                    UserId = user.Id,
                    Token = refreshToken,
                    ExpiryDate =
                        DateTime.UtcNow.AddDays(7),
                    IsRevoked = false
                };

            await _refreshTokenRepository
                .AddAsync(dbRefreshToken);

            await _refreshTokenRepository
                .SaveChangesAsync();

            _logger.LogInformation(
                "User {Email} logged in successfully",
                request.Email);

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
            if (string.IsNullOrWhiteSpace(
                request.RefreshToken))
            {
                throw new Exception(
                    "Refresh token is required.");
            }

            var existingToken =
                await _refreshTokenRepository
                    .GetValidTokenAsync(
                        request.RefreshToken);

            if (existingToken == null)
            {
                throw new Exception(
                    "Invalid refresh token.");
            }

            if (existingToken.IsRevoked)
            {
                throw new Exception(
                    "Refresh token has been revoked.");
            }

            if (
                existingToken.ExpiryDate
                <= DateTime.UtcNow
            )
            {
                throw new Exception(
                    "Refresh token expired.");
            }

            // -----------------------------------------
            // Revoke old refresh token
            // -----------------------------------------

            existingToken.IsRevoked = true;

            // -----------------------------------------
            // Generate new access token
            // -----------------------------------------

            var newAccessToken =
                _jwtService.GenerateToken(
                    existingToken.User);

            // -----------------------------------------
            // Generate new refresh token
            // -----------------------------------------

            var newRefreshToken =
                _refreshTokenService
                    .GenerateRefreshToken();

            var dbRefreshToken =
                new RefreshToken
                {
                    UserId =
                        existingToken.UserId,

                    Token =
                        newRefreshToken,

                    ExpiryDate =
                        DateTime.UtcNow
                            .AddDays(7),

                    IsRevoked =
                        false
                };

            await _refreshTokenRepository
                .AddAsync(
                    dbRefreshToken);

            await _refreshTokenRepository
                .SaveChangesAsync();

            _logger.LogInformation(
                "Refresh token rotated for User {UserId}",
                existingToken.UserId);

            return new RefreshTokenResponseDto
            {
                AccessToken =
                    newAccessToken,

                RefreshToken =
                    newRefreshToken
            };
        }
        public async Task LogoutAsync(LogoutRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(
                request.RefreshToken))
            {
                return;
            }

            var refreshToken =
                await _refreshTokenRepository
                    .GetByTokenAsync(
                        request.RefreshToken);

            if (refreshToken == null)
            {
                return;
            }

            if (refreshToken.IsRevoked)
            {
                return;
            }

            refreshToken.IsRevoked = true;

            await _refreshTokenRepository
                .SaveChangesAsync();

            _logger.LogInformation(
                "User {UserId} logged out successfully",
                refreshToken.UserId);
        }
        public async Task ForgotPasswordAsync(ForgotPasswordRequestDto request)
        {
            var user =
                await _userRepository
                    .GetByEmailAsync(request.Email);

            // Do not reveal whether an email exists.
            if (user == null)
            {
                _logger.LogInformation(
                    "Password reset requested for unknown email.");

                return;
            }

            // Invalidate previous unused reset links
            await _passwordResetTokenRepository
                .InvalidateUserTokensAsync(user.Id);

            // Generate cryptographically secure token
            var randomBytes =
                RandomNumberGenerator.GetBytes(32);

            // Make token URL-safe
            var rawToken =
                WebEncoders.Base64UrlEncode(randomBytes);

            // Store only hash in database
            var tokenHash =
                HashResetToken(rawToken);

            var passwordResetToken =
                new PasswordResetToken
                {
                    UserId = user.Id,
                    TokenHash = tokenHash,
                    ExpiryDate = DateTime.UtcNow.AddMinutes(30),
                    IsUsed = false
                };

            await _passwordResetTokenRepository
                .AddAsync(passwordResetToken);

            await _passwordResetTokenRepository
                .SaveChangesAsync();

            var frontendBaseUrl = _configuration["Frontend:BaseUrl"];

            // Raw token goes into email URL;
            var resetLink =
                $"{frontendBaseUrl}/reset-password?token={rawToken}";

            

            var customerName =
                $"{user.FirstName} {user.LastName}".Trim();

            var emailBody =
                EmailTemplateService.PasswordResetTemplate(
                    customerName,
                    resetLink);

            var emailRequest =
                new EmailRequestDto
                {
                    To = user.Email,
                    Subject = "Reset Your CakeStudio Password",
                    Body = emailBody
                };

            //await _emailService.SendEmailAsync(
            //    emailRequest);

            //Hangfire 
            _backgroundJobClient.Enqueue<IEmailBackgroundJob>(job => job.SendEmailAsync(emailRequest));

            _logger.LogInformation(
                "Password reset email sent for User {UserId}",
                user.Id);
        }
        private static string HashResetToken(string token)
        {
            var bytes =
                SHA256.HashData(
                    Encoding.UTF8.GetBytes(token));

            return Convert.ToHexString(bytes);
        }

        public async Task ResetPasswordAsync(ResetPasswordRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Token))
            {
                throw new UnauthorizedAccessException(
                    "Invalid or expired password reset link.");
            }

            // The browser sends the RAW token.
            // Hash it exactly the same way as during forgot-password.
            var tokenHash =
                HashResetToken(request.Token);

            var passwordResetToken =
                await _passwordResetTokenRepository
                    .GetValidTokenAsync(tokenHash);

            if (passwordResetToken == null)
            {
                throw new UnauthorizedAccessException(
                    "Invalid or expired password reset link.");
            }

            var user =
                passwordResetToken.User;

            // Hash the NEW password using your existing
            // password hashing service.
            var newPasswordHash =
                _passwordService.HashPassword(
                    request.NewPassword);

            user.PasswordHash =
                newPasswordHash;

            // Prevent this reset link from being used again.
            passwordResetToken.IsUsed = true;

            // Invalidate all existing login sessions.
            await _refreshTokenRepository
                .RemoveUserRefreshTokensAsync(user.Id);

            // All repositories use the same scoped DbContext,
            // so this saves:
            // 1. User password
            // 2. IsUsed change
            // 3. Deleted refresh tokens
            await _passwordResetTokenRepository
                .SaveChangesAsync();

            _logger.LogInformation(
                "Password reset successfully for User {UserId}",
                user.Id);
        }

        public async Task<LoginResponseDto> GoogleLoginAsync(GoogleLoginRequestDto request)
        {
            // ==========================================
            // 1. VALIDATE REQUEST
            // ==========================================

            if (string.IsNullOrWhiteSpace(request.Credential))
            {
                return new LoginResponseDto
                {
                    Success = false,
                    Message = "Google credential is required."
                };
            }

            try
            {
                // ==========================================
                // 2. GET GOOGLE CLIENT ID
                // ==========================================

                var googleClientId =
                    _configuration["GoogleAuth:ClientId"];

                if (string.IsNullOrWhiteSpace(googleClientId))
                {
                    throw new InvalidOperationException(
                        "Google ClientId is not configured.");
                }


                // ==========================================
                // 3. VERIFY GOOGLE ID TOKEN
                // ==========================================

                var settings =
                    new GoogleJsonWebSignature.ValidationSettings
                    {
                        Audience =
                            new[]
                            {
                        googleClientId
                            }
                    };

                var payload =
                    await GoogleJsonWebSignature.ValidateAsync(
                        request.Credential,
                        settings);

                if (!payload.EmailVerified)
                {
                    return new LoginResponseDto
                    {
                        Success = false,
                        Message =
                            "Google email is not verified."
                    };
                }


                if (string.IsNullOrWhiteSpace(payload.Subject) ||
                    string.IsNullOrWhiteSpace(payload.Email))
                {
                    return new LoginResponseDto
                    {
                        Success = false,
                        Message = "Invalid Google account."
                    };
                }


                // ==========================================
                // 4. GOOGLE ACCOUNT INFORMATION
                // ==========================================

                var googleId =
                    payload.Subject;

                var email =
                    payload.Email.Trim();

                var firstName =
                    payload.GivenName ?? "Google";

                var lastName =
                    payload.FamilyName;


                // ==========================================
                // 5. FIND USER BY GOOGLE ID
                // ==========================================

                var user =
                    await _userRepository
                        .GetByGoogleIdAsync(
                            googleId);


                // ==========================================
                // 6. GOOGLE ID NOT LINKED YET
                // ==========================================

                if (user == null)
                {
                    // Check whether this email already
                    // belongs to a CakeStudio account.

                    user =
                        await _userRepository
                            .GetByEmailAsync(email);


                    if (user != null)
                    {
                        // ==================================
                        // EXISTING CAKESTUDIO USER
                        // LINK GOOGLE ACCOUNT
                        // ==================================

                        if (!string.IsNullOrWhiteSpace(user.GoogleId) &&
                            user.GoogleId != googleId)
                        {
                            return new LoginResponseDto
                            {
                                Success = false,
                                Message =
                                    "This account is already linked to another Google account."
                            };
                        }

                        user.GoogleId =
                            googleId;

                        user.UpdatedAt =
                            DateTime.UtcNow;

                        await _userRepository
                            .SaveChangesAsync();

                        _logger.LogInformation(
                            "Google account linked to User {UserId}",
                            user.Id);
                    }
                    else
                    {
                        // ==================================
                        // NEW GOOGLE USER
                        // ==================================

                        user =
                            new User
                            {
                                FirstName =
                                    firstName,

                                LastName =
                                    lastName,

                                Email =
                                    email,

                                PasswordHash =
                                    null,

                                GoogleId =
                                    googleId,

                                Role =
                                    "Customer",

                                IsActive =
                                    true,

                                IsDeleted =
                                    false,

                                CreatedAt =
                                    DateTime.UtcNow
                            };


                        await _userRepository
                            .AddUserAsync(user);

                        await _userRepository
                            .SaveChangesAsync();


                        // ==================================
                        // WELCOME EMAIL
                        // ==================================

                        var emailRequest = new EmailRequestDto
                        {
                            To = user.Email,
                            Subject = "Welcome To CakeStudio 🎂",
                            Body = EmailTemplateService.WelcomeTemplate(
                                    user.FirstName,
                                    user.Email,
                                    user.PhoneNumber ?? "Not Provided")
                        };

                        _backgroundJobClient.Enqueue<IEmailBackgroundJob>(job => job.SendEmailAsync(emailRequest));


                        _logger.LogInformation(
                            "New Google user {UserId} created",
                            user.Id);
                    }
                }


                // ==========================================
                // 7. CHECK ACCOUNT STATUS
                // ==========================================

                if (!user.IsActive ||
                    user.IsDeleted)
                {
                    return new LoginResponseDto
                    {
                        Success = false,
                        Message =
                            "Your account is not active."
                    };
                }


                // ==========================================
                // 8. GENERATE CAKESTUDIO JWT
                // ==========================================

                var accessToken =
                    _jwtService.GenerateToken(user);


                // ==========================================
                // 9. REMOVE OLD REFRESH TOKENS
                // ==========================================

                await _refreshTokenRepository
                    .RemoveUserRefreshTokensAsync(
                        user.Id);


                // ==========================================
                // 10. CREATE NEW REFRESH TOKEN
                // ==========================================

                var refreshToken =
                    _refreshTokenService
                        .GenerateRefreshToken();


                var dbRefreshToken =
                    new RefreshToken
                    {
                        UserId =
                            user.Id,

                        Token =
                            refreshToken,

                        ExpiryDate =
                            DateTime.UtcNow
                                .AddDays(7),

                        IsRevoked =
                            false
                    };


                await _refreshTokenRepository
                    .AddAsync(
                        dbRefreshToken);


                await _refreshTokenRepository
                    .SaveChangesAsync();


                // ==========================================
                // 11. SUCCESS
                // ==========================================

                _logger.LogInformation(
                    "User {UserId} logged in using Google",
                    user.Id);


                return new LoginResponseDto
                {
                    Success =
                        true,

                    Message =
                        "Google login successful",

                    AccessToken =
                        accessToken,

                    RefreshToken =
                        refreshToken,

                    UserId =
                        user.Id,

                    Role =
                        user.Role
                };
            }
            catch (InvalidJwtException ex)
            {
                _logger.LogWarning(
                    ex,
                    "Invalid Google credential received.");

                return new LoginResponseDto
                {
                    Success = false,
                    Message = "Invalid Google credential."
                };
            }
        }
    }
}
