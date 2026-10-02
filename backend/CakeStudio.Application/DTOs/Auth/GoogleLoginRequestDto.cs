using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Application.DTOs.Auth
{
    public class GoogleLoginRequestDto
    {
        public string Credential { get; set; } = string.Empty;
    }
}
