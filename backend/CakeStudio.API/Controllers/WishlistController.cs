using CakeStudio.Application.DTOs.Wishlist;
using CakeStudio.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CakeStudio.API.Controllers
{
    [Authorize(Roles = "Customer")]
    [ApiController]
    [Route("api/wishlist")]
    public class WishlistController : ControllerBase
    {
        private readonly IWishlistService _service;

        public WishlistController(
            IWishlistService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Add(
            AddWishlistRequestDto request)
        {
            await _service.AddAsync(request);

            return Ok();
        }

        [HttpDelete("{wishlistId}")]
        public async Task<IActionResult> Remove(
            int wishlistId)
        {
            await _service.RemoveAsync(
                wishlistId);

            return NoContent();
        }

        [HttpGet]
        public async Task<IActionResult> GetMyWishlist()
        {
            return Ok(
                await _service
                    .GetMyWishlistAsync());
        }

        [HttpPost("{wishlistId}/move-to-cart")]
        public async Task<IActionResult> MoveToCart(
            int wishlistId)
        {
            await _service.MoveToCartAsync(
                wishlistId);

            return Ok();
        }

        [HttpGet("getWishlist")]
        public async Task<IActionResult> GetWishlist(
        [FromQuery] WishlistFilterRequestDto request)
        {
            return Ok(
                await _service.GetWishlistAsync(request));
        }
    }
}
