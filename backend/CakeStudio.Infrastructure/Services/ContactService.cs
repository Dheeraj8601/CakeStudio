using CakeStudio.Application.DTOs.Contact;
using CakeStudio.Application.DTOs.Email;
using CakeStudio.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Infrastructure.Services
{
    public class ContactService : IContactService
    {
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;

        public ContactService(
            IEmailService emailService,
            IConfiguration configuration)
        {
            _emailService = emailService;
            _configuration = configuration;
        }

        public async Task SendContactMessageAsync(
            ContactRequestDto request)
        {
            await _emailService.SendEmailAsync(
                new EmailRequestDto
                {
                    To = _configuration["EmailSettings:FromEmail"],

                    Subject =
                        $"📩 Contact Us - {request.Subject}",

                    Body =
                        EmailTemplateService.ContactUsTemplate(
                            request.FullName,
                            request.Email,
                            request.Phone ?? "Not Provided",
                            request.Subject,
                            request.Message)
                });
        }
    }
}
