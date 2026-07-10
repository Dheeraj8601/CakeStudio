using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Application.DTOs.Review
{
    public class ReplyReviewRequestDto
    {
        public int ReviewId { get; set; }

        public string Reply { get; set; } = string.Empty;
    }
}
