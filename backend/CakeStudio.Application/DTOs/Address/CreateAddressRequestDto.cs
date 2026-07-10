using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Application.DTOs.Address
{
    public class CreateAddressRequestDto
    {
        public string AddressLine1 { get; set; } = string.Empty;

        public string? AddressLine2 { get; set; }

        public string City { get; set; } = string.Empty;

        public string State { get; set; } = string.Empty;

        public string PostalCode { get; set; } = string.Empty;

        public string Country { get; set; } = string.Empty;

        public bool IsDefault { get; set; }

        public string? FullName { get; set; } 

        public string? Mobile { get; set; } 

        public string? Email { get; set; }
    }
}
