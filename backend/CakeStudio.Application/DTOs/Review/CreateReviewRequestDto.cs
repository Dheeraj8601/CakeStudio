using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Application.DTOs.Review
{
    public class CreateReviewRequestDto
    {
        public int OrderItemId { get; set; }

        public int CakeId { get; set; }

        public int Rating { get; set; }

        public string? Comment { get; set; }
    }
}
