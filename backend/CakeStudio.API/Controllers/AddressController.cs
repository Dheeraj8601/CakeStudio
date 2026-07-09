using CakeStudio.Application.DTOs.Address;
using CakeStudio.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CakeStudio.API.Controllers
{
    [Authorize(Roles = "Customer")]
    [ApiController]
    [Route("api/address")]
    public class AddressController : ControllerBase
    {
        private readonly IAddressService _service;

        public AddressController(
            IAddressService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateAddressRequestDto request)
        {
            await _service.CreateAsync(request);

            return Ok();
        }

        [HttpPut]
        public async Task<IActionResult> Update(
            UpdateAddressRequestDto request)
        {
            await _service.UpdateAsync(request);

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id);

            return NoContent();
        }

        [HttpPut("{id}/default")]
        public async Task<IActionResult> SetDefault(int id)
        {
            await _service.SetDefaultAsync(id);

            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> GetMyAddresses()
        {
            return Ok(
                await _service.GetMyAddressesAsync());
        }
    }
}
