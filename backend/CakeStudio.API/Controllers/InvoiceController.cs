using CakeStudio.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CakeStudio.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InvoiceController : ControllerBase
    {
        private readonly IInvoiceService _invoiceService;

        public InvoiceController(IInvoiceService invoiceService)
        {
            _invoiceService = invoiceService;
        }

        [HttpGet("{orderId:int}")]
        public async Task<IActionResult> GenerateInvoice(
            int orderId)
        {
            var pdf =
                await _invoiceService.GenerateInvoiceAsync(orderId);

            return File(
                pdf,
                "application/pdf",
                $"CakeStudio_Invoice_{orderId}.pdf");
        }
    }
}