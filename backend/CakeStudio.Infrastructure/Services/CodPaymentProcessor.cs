using CakeStudio.Application.Interfaces;
using CakeStudio.Persistence.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Infrastructure.Services
{
    public class CodPaymentProcessor : IPaymentProcessor
    {
        public string PaymentMethod => "cod";

        public Task ProcessPaymentAsync(Order order)
        {
            order.PaymentStatus = "Pending";
            order.OrderStatus = "Placed";

            return Task.CompletedTask;
        }
    }
}
