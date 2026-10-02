using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Application.DTOs.Email
{
    public class EmailAttachmentDto
    {
        public string FileName { get; set; } = string.Empty;

        public byte[] Content { get; set; } = [];

        public string ContentType { get; set; } =
            "application/octet-stream";
    }
}
