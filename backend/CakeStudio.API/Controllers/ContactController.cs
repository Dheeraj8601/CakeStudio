using CakeStudio.Application.DTOs.Contact;
using CakeStudio.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CakeStudio.API.Controllers
{
    [ApiController]
    [Route("api/contact")]
    public class ContactController : ControllerBase
    {
        private readonly IContactService _service;

        public ContactController(
            IContactService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Send(
            ContactRequestDto request)
        {
            await _service.SendContactMessageAsync(
                request);

            return Ok(new
            {
                Message = "Message sent successfully."
            });
        }
    }
}
