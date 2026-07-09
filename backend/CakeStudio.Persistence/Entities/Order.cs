using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CakeStudio.Persistence.Entities;

public partial class Order
{
    [Key]
    public int Id { get; set; }

    public int? UserId { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal TotalAmount { get; set; }

    [StringLength(50)]
    public string OrderStatus { get; set; } = null!;

    [StringLength(50)]
    public string PaymentStatus { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    [StringLength(255)]
    public string? StripeSessionId { get; set; }

    [StringLength(255)]
    public string? StripePaymentIntentId { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public int? AddressId { get; set; }

    [ForeignKey("AddressId")]
    [InverseProperty("Orders")]
    public virtual Address? Address { get; set; }

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    [ForeignKey("UserId")]
    public virtual User User { get; set; } = null!;
}
