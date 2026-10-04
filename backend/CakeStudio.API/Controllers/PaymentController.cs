using CakeStudio.Application.DTOs.Payment;
using CakeStudio.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CakeStudio.API.Controllers
{
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


        // =========================================================
        // CREATE STRIPE CHECKOUT SESSION
        // =========================================================
        //
        // CSRF PROTECTION:
        // Do NOT add [IgnoreAntiforgeryToken] here.
        //
        // This endpoint is called by our React application.
        // Axios will send X-CSRF-TOKEN automatically.
        //
        // [AllowAnonymous] only means authentication is not required.
        // It does NOT mean CSRF protection should be disabled.
        // =========================================================

        [AllowAnonymous]
        [HttpPost("create-session")]
        public async Task<IActionResult> CreateSession(
            CreatePaymentRequestDto request)
        {
            var result =
                await _paymentService
                    .CreateSessionAsync(
                        request.OrderId);

            return Ok(result);
        }


        // =========================================================
        // ADMIN REFUND
        // =========================================================
        //
        // CSRF protection is important here because this is an
        // authenticated POST request that performs a sensitive
        // operation.
        //
        // The global AutoValidateAntiforgeryTokenAttribute will
        // validate X-CSRF-TOKEN automatically.
        // =========================================================

        [Authorize(Roles = "Admin")]
        [HttpPost("order/{orderId:int}/refund")]
        public async Task<IActionResult> RefundPayment(
            int orderId,
            [FromBody] RefundPaymentRequestDto request)
        {
            var userIdValue =
                User.FindFirstValue(
                    ClaimTypes.NameIdentifier);


            if (!int.TryParse(
                    userIdValue,
                    out var adminUserId))
            {
                return Unauthorized(
                    new
                    {
                        Message =
                            "Unable to identify the authenticated admin."
                    });
            }


            await _paymentService
                .RefundAsync(
                    orderId,
                    request.Amount,
                    adminUserId,
                    request.Reason);


            return Ok(
                new
                {
                    Message =
                        "Refund request submitted successfully."
                });
        }


        // =========================================================
        // GET PAYMENT
        // =========================================================
        //
        // GET requests do not modify server state, so automatic
        // antiforgery validation is not required here.
        // =========================================================

        [Authorize(Roles = "Customer,Admin")]
        [HttpGet("order/{orderId:int}")]
        public async Task<IActionResult> GetPaymentByOrder(
            int orderId)
        {
            var userIdValue =
                User.FindFirstValue(
                    ClaimTypes.NameIdentifier);


            if (!int.TryParse(
                    userIdValue,
                    out var userId))
            {
                return Unauthorized(
                    new
                    {
                        Message =
                            "Unable to identify the authenticated user."
                    });
            }


            var isAdmin =
                User.IsInRole("Admin");


            var payment =
                await _paymentService
                    .GetPaymentByOrderAsync(
                        orderId,
                        userId,
                        isAdmin);


            if (payment == null)
            {
                return NotFound(
                    new
                    {
                        Message =
                            "Payment information not found."
                    });
            }


            return Ok(payment);
        }


        // =========================================================
        // VERIFY PAYMENT
        // =========================================================
        //
        // This request comes from our React application.
        // Therefore CSRF protection should remain enabled.
        //
        // Axios automatically sends X-CSRF-TOKEN.
        // =========================================================

        [AllowAnonymous]
        [HttpPost("verify")]
        public async Task<IActionResult> VerifyPayment(
            [FromBody] VerifyPaymentRequestDto request)
        {
            var result =
                await _paymentService
                    .VerifyPaymentAsync(
                        request.OrderId,
                        request.SessionId);


            return Ok(result);
        }
    }
}