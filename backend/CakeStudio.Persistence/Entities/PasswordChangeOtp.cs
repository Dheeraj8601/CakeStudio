using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CakeStudio.Persistence.Entities;

[Index("UserId", Name = "IX_PasswordChangeOtps_UserId")]
public partial class PasswordChangeOtp
{
    [Key]
    public int Id { get; set; }

    public int UserId { get; set; }

    [StringLength(500)]
    public string OtpHash { get; set; } = null!;

    public DateTime ExpiryDate { get; set; }

    public bool IsUsed { get; set; }

    public DateTime CreatedAt { get; set; }

    [ForeignKey("UserId")]
    [InverseProperty("PasswordChangeOtps")]
    public virtual User User { get; set; } = null!;
}
