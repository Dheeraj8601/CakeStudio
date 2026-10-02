using CakeStudio.Persistence.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Application.Interfaces
{
    public interface IPasswordChangeOtpRepository
    {
        Task AddAsync(PasswordChangeOtp otp);

        Task<PasswordChangeOtp?> GetValidOtpAsync(
            int userId,
            string otpHash);

        Task InvalidateUserOtpsAsync(int userId);

        Task SaveChangesAsync();
    }
}
