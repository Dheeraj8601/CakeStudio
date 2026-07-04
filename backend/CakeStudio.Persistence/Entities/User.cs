
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CakeStudio.Persistence.Entities;

[Index("Email", Name = "UQ__Users__A9D10534E4EC5F7D", IsUnique = true)]
public partial class User
{
    [Key]
    public int Id { get; set; }

    [StringLength(100)]
    public string FirstName { get; set; } = null!;

    [StringLength(100)]
    public string? LastName { get; set; }

    [StringLength(255)]
    public string Email { get; set; } = null!;

    [StringLength(500)]
    public string PasswordHash { get; set; } = null!;

    [StringLength(20)]
    public string? PhoneNumber { get; set; }

    [StringLength(50)]
    public string Role { get; set; } = null!;

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
    public bool IsDeleted { get; set; }

    public DateTime? DeletedAt { get; set; }

    public int? DeletedBy { get; set; }

    public virtual ICollection<Address> Addresses { get; set; } = new List<Address>();

    [InverseProperty("CreatedByNavigation")]
    public virtual ICollection<Category> CategoryCreatedByNavigations { get; set; } = new List<Category>();

    [InverseProperty("ModifiedByNavigation")]
    public virtual ICollection<Category> CategoryModifiedByNavigations { get; set; } = new List<Category>();

    public virtual ICollection<InventoryTransaction> InventoryTransactions { get; set; } = new List<InventoryTransaction>();

    public virtual ICollection<Cake> Cakes { get; set; } = new List<Cake>();

    public virtual Cart? Cart { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
    public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

    public virtual ICollection<Wishlist> Wishlists { get; set; } = new List<Wishlist>();

    [ForeignKey("DeletedBy")]
    //[InverseProperty("InverseDeletedByNavigation")]
    public virtual User? DeletedByNavigation { get; set; }

    //[InverseProperty("DeletedByNavigation")]
    public virtual ICollection<User> InverseDeletedByNavigation { get; set; } = new List<User>();
}
