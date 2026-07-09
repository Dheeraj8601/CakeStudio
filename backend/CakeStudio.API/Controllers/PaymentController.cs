using CakeStudio.Application.DTOs.Payment;
using CakeStudio.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CakeStudio.API.Controllers
{
    [Authorize(Roles = "Customer")]
    [ApiController]
    [Route("api/payment")]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentController(
            IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpPost("create-session")]
        public async Task<IActionResult> CreateSession(CreatePaymentRequestDto request)
        {
            var result = await _paymentService.CreateSessionAsync(request.OrderId);

            return Ok(result);
        }
    }
}
