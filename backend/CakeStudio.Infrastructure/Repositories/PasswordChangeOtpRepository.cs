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
    public class PasswordChangeOtpRepository : IPasswordChangeOtpRepository
    {
        private readonly CakeStudioDbContext _context;

        public PasswordChangeOtpRepository(CakeStudioDbContext context)
        {
            _context = context;
        }


        public async Task AddAsync(PasswordChangeOtp otp)
        {
            await _context.PasswordChangeOtps
                .AddAsync(otp);
        }


        public async Task<PasswordChangeOtp?> GetValidOtpAsync(int userId,string otpHash)
        {
            return await _context.PasswordChangeOtps
                .FirstOrDefaultAsync(x =>
                    x.UserId == userId &&
                    x.OtpHash == otpHash &&
                    !x.IsUsed &&
                    x.ExpiryDate > DateTime.UtcNow);
        }


        public async Task InvalidateUserOtpsAsync(int userId)
        {
            var otps =
                await _context.PasswordChangeOtps
                    .Where(x =>
                        x.UserId == userId &&
                        !x.IsUsed)
                    .ToListAsync();

            foreach (var otp in otps)
            {
                otp.IsUsed = true;
            }
        }


        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
