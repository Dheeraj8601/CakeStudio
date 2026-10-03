using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CakeStudio.Persistence.Entities;

[Index("OrderId", "EmailType", Name = "UQ_EmailDeliveryLogs_Order_EmailType", IsUnique = true)]
public partial class EmailDeliveryLog
{
    [Key]
    public int Id { get; set; }

    public int OrderId { get; set; }

    [StringLength(50)]
    public string EmailType { get; set; } = null!;

    [StringLength(255)]
    public string RecipientEmail { get; set; } = null!;

    public DateTime? SentAt { get; set; }

    public DateTime CreatedAt { get; set; }

    [ForeignKey("OrderId")]
    [InverseProperty("EmailDeliveryLogs")]
    public virtual Order Order { get; set; } = null!;
}
