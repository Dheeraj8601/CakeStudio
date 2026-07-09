using CakeStudio.Application.DTOs.User;
using CakeStudio.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CakeStudio.API.Controllers
{
    //[Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/users")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _service;

        public UserController(IUserService service)
        {
            _service = service;
        }

        [HttpGet("getUsers")]
        public async Task<IActionResult> GetPaged([FromQuery] UserPagedRequestDto request)
        {
            return Ok(await _service.GetPagedAsync(request));
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _service.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await _service.GetByIdAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpPatch("{id}/toggle-status")]
        public async Task<IActionResult> ToggleStatus(int id)
        {
            await _service.ToggleActiveStatusAsync(id);

            return Ok(new
            {
                Message = "User status updated successfully."
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id);

            return Ok(new
            {
                Message = "User deleted successfully."
            });
        }

        [HttpPut]
        public async Task<IActionResult> Update(UpdateUserRequestDto request)
        {
            await _service.UpdateAsync(request);

            return Ok(new
            {
                Message = "Profile updated successfully."
            });
        }

        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword(ChangePasswordRequestDto request)
        {
            await _service.ChangePasswordAsync(request);

            return Ok(new
            {
                Message = "Password changed successfully."
            });
        }
    }
}
