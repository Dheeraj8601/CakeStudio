using CakeStudio.Application.DTOs.Review;
using CakeStudio.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CakeStudio.API.Controllers
{
    [ApiController]
    [Route("api/reviews")]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewService _service;

        public ReviewController(
            IReviewService service)
        {
            _service = service;
        }

        [Authorize(Roles = "Customer")]
        [HttpPost]
        public async Task<IActionResult> Create(CreateReviewRequestDto request)
        {
            await _service.CreateAsync(request);

            return Ok();
        }

        [Authorize(Roles = "Customer")]
        [HttpPut]
        public async Task<IActionResult> Update(UpdateReviewRequestDto request)
        {
            await _service.UpdateAsync(request);

            return Ok();
        }

        [Authorize(Roles = "Customer")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id);

            return NoContent();
        }

        [AllowAnonymous]
        [HttpGet("cake/{cakeId}")]
        public async Task<IActionResult> GetReviews(int cakeId)
        {
            return Ok(
                await _service
                    .GetCakeReviewsAsync(cakeId));
        }

        //[Authorize(Roles = "Customer")]
        [HttpGet("order-item/{orderItemId}")]
        public async Task<IActionResult> GetByOrderItem(int orderItemId)
        {
            var review =
                await _service.GetByOrderItemAsync(orderItemId);

            if (review == null)
                return NoContent();

            return Ok(review);
        }

        //[Authorize(Roles = "Admin")]
        [HttpGet("admin")]
        public async Task<IActionResult> GetAllReviews([FromQuery] ReviewPagedRequestDto request)
        {
            return Ok(
                await _service.GetPagedReviewsAsync(request));
        }

        //[Authorize(Roles = "Admin")]
        [HttpPost("reply")]
        public async Task<IActionResult> Reply( ReplyReviewRequestDto request)
        {
            await _service.ReplyAsync(request);

            return Ok(new
            {
                Message = "Reply sent successfully."
            });
        }
    }
}
