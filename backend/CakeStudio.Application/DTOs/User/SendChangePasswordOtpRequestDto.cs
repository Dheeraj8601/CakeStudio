using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Application.DTOs.User
{
    public class SendChangePasswordOtpRequestDto
    {
        public string CurrentPassword { get; set; } = string.Empty;
    }
}
