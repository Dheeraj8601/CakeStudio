using CakeStudio.Application.Interfaces;
using CakeStudio.Persistence.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Infrastructure.Services
{
    public class StripePaymentProcessor : IPaymentProcessor
    {
        public string PaymentMethod => "card";

        public Task ProcessPaymentAsync(Order order)
        {
            throw new NotImplementedException(
                "Stripe payment will be implemented.");
        }

    }
}
