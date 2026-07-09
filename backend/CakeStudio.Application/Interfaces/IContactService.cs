using CakeStudio.Application.DTOs.Contact;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Application.Interfaces
{
    public interface IContactService
    {
        Task SendContactMessageAsync(ContactRequestDto request);
    }
}
