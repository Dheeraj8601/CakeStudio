using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CakeStudio.Persistence.Entities;

[Index("TokenHash", Name = "IX_PasswordResetTokens_TokenHash")]
public partial class PasswordResetToken
{
    [Key]
    public int Id { get; set; }

    public int UserId { get; set; }

    [StringLength(500)]
    public string TokenHash { get; set; } = null!;

    public DateTime ExpiryDate { get; set; }

    public bool IsUsed { get; set; }

    public DateTime CreatedAt { get; set; }

    [ForeignKey("UserId")]
    [InverseProperty("PasswordResetTokens")]
    public virtual User User { get; set; } = null!;
}
