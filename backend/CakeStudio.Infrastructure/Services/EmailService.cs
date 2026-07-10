using CakeStudio.Application.DTOs.Email;
using CakeStudio.Application.Interfaces;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration,ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendEmailAsync(EmailRequestDto request)
        {
            var settings =
                _configuration.GetSection("EmailSettings");

            var email = new MimeMessage();

            email.From.Add(
                new MailboxAddress(
                    settings["FromName"],
                    settings["FromEmail"]));

            email.To.Add(
                MailboxAddress.Parse(request.To));

            if (request.Cc != null && request.Cc.Any())
            {
                foreach (var cc in request.Cc)
                {
                    if (!string.IsNullOrWhiteSpace(cc))
                    {
                        email.Cc.Add(
                            MailboxAddress.Parse(cc));
                    }
                }
            }

            if (request.Bcc != null && request.Bcc.Any())
            {
                foreach (var bcc in request.Bcc)
                {
                    if (!string.IsNullOrWhiteSpace(bcc))
                    {
                        email.Bcc.Add(
                            MailboxAddress.Parse(bcc));
                    }
                }
            }

            email.Subject = request.Subject;

            email.Body =
                new TextPart("html")
                {
                    Text = request.Body
                };

            using var smtp = new SmtpClient();

            //await smtp.ConnectAsync(
            //    settings["Host"],
            //    Convert.ToInt32(settings["Port"]),
            //    MailKit.Security.SecureSocketOptions.StartTls);

            //await smtp.AuthenticateAsync(
            //    settings["Username"],
            //    settings["Password"]);

            //await smtp.SendAsync(email);

            try
            {
                await smtp.ConnectAsync(
                    settings["Host"],
                    Convert.ToInt32(settings["Port"]),
                    SecureSocketOptions.StartTls);

                await smtp.AuthenticateAsync(
                    settings["Username"],
                    settings["Password"]);

                await smtp.SendAsync(email);

            }
            catch (Exception ex)
            {
                _logger.LogInformation("User {Email} logged in successfully", ex.Message);
                Console.WriteLine(ex.ToString());
            }

            await smtp.DisconnectAsync(true);
        }
    }
}
