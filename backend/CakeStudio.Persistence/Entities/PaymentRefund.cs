using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CakeStudio.Persistence.Entities;

public partial class PaymentRefund
{
    [Key]
    public int Id { get; set; }

    public int PaymentId { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? StripeRefundId { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal Amount { get; set; }

    [StringLength(30)]
    [Unicode(false)]
    public string RefundStatus { get; set; } = null!;

    [StringLength(500)]
    public string? FailureReason { get; set; }

    public int RequestedByUserId { get; set; }

    public DateTime RequestedAt { get; set; }

    public DateTime? RefundedAt { get; set; }
    public string? RefundReason { get; set; }

    [ForeignKey("PaymentId")]
    [InverseProperty("PaymentRefunds")]
    public virtual Payment Payment { get; set; } = null!;

    [ForeignKey("RequestedByUserId")]
    [InverseProperty("PaymentRefunds")]
    public virtual User RequestedByUser { get; set; } = null!;
}
