using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Application.DTOs.Email
{
    public class EmailRequestDto
    {
        public string To { get; set; } = string.Empty;
        public List<string>? Cc { get; set; }

        public List<string>? Bcc { get; set; }

        public string Subject { get; set; } = string.Empty;

        public string Body { get; set; } = string.Empty;
    }
}
