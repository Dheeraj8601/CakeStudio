using CakeStudio.Persistence.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Application.Interfaces
{
    public interface IPaymentProcessor
    {
        string PaymentMethod { get; }

        Task ProcessPaymentAsync(Order order);
    }
}
