using CakeStudio.Application.DTOs.Auth;
using CakeStudio.Application.DTOs.Email;
using CakeStudio.Application.Interfaces;
using CakeStudio.Infrastructure.Services;
using CakeStudio.Persistence.Entities;

using FluentAssertions;
using Hangfire;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace CakeStudio.Tests.Unit.Application.Services
{
    public class AuthServiceTests
    {
        private readonly Mock<IUserRepository>
            _userRepositoryMock;

        private readonly Mock<IRefreshTokenRepository>
            _refreshTokenRepositoryMock;

        private readonly Mock<IPasswordService>
            _passwordServiceMock;

        private readonly Mock<IJwtService>
            _jwtServiceMock;

        private readonly Mock<IRefreshTokenService>
            _refreshTokenServiceMock;

        private readonly Mock<IEmailService>
            _emailServiceMock;

        private readonly Mock<ILogger<AuthService>>
            _loggerMock;

        private readonly AuthService _authService;
        private readonly Mock<IPasswordResetTokenRepository> _forgotMock;
        private readonly Mock<IConfiguration> _configuration;
        private readonly Mock<IBackgroundJobClient> _backgroundJobClientMock;

        public AuthServiceTests()
        {
            _userRepositoryMock =
                new Mock<IUserRepository>();

            _refreshTokenRepositoryMock =
                new Mock<IRefreshTokenRepository>();

            _passwordServiceMock =
                new Mock<IPasswordService>();

            _jwtServiceMock =
                new Mock<IJwtService>();

            _refreshTokenServiceMock =
                new Mock<IRefreshTokenService>();

            _emailServiceMock =
                new Mock<IEmailService>();

            _loggerMock =
                new Mock<ILogger<AuthService>>();

            _forgotMock = new Mock<IPasswordResetTokenRepository>();
            _configuration = new Mock<IConfiguration>();
            _backgroundJobClientMock = new Mock<IBackgroundJobClient>();

            _authService = new AuthService(
                _userRepositoryMock.Object,
                _refreshTokenRepositoryMock.Object,
                _passwordServiceMock.Object,
                _jwtServiceMock.Object,
                _refreshTokenServiceMock.Object,
                _emailServiceMock.Object,
                _loggerMock.Object,
                _forgotMock.Object,
                _configuration.Object,
                _backgroundJobClientMock.Object
                );
        }

        [Fact]
        public async Task RegisterAsync_ShouldRegisterUser_WhenEmailDoesNotExist()
        {
            // Arrange

            var request = new RegisterRequestDto
            {
                FirstName = "Raj",
                LastName = "Kumar",
                Email = "raj@gmail.com",
                Password = "Password123"
            };

            _userRepositoryMock
                .Setup(x => x.GetByEmailAsync(request.Email))
                .ReturnsAsync((User?)null);

            _passwordServiceMock
                .Setup(x => x.HashPassword(request.Password))
                .Returns("hashed-password");

            // Act

            var result =
                await _authService.RegisterAsync(request);

            // Assert

            result.Success.Should().BeTrue();

            result.Message.Should()
                .Be("Registration successful");

            _userRepositoryMock.Verify(
                x => x.AddUserAsync(It.IsAny<User>()),
                Times.Once);

            _emailServiceMock.Verify(
                x => x.SendEmailAsync(
                    It.IsAny<EmailRequestDto>()),
                Times.Once);
        }

        [Fact]
        public async Task RegisterAsync_ShouldFail_WhenEmailAlreadyExists()
        {
            // Arrange

            var request = new RegisterRequestDto
            {
                Email = "raj@gmail.com"
            };

            _userRepositoryMock
                .Setup(x => x.GetByEmailAsync(request.Email))
                .ReturnsAsync(new User());

            // Act

            var result =
                await _authService.RegisterAsync(request);

            // Assert

            result.Success.Should().BeFalse();

            result.Message.Should()
                .Be("Email already exists");

            _userRepositoryMock.Verify(
                x => x.AddUserAsync(It.IsAny<User>()),
                Times.Never);
        }

        [Fact]
        public async Task LoginAsync_ShouldReturnTokens_WhenCredentialsAreValid()
        {
            // Arrange

            var request = new LoginRequestDto
            {
                Email = "raj@gmail.com",
                Password = "Password123"
            };

            var user = new User
            {
                Id = 1,
                Email = request.Email,
                PasswordHash = "hashed-password"
            };

            _passwordServiceMock
                .Setup(x => x.HashPassword(request.Password))
                .Returns("hashed-password");

            _userRepositoryMock
                .Setup(x => x.GetByEmailAsync(request.Email))
                .ReturnsAsync(user);

            _jwtServiceMock
                .Setup(x => x.GenerateToken(user))
                .Returns("jwt-token");

            _refreshTokenServiceMock
                .Setup(x => x.GenerateRefreshToken())
                .Returns("refresh-token");

            // Act

            var result = await _authService.LoginAsync(request);

            // Assert

            result.Success.Should().BeTrue();

            result.AccessToken.Should()
                .Be("jwt-token");

            result.RefreshToken.Should()
                .Be("refresh-token");

            _jwtServiceMock.Verify(
                x => x.GenerateToken(user),
                Times.Once);
        }

        [Fact]
        public async Task LoginAsync_ShouldFail_WhenPasswordIsInvalid()
        {
            // Arrange

            var request = new LoginRequestDto
            {
                Email = "raj@gmail.com",
                Password = "wrong-password"
            };

            var user = new User
            {
                Email = request.Email,
                PasswordHash = "correct-hash"
            };

            _passwordServiceMock
                .Setup(x => x.HashPassword(request.Password))
                .Returns("wrong-hash");

            _userRepositoryMock
                .Setup(x => x.GetByEmailAsync(request.Email))
                .ReturnsAsync(user);

            // Act

            var result =
                await _authService.LoginAsync(request);

            // Assert

            result.Success.Should().BeFalse();

            result.Message.Should()
                .Be("Invalid email or password");
        }

        [Fact]
        public async Task RefreshTokenAsync_ShouldGenerateNewAccessToken()
        {
            // Arrange

            var request =
                new RefreshTokenRequestDto
                {
                    RefreshToken = "valid-token"
                };

            var user = new User
            {
                Id = 1,
                Email = "raj@gmail.com"
            };

            var refreshToken =
                new RefreshToken
                {
                    Token = "valid-token",
                    User = user,
                    ExpiryDate =
                        DateTime.UtcNow.AddDays(1),
                    IsRevoked = false
                };

            _refreshTokenRepositoryMock
                .Setup(x =>
                    x.GetValidTokenAsync(
                        request.RefreshToken))
                .ReturnsAsync(refreshToken);

            _jwtServiceMock
                .Setup(x =>
                    x.GenerateToken(user))
                .Returns("new-access-token");

            // Act

            var result =
                await _authService
                    .RefreshTokenAsync(request);

            // Assert

            result.AccessToken.Should()
                .Be("new-access-token");
        }

        [Fact]
        public async Task RefreshTokenAsync_ShouldThrow_WhenTokenDoesNotExist()
        {
            // Arrange

            var request =
                new RefreshTokenRequestDto
                {
                    RefreshToken = "invalid-token"
                };

            _refreshTokenRepositoryMock
                .Setup(x =>
                    x.GetValidTokenAsync(
                        request.RefreshToken))
                .ReturnsAsync((RefreshToken?)null);

            // Act

            Func<Task> action =
                async () =>
                    await _authService
                        .RefreshTokenAsync(request);

            // Assert

            await action.Should()
                .ThrowAsync<Exception>()
                .WithMessage(
                    "Invalid refresh token");
        }

        [Fact]
        public async Task RefreshTokenAsync_ShouldThrow_WhenTokenExpired()
        {
            // Arrange

            var request =
                new RefreshTokenRequestDto
                {
                    RefreshToken = "expired-token"
                };

            var refreshToken =
                new RefreshToken
                {
                    Token = "expired-token",
                    ExpiryDate =
                        DateTime.UtcNow.AddDays(-1),
                    IsRevoked = false
                };

            _refreshTokenRepositoryMock
                .Setup(x =>
                    x.GetValidTokenAsync(
                        request.RefreshToken))
                .ReturnsAsync(refreshToken);

            // Act

            Func<Task> action =
                async () =>
                    await _authService
                        .RefreshTokenAsync(request);

            // Assert

            await action.Should()
                .ThrowAsync<Exception>()
                .WithMessage(
                    "Refresh token expired");
        }
    }
}
