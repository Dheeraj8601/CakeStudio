using CakeStudio.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace CakeStudio.Infrastructure.Services
{
    public class AuthCookieService : IAuthCookieService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IConfiguration _configuration;

        public AuthCookieService(
            IHttpContextAccessor httpContextAccessor,
            IConfiguration configuration)
        {
            _httpContextAccessor = httpContextAccessor;
            _configuration = configuration;
        }


        // =====================================================
        // SET AUTH COOKIES
        // =====================================================

        public void SetAuthCookies(string accessToken,string refreshToken)
        {
            var response = _httpContextAccessor.HttpContext!.Response;


            var accessTokenExpiryMinutes = _configuration.GetValue<int>("JwtSettings:ExpiryMinutes");

            // =================================================
            // ACCESS TOKEN
            // =================================================

            response.Cookies.Append("access_token",accessToken,
                new CookieOptions
                {
                    HttpOnly = true,

                    // Required when SameSite=None
                    Secure = true,

                    // Frontend:
                    // http://localhost:5173
                    //
                    // Backend:
                    // https://localhost:7120
                    //
                    // Allow cookie to be sent with
                    // credentialed cross-origin requests.
                    SameSite = SameSiteMode.None,

                    Path = "/",

                    Expires =
                        DateTimeOffset.UtcNow
                            .AddMinutes(
                                accessTokenExpiryMinutes
                            ),

                    IsEssential = true
                }
            );


            // =================================================
            // REFRESH TOKEN
            // =================================================

            response.Cookies.Append("refresh_token",refreshToken,
                new CookieOptions
                {
                    HttpOnly = true,

                    Secure = true,

                    SameSite = SameSiteMode.None,

                    Path = "/",

                    Expires =
                        DateTimeOffset.UtcNow
                            .AddDays(7),

                    IsEssential = true
                }
            );

            response.Cookies.Append("has_session","1",
                new CookieOptions
                {
                    HttpOnly = false,
                    Secure = true,
                    SameSite = SameSiteMode.Lax,
                    Path = "/"
                });
        }


        // =====================================================
        // DELETE AUTH COOKIES
        // =====================================================

        public void DeleteAuthCookies()
        {
            var response =
                _httpContextAccessor
                    .HttpContext!
                    .Response;


            // IMPORTANT:
            // Cookie deletion options should match
            // the cookie creation options.

            response.Cookies.Delete(
                "access_token",
                new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Path = "/"
                }
            );


            response.Cookies.Delete(
                "refresh_token",
                new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Path = "/"
                }
            );

            response.Cookies.Delete("has_session",
                new CookieOptions
                {
                    Secure = true,
                    SameSite = SameSiteMode.Lax,
                    Path = "/"
                });
        }
    }
}