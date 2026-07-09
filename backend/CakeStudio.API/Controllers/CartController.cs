using CakeStudio.Application.DTOs.Cart;
using CakeStudio.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CakeStudio.API.Controllers
{

        [Authorize(Roles = "Customer")]
        [ApiController]
        [Route("api/cart")]
        public class CartController : ControllerBase
        {
            private readonly ICartService _cartService;

            public CartController(ICartService cartService)
            {
                _cartService = cartService;
            }

            [HttpPost("add")]
            public async Task<IActionResult> Add(
                AddToCartRequestDto request)
            {
                await _cartService.AddToCartAsync(request);

                return Ok();
            }

            [HttpPut("quantity")]
            public async Task<IActionResult> UpdateQuantity(UpdateCartItemRequestDto request)
            {
                await _cartService.UpdateQuantityAsync(request);

                return Ok();
            }

            [HttpDelete("{cartItemId}")]
            public async Task<IActionResult> Remove(
                int cartItemId)
            {
                await _cartService.RemoveItemAsync(cartItemId);

                return NoContent();
            }

            [HttpGet]
            public async Task<IActionResult> GetMyCart()
            {
                return Ok(
                    await _cartService.GetMyCartAsync());
            }
        }
    
}
