using CakeStudio.Persistence.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Application.Interfaces
{
    public interface IRefreshTokenRepository
    {
        Task RemoveUserRefreshTokensAsync(
            int userId);

        Task AddAsync(
            RefreshToken refreshToken);

        Task<RefreshToken?> GetValidTokenAsync(
            string token);

        Task SaveChangesAsync();

        Task<RefreshToken?> GetByTokenAsync(string token);
    }
}
