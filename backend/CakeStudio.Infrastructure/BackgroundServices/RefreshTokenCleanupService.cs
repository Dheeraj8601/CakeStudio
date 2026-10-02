using CakeStudio.API.DbContexts.models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace CakeStudio.Infrastructure.BackgroundServices
{
    public class RefreshTokenCleanupService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<RefreshTokenCleanupService> _logger;

        public RefreshTokenCleanupService(
            IServiceScopeFactory scopeFactory,
            ILogger<RefreshTokenCleanupService> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var scope =
                        _scopeFactory.CreateScope();

                    var context =
                        scope.ServiceProvider
                            .GetRequiredService<CakeStudioDbContext>();

                    var expiredTokens =
                        await context.RefreshTokens
                            .Where(x =>
                                x.ExpiryDate <= DateTime.UtcNow)
                            .ToListAsync(stoppingToken);

                    if (expiredTokens.Count > 0)
                    {
                        context.RefreshTokens.RemoveRange(
                            expiredTokens);

                        await context.SaveChangesAsync(
                            stoppingToken);

                        _logger.LogInformation(
                            "Deleted {Count} expired refresh tokens.",
                            expiredTokens.Count);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(
                        ex,
                        "Error while cleaning expired refresh tokens.");
                }

               await Task.Delay(
                   TimeSpan.FromHours(24),
                   stoppingToken);

                //await Task.Delay(TimeSpan.FromMinutes(1),stoppingToken);
            }
        }
    }
}