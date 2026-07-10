using CakeStudio.API.DbContexts.models;
using CakeStudio.Application.Common.Exceptions;
using CakeStudio.Application.DTOs.Address;
using CakeStudio.Application.DTOs.Cake;
using CakeStudio.Application.DTOs.Email;
using CakeStudio.Application.DTOs.Order;
using CakeStudio.Application.Interfaces;
using CakeStudio.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Infrastructure.Services
{
    public class OrderService : IOrderService
    {
        private readonly CakeStudioDbContext _context;
        private readonly IUserContext _userContext;
        private readonly ICartRepository _cartRepository;
        private readonly IOrderRepository _orderRepository;
        private readonly IPaymentProcessorFactory _paymentProcessorFactory;
        private readonly IFileUpload _fileUpload;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;
        public OrderService(CakeStudioDbContext context, IUserContext userContext, ICartRepository cartRepository, IOrderRepository orderRepo, IPaymentProcessorFactory paymentFactory, IFileUpload fileUpload, IEmailService emailService,IConfiguration config)
        {
            _context = context;
            _userContext = userContext;
            _cartRepository = cartRepository;
            _orderRepository = orderRepo;
            _paymentProcessorFactory = paymentFactory;
            _fileUpload = fileUpload;
            _emailService = emailService;
            _configuration = config;
        }

        public async Task<OrderResponseDto> CheckoutAsync(CreateOrderRequestDto request)
        {
            var currentUser = _userContext.GetCurrentUser();

            Order order;

            if (currentUser.IsAuthenticated)
            {
                order = await CreateLoggedInOrder(request, currentUser.UserId);
            }
            else
            {
                order = await CreateGuestOrder(request);
            }

            var paymentProcessor =
                _paymentProcessorFactory.GetProcessor(
                    request.PaymentMethod);

            await paymentProcessor.ProcessPaymentAsync(order);

            await _orderRepository.AddOrderAsync(order);

            await SendOrderConfirmationEmailAsync(order);

            return MapOrder(order);
        }

        private async Task<Order> CreateLoggedInOrder(CreateOrderRequestDto request,int userId)
        {
            var cart = await _cartRepository.GetByUserIdAsync(userId);

            if (cart == null || !cart.CartItems.Any())
                throw new Exception("Cart is empty.");

            var address = await _context.Addresses.FirstOrDefaultAsync(x =>
                                                                             x.Id == request.AddressId &&
                                                                             x.UserId == userId
                                                                       );

            if (address == null)
                throw new Exception("Invalid address.");

            var order = new Order
            {
                UserId = userId,
                AddressId = address.Id,
                PaymentMethod = request.PaymentMethod,
                CreatedAt = DateTime.UtcNow,
                TotalAmount = 0
            };

            foreach (var item in cart.CartItems)
            {
                order.OrderItems.Add(new OrderItem
                {
                    CakeId = item.CakeId,
                    Quantity = item.Quantity,
                    UnitPrice = item.Cake.Price
                });

                order.TotalAmount +=
                    item.Cake.Price * item.Quantity;
            }

            _context.CartItems.RemoveRange(cart.CartItems);

            await _context.SaveChangesAsync();

            return order;
        }

        private async Task<Order> CreateGuestOrder(CreateOrderRequestDto request)
        {
            if (request.GuestAddress == null)
                throw new Exception("Guest address required.");

            if (!request.Items.Any())
                throw new Exception("Cart is empty.");

            var address = new Address
            {
                UserId = null,

                FullName = request.GuestAddress.FullName,

                Mobile = request.GuestAddress.Mobile,

                Email = request.GuestAddress.Email,

                AddressLine1 = request.GuestAddress.AddressLine1,

                AddressLine2 = request.GuestAddress.AddressLine2,

                City = request.GuestAddress.City,

                State = request.GuestAddress.State,

                PostalCode = request.GuestAddress.PostalCode,

                Country = request.GuestAddress.Country
            };

            _context.Addresses.Add(address);

            await _context.SaveChangesAsync();

            var cakeIds = request.Items
                .Select(x => x.CakeId)
                .ToList();

            var cakes = await _context.Cakes
                .Where(x => cakeIds.Contains(x.Id))
                .ToListAsync();

            var order = new Order
            {
                

                AddressId = address.Id,

                PaymentMethod = request.PaymentMethod,

                OrderStatus = "Pending",

                PaymentStatus = "Pending",

                CreatedAt = DateTime.UtcNow
            };

            decimal total = 0;

            foreach (var item in request.Items)
            {
                var cake = cakes.First(x => x.Id == item.CakeId);

                order.OrderItems.Add(new OrderItem
                {
                    CakeId = cake.Id,

                    Quantity = item.Quantity,

                    UnitPrice = cake.Price
                });

                total += cake.Price * item.Quantity;
            }

            order.TotalAmount = total;

            return order;
        }
        //public async Task<OrderResponseDto> CheckoutAsync(CreateOrderRequestDto request)
        //{
        //    var currentUser =
        //        _userContext.GetCurrentUser();

        //    var cart =
        //        await _cartRepository.GetByUserIdAsync(
        //            currentUser.UserId);

        //    if (cart == null || !cart.CartItems.Any())
        //    {
        //        throw new Exception("Cart is empty.");
        //    }

        //    if (!request.AddressId.HasValue)
        //    {
        //        throw new Exception("Please select a shipping address.");
        //    }

        //    var address =
        //        await _context.Addresses
        //            .FirstOrDefaultAsync(x =>
        //                x.Id == request.AddressId &&
        //                x.UserId == currentUser.UserId);

        //    if (address == null)
        //    {
        //        throw new Exception("Invalid address.");
        //    }

        //    var totalAmount =
        //        cart.CartItems.Sum(x =>
        //            x.Cake.Price * x.Quantity);

        //    var order = new Order
        //    {
        //        UserId = currentUser.UserId,

        //        AddressId = address.Id,

        //        TotalAmount = totalAmount,
        //        PaymentMethod = request.PaymentMethod,

        //        CreatedAt = DateTime.UtcNow
        //    };

        //    foreach (var item in cart.CartItems)
        //    {
        //        order.OrderItems.Add(
        //            new OrderItem
        //            {
        //                CakeId = item.CakeId,
        //                Quantity = item.Quantity,
        //                UnitPrice = item.Cake.Price
        //            });
        //    }

        //    // Payment Strategy
        //    var paymentProcessor =
        //        _paymentProcessorFactory.GetProcessor(
        //            request.PaymentMethod);

        //    await paymentProcessor.ProcessPaymentAsync(order);

        //    await _orderRepository.AddOrderAsync(order);

        //    _context.CartItems.RemoveRange(
        //        cart.CartItems);

        //    await _context.SaveChangesAsync();

        //    return await GetOrderDetailsAsync(order.Id)
        //           ?? throw new Exception("Order creation failed.");
        //}

        public async Task<List<OrderResponseDto>> GetMyOrdersAsync()
        {
            var currentUser =
                _userContext.GetCurrentUser();

            var orders =
                await _orderRepository
                    .GetOrdersByUserIdAsync(
                        currentUser.UserId);

            return orders.Select(MapOrder).ToList();
        }

        public async Task<OrderResponseDto?> GetOrderDetailsAsync(int orderId)
        {
            var order =
                await _orderRepository
                    .GetOrderByIdAsync(orderId);

            if (order == null)
                return null;

            return MapOrder(order);
        }

        public async Task UpdateOrderStatusAsync(UpdateOrderStatusDto request)
        {
            var order =
                await _orderRepository
                    .GetOrderByIdAsync(request.OrderId);

            if (order == null)
                throw new Exception("Order not found");

            order.OrderStatus = request.OrderStatus;

            await _orderRepository.SaveChangesAsync();
        }

        private OrderResponseDto MapOrder(Order order)
        {
            return new OrderResponseDto
            {
                OrderId = order.Id,
                TotalAmount = order.TotalAmount,
                OrderStatus = order.OrderStatus,
                PaymentStatus = order.PaymentStatus,
                CreatedAt = order.CreatedAt,
                PaymentMethod = order.PaymentMethod,
                EstimatedDelivery = "Today / Tomorrow",
                ShippingAddress = order.Address == null
                                        ? null
                                        : new AddressResponseDto
                                        {
                                            AddressLine1 = order.Address.AddressLine1,
                                            AddressLine2 = order.Address.AddressLine2,
                                            City = order.Address.City,
                                            State = order.Address.State,
                                            PostalCode = order.Address.PostalCode,
                                            Country = order.Address.Country
                                        },
                Items = order.OrderItems
    .Select(x => new OrderItemDto
    {
        OrderItemId = x.Id,
        CakeId = x.CakeId,
        CakeName = x.Cake.Name,
        ImageUrl = _fileUpload.GetImageUrl(x.Cake.ImageUrl),
        Quantity = x.Quantity,
        UnitPrice = x.UnitPrice,
        TotalPrice = x.UnitPrice * x.Quantity
    })
    .ToList()
            };
        }

        public async Task CancelOrderAsync(int orderId)
        {
            var currentUser =
                _userContext.GetCurrentUser();

            var order =
                await _orderRepository
                    .GetOrderByIdAndUserIdAsync(
                        orderId,
                        currentUser.UserId);

            if (order == null)
            {
                throw new Exception("Order not found.");
            }

            if (order.OrderStatus == "Cancelled")
            {
                throw new Exception("Order is already cancelled.");
            }

            if (order.OrderStatus == "Shipped" ||
                order.OrderStatus == "Delivered")
            {
                throw new Exception(
                    "This order cannot be cancelled.");
            }

            order.OrderStatus = "Cancelled";

            if (order.PaymentMethod.Equals(
                    "COD",
                    StringComparison.OrdinalIgnoreCase))
            {
                order.PaymentStatus = "Cancelled";
            }

            // Future:
            // if (order.PaymentMethod == "Card")
            // {
            //     await _paymentProcessor.RefundAsync(order);
            //     order.PaymentStatus = "Refunded";
            // }

            await _orderRepository.UpdateAsync(order);
        }

        public async Task<List<OrderResponseDto>> GetRecentOrdersAsync()
        {
            var currentUser =
                _userContext.GetCurrentUser();

            var orders =
                await _orderRepository
                    .GetRecentOrdersByUserIdAsync(
                        currentUser.UserId);

            return orders
                .Select(MapOrder)
                .ToList();
        }

        public async Task UpdateOrderStatusAsync(UpdateOrderStatusRequestDto request)
        {
            var order = await _orderRepository.GetOrderByIdAsync(request.OrderId);

            if (order == null)
            {
                throw new NotFoundException(
                    "Order not found.");
            }


            var validStatuses = new[]
            {
                "Placed",
                "Confirmed",
                "Processing",
                "Out for Delivery",
                "Delivered",
                "Cancelled"
            };

            if (!validStatuses.Contains(request.OrderStatus,StringComparer.OrdinalIgnoreCase))
            {
                throw new BadRequestException("Invalid order status.");
            }

            order.OrderStatus = request.OrderStatus;

            if (request.OrderStatus.Equals("Delivered",StringComparison.OrdinalIgnoreCase))
            {
                order.PaymentStatus =
                    order.PaymentMethod.Equals(
                        "Cash On Delivery",
                        StringComparison.OrdinalIgnoreCase)
                    ? "Paid"
                    : order.PaymentStatus;
            }

            await _orderRepository.SaveChangesAsync();
            await SendOrderStatusUpdateEmailAsync(order);
        }

        public async Task<PagedResult<AdminOrderResponseDto>> GetPagedOrdersAsync(OrderPagedRequestDto request)
        {
            var result =
                await _orderRepository.GetPagedOrdersAsync(request);

            return new PagedResult<AdminOrderResponseDto>
            {
                Page = result.Page,

                PageSize = result.PageSize,

                TotalRecords = result.TotalRecords,

                TotalPages = result.TotalPages,

                Data = result.Data
                    .Select(x => new AdminOrderResponseDto
                    {
                        OrderId = x.Id,

                        OrderDate = x.CreatedAt,

                        CustomerName = x.User != null
                            ? $"{x.User.FirstName} {x.User.LastName}"
                            : "Guest User",

                        TotalAmount = x.TotalAmount,

                        PaymentMethod = x.PaymentMethod,

                        PaymentStatus = x.PaymentStatus,

                        OrderStatus = x.OrderStatus,

                        TransactionId = string.IsNullOrWhiteSpace(
                                x.StripePaymentIntentId)
                            ? "-"
                            : x.StripePaymentIntentId
                    })
                    .ToList()
            };
        }

        private async Task SendOrderConfirmationEmailAsync(Order order)
        {
            var address =
                await _context.Addresses
                    .FirstAsync(x => x.Id == order.AddressId);

            string? frontendBaseUrl =
                _configuration.GetValue<string>("Frontend:BaseUrl");

            if (frontendBaseUrl == null)
            {
                return;
            }

            var emailRequest =
                new EmailRequestDto
                {
                    Subject =
                        $"CakeStudio - Order #{order.Id} Confirmed",

                    Body = EmailTemplateService.BuildOrderConfirmationEmail(
                            order,
                            address,
                            frontendBaseUrl
                            )
                };

            if (!string.IsNullOrWhiteSpace(address.Email))
            {
                emailRequest.To = address.Email;

                if (order.UserId.HasValue)
                {
                    var user =
                        await _context.Users
                            .FirstAsync(x =>
                                x.Id == order.UserId);

                    if (!string.Equals(
                            user.Email,
                            address.Email,
                            StringComparison.OrdinalIgnoreCase))
                    {
                        emailRequest.Cc =
                        [
                            user.Email
                        ];
                    }
                }
            }
            else
            {
                if (order.UserId.HasValue)
                {
                    var user =
                        await _context.Users
                            .FirstAsync(x =>
                                x.Id == order.UserId);

                    emailRequest.To =
                        user.Email;
                }
                else
                {
                    return;
                }
            }

            await _emailService
                .SendEmailAsync(emailRequest);
        }

        private async Task SendOrderStatusUpdateEmailAsync(Order order)
        {
            var address = await _context.Addresses
                .FirstAsync(x => x.Id == order.AddressId);

            var frontendBaseUrl =
                _configuration.GetValue<string>("Frontend:BaseUrl");

            var body =
                EmailTemplateService.BuildOrderStatusUpdateEmail(
                    order,
                    address,
                    frontendBaseUrl);

            var emailRequest = new EmailRequestDto
            {
                Subject = $"CakeStudio - Order #{order.Id} Status Updated",

                Body = body
            };

            if (!string.IsNullOrWhiteSpace(address.Email))
            {
                emailRequest.To = address.Email;

                if (order.UserId.HasValue)
                {
                    var user = await _context.Users
                        .FirstAsync(x => x.Id == order.UserId);

                    if (!string.Equals(
                        user.Email,
                        address.Email,
                        StringComparison.OrdinalIgnoreCase))
                    {
                        emailRequest.Cc =
                        [
                            user.Email
                        ];
                    }
                }
            }
            else if (order.UserId.HasValue)
            {
                var user = await _context.Users
                    .FirstAsync(x => x.Id == order.UserId);

                emailRequest.To = user.Email;
            }

            await _emailService.SendEmailAsync(emailRequest);
        }
    }
}
