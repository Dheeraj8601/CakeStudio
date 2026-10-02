using CakeStudio.Application.DTOs.Email;
using CakeStudio.Application.Interfaces;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MimeKit;

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
            var settings = _configuration.GetSection("EmailSettings");

            var email = new MimeMessage();


            email.From.Add(
                new MailboxAddress(
                    settings["FromName"],
                    settings["FromEmail"]));



            email.To.Add(
                MailboxAddress.Parse(request.To));


            if (request.Cc != null &&
                request.Cc.Any())
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


            if (request.Bcc != null &&
                request.Bcc.Any())
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


            var bodyBuilder = new BodyBuilder
            {
                HtmlBody = request.Body
            };



            if (request.Attachments != null &&
                request.Attachments.Any())
            {
                foreach (var attachment in request.Attachments)
                {
                    if (attachment.Content == null ||
                        attachment.Content.Length == 0)
                    {
                        continue;
                    }

                    if (string.IsNullOrWhiteSpace(
                            attachment.FileName))
                    {
                        continue;
                    }


                    var contentType =
                        GetContentType(
                            attachment.ContentType);


                    bodyBuilder.Attachments.Add(
                        attachment.FileName,
                        attachment.Content,
                        contentType);
                }
            }

            email.Body = bodyBuilder.ToMessageBody();



            using var smtp = new SmtpClient();

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


                _logger.LogInformation(
                    "Email sent successfully to {Email}",
                    request.To);
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Failed to send email to {Email}",
                    request.To);

                throw;
            }
            finally
            {
                if (smtp.IsConnected)
                {
                    await smtp.DisconnectAsync(true);
                }
            }
        }

        private static ContentType GetContentType(
            string? contentType)
        {
            if (string.IsNullOrWhiteSpace(contentType))
            {
                return new ContentType(
                    "application",
                    "octet-stream");
            }


            var parts =
                contentType.Split(
                    '/',
                    2,
                    StringSplitOptions.RemoveEmptyEntries);


            if (parts.Length != 2)
            {
                return new ContentType(
                    "application",
                    "octet-stream");
            }


            return new ContentType(
                parts[0],
                parts[1]);
        }
    }
}