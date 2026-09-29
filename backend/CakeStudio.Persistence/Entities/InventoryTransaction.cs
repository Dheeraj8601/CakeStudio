using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CakeStudio.Persistence.Entities;

public partial class InventoryTransaction
{
    [Key]
    public int Id { get; set; }

    public int CakeId { get; set; }

    public int Quantity { get; set; }

    [StringLength(50)]
    public string TransactionType { get; set; } = null!;

    [StringLength(500)]
    public string? Remarks { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    [ForeignKey("CakeId")]
    public virtual Cake Cake { get; set; } = null!;

    [ForeignKey("CreatedBy")]
    public virtual User CreatedByNavigation { get; set; } = null!;
}
