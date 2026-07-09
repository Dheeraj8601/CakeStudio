using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CakeStudio.Persistence.Entities
{

    public partial class Address
    {
        [Key]
        public int Id { get; set; }

        public int? UserId { get; set; }

        [StringLength(250)]
        public string AddressLine1 { get; set; } = null!;

        [StringLength(250)]
        public string? AddressLine2 { get; set; }

        [StringLength(100)]
        public string City { get; set; } = null!;

        [StringLength(100)]
        public string State { get; set; } = null!;

        [StringLength(20)]
        public string PostalCode { get; set; } = null!;

        [StringLength(100)]
        public string Country { get; set; } = null!;

        public bool IsDefault { get; set; }

        public DateTime CreatedAt { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;

        [InverseProperty("Address")]
        public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}
