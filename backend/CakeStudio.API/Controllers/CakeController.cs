using CakeStudio.Application.DTOs.Cake;
using CakeStudio.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CakeStudio.API.Controllers
{
    //[Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class CakeController : ControllerBase
    {
        private readonly ICakeService _cakeService;

        public CakeController(ICakeService cakeService)
        {
            _cakeService = cakeService;
        }

        [AllowAnonymous]
        [HttpGet("getCakes")]
        public async Task<IActionResult> GetCakes(
            [FromQuery] CakeFilterRequestDto request)
        {
            return Ok(await _cakeService.GetCakesAsync(request));
        }

        [AllowAnonymous]
        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            var cakes = await _cakeService.GetAllAsync();

            return Ok(cakes);
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var cake = await _cakeService.GetByIdAsync(id);

            if (cake == null)
                return NotFound();

            return Ok(cake);
        }

        [HttpPost("createCake")]
        public async Task<IActionResult> Create([FromForm] CreateCakeRequestDto request)
        {
            var cake = await _cakeService.CreateAsync(request);

            return Ok(cake);
        }

        [HttpPut("updateCake")]
        public async Task<IActionResult> Update([FromForm] UpdateCakeRequestDto request)
        {
            var cake = await _cakeService.UpdateAsync(request);

            return Ok(cake);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _cakeService.DeleteAsync(id);

            return Ok(new
            {
                Message = "Cake deleted successfully."
            });
        }
    }
}