using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Application.DTOs.Review
{
    public class CakeReviewResponseDto
    {
        public int ReviewId { get; set; }

        public int Rating { get; set; }

        public string? Comment { get; set; }

        public DateTime CreatedAt { get; set; }

        public string? Status { get; set; }
        public string? Reply { get; set; }
        public DateTime? ReviewCommentedDate { get; set; }
        public string UserName { get; set; } = string.Empty;
    }
}
