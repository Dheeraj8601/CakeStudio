using CakeStudio.Application.DTOs.Cake;
using CakeStudio.Application.DTOs.Order;
using CakeStudio.Persistence.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Application.Interfaces
{
    public interface IOrderRepository
    {
        Task<Order> AddOrderAsync(Order order);

        Task<List<Order>> GetOrdersByUserIdAsync(int userId);

        Task<Order?> GetOrderByIdAsync(int orderId);

        Task<List<Order>> GetAllOrdersAsync();

        Task SaveChangesAsync();
        Task<Order?> GetOrderByIdAndUserIdAsync(int orderId,int userId);

        Task UpdateAsync(Order order);
        Task<List<Order>> GetRecentOrdersByUserIdAsync(int userId,int count = 2);

        Task<PagedResult<Order>> GetPagedOrdersAsync(OrderPagedRequestDto request);
    }
}
