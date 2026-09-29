using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CakeStudio.Persistence.Entities;

[Index("OrderId", Name = "UQ_Payments_OrderId", IsUnique = true)]
public partial class Payment
{
    [Key]
    public int Id { get; set; }

    public int OrderId { get; set; }

    [StringLength(30)]
    [Unicode(false)]
    public string PaymentMethod { get; set; } = null!;

    [StringLength(30)]
    [Unicode(false)]
    public string PaymentStatus { get; set; } = null!;

    [Column(TypeName = "decimal(18, 2)")]
    public decimal Amount { get; set; }

    [StringLength(3)]
    [Unicode(false)]
    public string Currency { get; set; } = null!;

    [StringLength(255)]
    [Unicode(false)]
    public string? StripeCheckoutSessionId { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? StripePaymentIntentId { get; set; }

    [StringLength(500)]
    public string? FailureReason { get; set; }

    public DateTime? PaidAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    [ForeignKey("OrderId")]
    [InverseProperty("Payment")]
    public virtual Order Order { get; set; } = null!;

    [InverseProperty("Payment")]
    public virtual ICollection<PaymentRefund> PaymentRefunds { get; set; } = new List<PaymentRefund>();
}
