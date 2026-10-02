using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Application.Interfaces
{
    public interface IInvoiceService
    {
        Task<byte[]> GenerateInvoiceAsync(int orderId);
    }
}
