using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Application.DTOs.User
{
    public class UpdateUserRequestDto
    {
        public int Id { get; set; }

        public string FirstName { get; set; } = string.Empty;

        public string? LastName { get; set; }

        public string Email { get; set; } = string.Empty;

        public string? PhoneNumber { get; set; }
    }
}
