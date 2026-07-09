using CakeStudio.API.DbContexts.models;
using CakeStudio.Application.DTOs.Cake;
using CakeStudio.Application.DTOs.Order;
using CakeStudio.Application.Interfaces;
using CakeStudio.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Infrastructure.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly CakeStudioDbContext _context;

        public OrderRepository(CakeStudioDbContext context)
        {
            _context = context;
        }

        public async Task<Order> AddOrderAsync(Order order)
        {
            _context.Orders.Add(order);

            await _context.SaveChangesAsync();

            return order;
        }

        public async Task<List<Order>> GetOrdersByUserIdAsync(int userId)
        {
            return await _context.Orders
                .Include(x => x.OrderItems)
                .ThenInclude(x => x.Cake)
                .Where(x => x.UserId == userId)
                .ToListAsync();
        }

        public async Task<Order?> GetOrderByIdAsync(int orderId)
        {
            return await _context.Orders
                .Include(x => x.Address)
                .Include(x => x.OrderItems)
                .ThenInclude(x => x.Cake)
                .FirstOrDefaultAsync(x => x.Id == orderId);
        }

        public async Task<List<Order>> GetAllOrdersAsync()
        {
            return await _context.Orders
                .Include(x => x.User)
                .ToListAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task<Order?> GetOrderByIdAndUserIdAsync(int orderId,int userId)
        {
            return await _context.Orders
                .FirstOrDefaultAsync(x =>
                    x.Id == orderId &&
                    x.UserId == userId);
        }

        public async Task UpdateAsync(Order order)
        {
            _context.Orders.Update(order);

            await _context.SaveChangesAsync();
        }

        public async Task<List<Order>> GetRecentOrdersByUserIdAsync(int userId,int count = 2)
        {
            return await _context.Orders

                .Include(x => x.OrderItems)
                .ThenInclude(x => x.Cake)

                .Include(x => x.Address)

                .Where(x => x.UserId == userId)

                .OrderByDescending(x => x.CreatedAt)

                .Take(count)

                .ToListAsync();
        }

        public async Task<PagedResult<Order>> GetPagedOrdersAsync(OrderPagedRequestDto request)
        {
            var query = _context.Orders

                .Include(x => x.User)

                .Include(x => x.OrderItems)
                .ThenInclude(x => x.Cake)

                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.Search))
            {
                query = query.Where(x =>

                    x.Id.ToString().Contains(request.Search) ||

                    (x.User != null &&
                     (x.User.FirstName + " " + x.User.LastName)
                     .Contains(request.Search)));
            }

            if (!string.IsNullOrWhiteSpace(request.PaymentStatus)
                && request.PaymentStatus != "All")
            {
                query = query.Where(x =>
                    x.PaymentStatus == request.PaymentStatus);
            }

            if (!string.IsNullOrWhiteSpace(request.OrderStatus)
                && request.OrderStatus != "All")
            {
                query = query.Where(x =>
                    x.OrderStatus == request.OrderStatus);
            }

            var totalCount =
                await query.CountAsync();

            var items = await query

                .OrderByDescending(x => x.CreatedAt)

                .Skip((request.PageNumber - 1) * request.PageSize)

                .Take(request.PageSize)

                .ToListAsync();

            return new PagedResult<Order>
            {
                Page = request.PageNumber,

                PageSize = request.PageSize,

                TotalRecords = totalCount,

                TotalPages = (int)Math.Ceiling(
        totalCount / (double)request.PageSize),

                Data = items
            };
        }
    }
}
