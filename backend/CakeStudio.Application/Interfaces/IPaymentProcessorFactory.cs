using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Application.Interfaces
{
    public interface IPaymentProcessorFactory
    {
        IPaymentProcessor GetProcessor(string paymentMethod);
    }
}
