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
    public class RefreshTokenRepository
     : IRefreshTokenRepository
    {
        private readonly CakeStudioDbContext _context;

        public RefreshTokenRepository(
            CakeStudioDbContext context)
        {
            _context = context;
        }

        public async Task RemoveUserRefreshTokensAsync(
            int userId)
        {
            var tokens =
                await _context.RefreshTokens
                    .Where(x => x.UserId == userId)
                    .ToListAsync();

            _context.RefreshTokens.RemoveRange(tokens);
        }

        public async Task AddAsync(
            RefreshToken refreshToken)
        {
            await _context.RefreshTokens
                .AddAsync(refreshToken);
        }

        public async Task<RefreshToken?>
            GetValidTokenAsync(string token)
        {
            return await _context.RefreshTokens
                .Include(x => x.User)
                .FirstOrDefaultAsync(x =>
                    x.Token == token &&
                    !x.IsRevoked);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task<RefreshToken?> GetByTokenAsync(string token)
        {
            return await _context.RefreshTokens
                .FirstOrDefaultAsync(
                    x => x.Token == token);
        }
    }
}
