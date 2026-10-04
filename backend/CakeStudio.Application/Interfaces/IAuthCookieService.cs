using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Application.Interfaces
{
    public interface IAuthCookieService
    {
        void SetAuthCookies(string accessToken,string refreshToken);
        void DeleteAuthCookies();
    }
}
