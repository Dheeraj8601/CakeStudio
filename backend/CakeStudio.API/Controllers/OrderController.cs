using CakeStudio.Application.DTOs.Order;
using CakeStudio.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CakeStudio.API.Controllers
{
    //[Authorize(Roles = "Customer")]
    [ApiController]
    [Route("api/orders")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout(CreateOrderRequestDto request)
        {
            return Ok(
                await _orderService.CheckoutAsync(
                    request));
        }

        [HttpGet]
        public async Task<IActionResult> MyOrders()
        {
            return Ok(
                await _orderService.GetMyOrdersAsync()
                );
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Details(int id)
        {
            return Ok(
                await _orderService
                    .GetOrderDetailsAsync(id)
                    );
        }

        [HttpPatch("{id}/cancel")]
        public async Task<IActionResult> Cancel(int id)
        {
            await _orderService.CancelOrderAsync(id);

            return Ok(new
            {
                Message = "Order cancelled successfully."
            });
        }

        [HttpGet("recent")]
        [ResponseCache(Duration = 180)]
        public async Task<IActionResult> GetRecentOrders()
        {
            return Ok(
                await _orderService.GetRecentOrdersAsync());
        }

        //[Authorize(Roles = "Admin")]
        [HttpPatch("{orderId}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int orderId,UpdateOrderStatusRequestDto request)
        {
            request.OrderId = orderId;

            await _orderService.UpdateOrderStatusAsync(request);

            return Ok(new
            {
                Message = "Order status updated successfully."
            });
        }

        //[Authorize(Roles = "Admin")]
        [HttpGet("admin")]
        public async Task<IActionResult> GetOrders([FromQuery] OrderPagedRequestDto request)
        {
            return Ok(
                await _orderService.GetPagedOrdersAsync(request));
        }
    }
}
