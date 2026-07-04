using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CakeStudio.Persistence.Entities;

namespace CakeStudio.Application.DTOs.Cake
{
    public class CakeResponseDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }

        public int StockQuantity { get; set; }
        public bool IsEggless { get; set; }
        public bool IsAvailable { get; set; }

        public string? ImageUrl { get; set; }

        public int category { get; set; }
    }
}
