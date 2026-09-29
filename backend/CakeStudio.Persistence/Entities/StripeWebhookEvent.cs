using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CakeStudio.Persistence.Entities;

[Index("StripeEventId", Name = "UQ_StripeWebhookEvents_StripeEventId", IsUnique = true)]
public partial class StripeWebhookEvent
{
    [Key]
    public long Id { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string StripeEventId { get; set; } = null!;

    [StringLength(100)]
    [Unicode(false)]
    public string EventType { get; set; } = null!;

    public DateTime ProcessedAt { get; set; }
}
