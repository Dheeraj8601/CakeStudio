using CakeStudio.Application.DTOs.Auth;
using CakeStudio.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CakeStudio.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IAuthCookieService _authCookieService;


        public AuthController(
            IAuthService authService,
            IAuthCookieService authCookieService)
        {
            _authService = authService;
            _authCookieService = authCookieService;
        }


        // =========================================================
        // REGISTER
        // =========================================================

        [HttpPost("register")]
        public async Task<IActionResult> Register(
            RegisterRequestDto request)
        {
            var result =
                await _authService.RegisterAsync(request);


            if (!result.Success)
            {
                return BadRequest(result);
            }


            return Ok(result);
        }


        // =========================================================
        // LOGIN
        // =========================================================

        [HttpPost("login")]
        public async Task<IActionResult> Login(
            LoginRequestDto request)
        {
            var response =
                await _authService.LoginAsync(request);


            if (!response.Success)
            {
                return Unauthorized(new
                {
                    success = false,
                    message = response.Message
                });
            }


            if (
                string.IsNullOrWhiteSpace(
                    response.AccessToken
                )
                ||
                string.IsNullOrWhiteSpace(
                    response.RefreshToken
                )
            )
            {
                return Unauthorized(new
                {
                    success = false,
                    message = "Authentication failed."
                });
            }


            // =====================================================
            // STORE TOKENS ONLY IN HTTPONLY COOKIES
            // =====================================================

            _authCookieService.SetAuthCookies(
                response.AccessToken,
                response.RefreshToken
            );


            // =====================================================
            // IMPORTANT
            //
            // Do NOT return AccessToken or RefreshToken.
            //
            // Frontend obtains authenticated user information
            // through GET /api/Auth/me.
            // =====================================================

            return Ok(new
            {
                success = true,
                message = response.Message
            });
        }


        // =========================================================
        // REFRESH TOKEN
        // =========================================================

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken()
        {
            // Refresh token exists only inside HttpOnly cookie.

            var refreshToken =
                Request.Cookies["refresh_token"];


            if (string.IsNullOrWhiteSpace(refreshToken))
            {
                _authCookieService.DeleteAuthCookies();


                return Unauthorized(new
                {
                    message = "Refresh token not found."
                });
            }


            var request =
                new RefreshTokenRequestDto
                {
                    RefreshToken =
                        refreshToken
                };


            try
            {
                // =================================================
                // ROTATE REFRESH TOKEN
                // =================================================

                var response =
                    await _authService
                        .RefreshTokenAsync(request);


                if (
                    string.IsNullOrWhiteSpace(
                        response.AccessToken
                    )
                    ||
                    string.IsNullOrWhiteSpace(
                        response.RefreshToken
                    )
                )
                {
                    _authCookieService.DeleteAuthCookies();


                    return Unauthorized(new
                    {
                        message =
                            "Token refresh failed."
                    });
                }


                // =================================================
                // REPLACE COOKIES
                // =================================================

                _authCookieService.SetAuthCookies(
                    response.AccessToken,
                    response.RefreshToken
                );


                // =================================================
                // DO NOT RETURN TOKENS
                // =================================================

                return Ok(new
                {
                    message =
                        "Token refreshed successfully."
                });
            }
            catch
            {
                // Invalid / expired / revoked refresh token.

                _authCookieService.DeleteAuthCookies();


                return Unauthorized(new
                {
                    message =
                        "Invalid or expired refresh token."
                });
            }
        }


        // =========================================================
        // LOGOUT
        // =========================================================

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var refreshToken =
                Request.Cookies["refresh_token"];


            if (!string.IsNullOrWhiteSpace(refreshToken))
            {
                var request =
                    new LogoutRequestDto
                    {
                        RefreshToken =
                            refreshToken
                    };


                await _authService
                    .LogoutAsync(request);
            }


            // Remove browser cookies.
            _authCookieService
                .DeleteAuthCookies();


            return Ok(new
            {
                message =
                    "Logged out successfully."
            });
        }


        // =========================================================
        // FORGOT PASSWORD
        // =========================================================

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(
            ForgotPasswordRequestDto request)
        {
            await _authService
                .ForgotPasswordAsync(request);


            return Ok(new
            {
                Message =
                    "If an account exists for this email, a password reset link has been sent."
            });
        }


        // =========================================================
        // RESET PASSWORD
        // =========================================================

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(
            ResetPasswordRequestDto request)
        {
            try
            {
                await _authService
                    .ResetPasswordAsync(request);


                return Ok(new
                {
                    Message =
                        "Password reset successfully. Please login with your new password."
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new
                {
                    Message =
                        ex.Message
                });
            }
        }


        // =========================================================
        // GOOGLE LOGIN
        // =========================================================

        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin(
            GoogleLoginRequestDto request)
        {
            var response =
                await _authService
                    .GoogleLoginAsync(request);


            if (!response.Success)
            {
                return Unauthorized(new
                {
                    success = false,
                    message = response.Message
                });
            }


            if (
                string.IsNullOrWhiteSpace(
                    response.AccessToken
                )
                ||
                string.IsNullOrWhiteSpace(
                    response.RefreshToken
                )
            )
            {
                return Unauthorized(new
                {
                    success = false,
                    message =
                        "Google authentication failed."
                });
            }


            // =====================================================
            // STORE TOKENS ONLY IN HTTPONLY COOKIES
            // =====================================================

            _authCookieService.SetAuthCookies(
                response.AccessToken,
                response.RefreshToken
            );


            // =====================================================
            // DO NOT RETURN TOKENS
            // =====================================================

            return Ok(new
            {
                success = true,
                message = response.Message
            });
        }


        // =========================================================
        // CURRENT AUTHENTICATED USER
        // =========================================================

        [Authorize]
        [HttpGet("me")]
        public IActionResult Me()
        {
            var userId =
                User.FindFirstValue(
                    ClaimTypes.NameIdentifier
                );


            var email =
                User.FindFirstValue(
                    ClaimTypes.Email
                );


            var role =
                User.FindFirstValue(
                    ClaimTypes.Role
                );


            var name =
                User.FindFirstValue(
                    ClaimTypes.Name
                );


            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized();
            }


            return Ok(new
            {
                userId,
                email,
                role,
                name
            });
        }
    }
}