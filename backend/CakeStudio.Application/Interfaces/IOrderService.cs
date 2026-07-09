using CakeStudio.Application.DTOs.Cake;
using CakeStudio.Application.DTOs.Order;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Application.Interfaces
{
    public interface IOrderService
    {
        Task<OrderResponseDto> CheckoutAsync(CreateOrderRequestDto request);

        Task<List<OrderResponseDto>> GetMyOrdersAsync();

        Task<OrderResponseDto?> GetOrderDetailsAsync(int orderId);

        Task UpdateOrderStatusAsync(UpdateOrderStatusDto request);
        Task CancelOrderAsync(int orderId);
        Task<List<OrderResponseDto>> GetRecentOrdersAsync();

        Task UpdateOrderStatusAsync(UpdateOrderStatusRequestDto request);

        Task<PagedResult<AdminOrderResponseDto>> GetPagedOrdersAsync(OrderPagedRequestDto request);
    }
}
