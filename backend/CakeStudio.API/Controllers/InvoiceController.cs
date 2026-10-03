using CakeStudio.API.DbContexts.models;
using CakeStudio.Application.Interfaces;
using CakeStudio.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CakeStudio.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class InvoiceController : ControllerBase
    {
        private readonly IInvoiceService _invoiceService;
        private readonly CakeStudioDbContext _context;

        public InvoiceController(IInvoiceService invoiceService,CakeStudioDbContext context)
        {
            _invoiceService = invoiceService;
            _context = context;
        }

        [HttpGet("{orderId:int}/download")]
        public async Task<IActionResult> DownloadInvoice(int orderId)
        {
            // -----------------------------------------------------
            // 1. Read authenticated user from JWT
            // -----------------------------------------------------

            var userIdClaim =
                User.FindFirstValue(ClaimTypes.NameIdentifier);

            var role =
                User.FindFirstValue(ClaimTypes.Role);

            if (!int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }



            var order = await _context.Orders
                .AsNoTracking()
                .Where(x => x.Id == orderId)
                .Select(x => new
                {
                    x.Id,
                    x.UserId,
                    x.OrderStatus
                })
                .FirstOrDefaultAsync();

            if (order == null)
            {
                return NotFound(new
                {
                    message = "Order not found."
                });
            }


            var isAdmin =
                string.Equals(
                    role,
                    "Admin",
                    StringComparison.OrdinalIgnoreCase);

            if (!isAdmin)
            {
                if (order.UserId == null ||
                    order.UserId.Value != userId)
                {
                    return Forbid();
                }
            }


            if (!order.OrderStatus.Equals(
                    "Delivered",
                    StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest(new
                {
                    message =
                        "Invoice is available only after the order is delivered."
                });
            }


            var pdfBytes =
                await _invoiceService.GenerateInvoiceAsync(orderId);


            return File(
                pdfBytes,
                "application/pdf",
                $"CakeStudio_Invoice_{orderId}.pdf");
        }
    }
}