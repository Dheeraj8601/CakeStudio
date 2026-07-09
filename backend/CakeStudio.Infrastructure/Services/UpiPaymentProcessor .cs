using CakeStudio.Application.Interfaces;
using CakeStudio.Persistence.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Infrastructure.Services
{
    public class UpiPaymentProcessor : IPaymentProcessor
    {
        public string PaymentMethod => "upi";

        public Task ProcessPaymentAsync(Order order)
        {
            throw new NotImplementedException(
                "UPI payment will be implemented.");
        }
    }
}
