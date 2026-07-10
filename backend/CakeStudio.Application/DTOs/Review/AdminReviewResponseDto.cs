using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Application.DTOs.Review
{
    public class AdminReviewResponseDto
    {
        public int ReviewId { get; set; }

        public int OrderId { get; set; }

        public int OrderItemId { get; set; }

        public string CustomerName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string CakeName { get; set; } = string.Empty;

        public int Rating { get; set; }

        public string? Comment { get; set; }
        public string? Status { get; set; }
        public string? Reply { get; set; }
        public DateTime? RepliedOn { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
