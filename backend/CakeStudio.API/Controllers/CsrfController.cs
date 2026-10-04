using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Mvc;

namespace CakeStudio.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CsrfController : ControllerBase
    {
        private readonly IAntiforgery _antiforgery;

        public CsrfController(
            IAntiforgery antiforgery)
        {
            _antiforgery = antiforgery;
        }


        // =========================================================
        // GET CSRF TOKEN
        // =========================================================

        [HttpGet("token")]
        public IActionResult GetToken()
        {
            var tokens =
                _antiforgery
                    .GetAndStoreTokens(HttpContext);


            return Ok(new
            {
                token = tokens.RequestToken
            });
        }
    }
}