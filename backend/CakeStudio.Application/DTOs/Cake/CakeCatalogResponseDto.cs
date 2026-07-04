using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Application.DTOs.Cake
{
    public class CakeCatalogResponseDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public decimal Price { get; set; }

        public string? ImageUrl { get; set; }

        public string Category { get; set; } = string.Empty;

        public bool IsEggless { get; set; }

        public bool IsAvailable { get; set; }

        public int StockQuantity { get; set; }

        public double AverageRating { get; set; }

        public int TotalReviews { get; set; }

        public string? weight { get; set; }

        public string? delievery { get; set; }

        public string? flavour { get; set; }

        public double? rating { get; set; }
        public int? reviewCount { get; set; }

        public List<string>? images { get; set; }
    }

    public class PagedResultCatalog<T>
    {
        public int Page { get; set; }

        public int PageSize { get; set; }

        public int TotalRecords { get; set; }

        public int TotalPages { get; set; }

        public List<T> Data { get; set; } = new();
    }
}
