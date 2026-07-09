using CakeStudio.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Infrastructure.Services
{
    public class PaymentProcessorFactory : IPaymentProcessorFactory
    {
        private readonly IEnumerable<IPaymentProcessor> _processors;

        public PaymentProcessorFactory(
            IEnumerable<IPaymentProcessor> processors)
        {
            _processors = processors;
        }

        public IPaymentProcessor GetProcessor(string paymentMethod)
        {
            var processor = _processors.FirstOrDefault(x =>
                x.PaymentMethod.Equals(
                    paymentMethod,
                    StringComparison.OrdinalIgnoreCase));

            if (processor == null)
                throw new Exception("Unsupported payment method.");

            return processor;
        }
    }
}
