using CakeStudio.API.DbContexts.models;
using CakeStudio.Application.Interfaces;
using CakeStudio.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Infrastructure.Repositories
{
    public class PasswordResetTokenRepository : IPasswordResetTokenRepository
    {
        private readonly CakeStudioDbContext _context;

        public PasswordResetTokenRepository(CakeStudioDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(PasswordResetToken token)
        {
            await _context.PasswordResetTokens
                .AddAsync(token);
        }

        public async Task<PasswordResetToken?> GetValidTokenAsync(string tokenHash)
        {
            return await _context.PasswordResetTokens
                .Include(x => x.User)
                .FirstOrDefaultAsync(x =>
                    x.TokenHash == tokenHash &&
                    !x.IsUsed &&
                    x.ExpiryDate > DateTime.UtcNow);
        }

        public async Task InvalidateUserTokensAsync(int userId)
        {
            var tokens =
                await _context.PasswordResetTokens
                    .Where(x =>
                        x.UserId == userId &&
                        !x.IsUsed)
                    .ToListAsync();

            foreach (var token in tokens)
            {
                token.IsUsed = true;
            }
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
