using CakeStudio.Application.DTOs.Cake;
using CakeStudio.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stripe;

namespace CakeStudio.API.Controllers
{
    [ApiController]
    [Route("api/cake-catalog")]
    public class CakeCatalogController : ControllerBase
    {
        private readonly ICakeService _cakeService;

        public CakeCatalogController(
            ICakeService cakeService)
        {
            _cakeService = cakeService;
        }

        /// <summary>
        /// Customer cake listing with
        /// search, filters, sorting and pagination
        /// </summary>
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetCakes(
            [FromQuery] CakeCatalogFilterDto request)
        {
            var result =
                await _cakeService.GetCatalogAsync(request);

            return Ok(result);
        }

        /// <summary>
        /// Customer cake details
        /// </summary>
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCake(
            int id)
        {
            var cake =
                await _cakeService.GetCatalogCakeByIdAsync(id);

            if (cake == null)
            {
                return NotFound();
            }

            return Ok(cake);
        }

        [HttpPost("cart-items")]
        public async Task<IActionResult> GetCartItems([FromBody] CartItemsRequestDto request)
        {
            return Ok(await _cakeService.GetCartItemsAsync(request));
        }

        [HttpGet("rating-filters")]
        public async Task<IActionResult> GetRatingFilters()
        {
            return Ok(
                await _cakeService.GetRatingFiltersAsync());
        }

        [AllowAnonymous]
        [HttpGet("featured")]
        public async Task<IActionResult> GetFeaturedCakes()
        {
            return Ok(
                await _cakeService.GetFeaturedCakesAsync());
        }
    }
}
