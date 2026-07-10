using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CakeStudio.Persistence.Entities;

[Index("UserId", "CakeId", Name = "IX_Review_User_Cake", IsUnique = true)]
public partial class Review
{
    [Key]
    public int Id { get; set; }

    public int UserId { get; set; }

    public int CakeId { get; set; }

    public int Rating { get; set; }

    [StringLength(1000)]
    public string? Comment { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int OrderItemId { get; set; }

    [StringLength(1000)]
    public string? AdminReply { get; set; }

    public DateTime? RepliedAt { get; set; }

    [StringLength(20)]
    public string Status { get; set; } = null!;

    [ForeignKey("CakeId")]
   
    public virtual Cake Cake { get; set; } = null!;

    [ForeignKey("OrderItemId")]
    
    public virtual OrderItem OrderItem { get; set; } = null!;

    [ForeignKey("UserId")]
    
    public virtual User User { get; set; } = null!;
}
