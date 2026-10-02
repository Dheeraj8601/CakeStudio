using CakeStudio.Application.DTOs.Email;
using CakeStudio.Application.Interfaces;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Infrastructure.BackgroundJobs
{
    public class EmailBackgroundJob : IEmailBackgroundJob
    {
        private readonly IEmailService _emailService;
        private readonly ILogger<EmailBackgroundJob> _logger;

        public EmailBackgroundJob(IEmailService emailService,ILogger<EmailBackgroundJob> logger)
        {
            _emailService = emailService;
            _logger = logger;
        }

        public async Task SendEmailAsync(EmailRequestDto request)
        {
            _logger.LogInformation(
                "Background email job started for {Email}",
                request.To);

            await _emailService.SendEmailAsync(request);

            _logger.LogInformation(
                "Background email job completed for {Email}",
                request.To);
        }
    }
}
