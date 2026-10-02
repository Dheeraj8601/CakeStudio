using CakeStudio.Application.DTOs.Email;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Application.Interfaces
{
    public interface IEmailBackgroundJob
    {
        Task SendEmailAsync(EmailRequestDto request);
    }
}
