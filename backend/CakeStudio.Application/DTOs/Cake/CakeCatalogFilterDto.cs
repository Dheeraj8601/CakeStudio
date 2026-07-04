using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CakeStudio.Application.DTOs.Cake
{
    public class CakeCatalogFilterDto
    {
        public string? Search { get; set; }

        // Multiple category ids
        public List<int>? CategoryIds { get; set; }

        public decimal? MinPrice { get; set; }

        public decimal? MaxPrice { get; set; }

        // Example: 4,5
        public List<int>? Ratings { get; set; }

        /// <summary>
        /// newest
        /// priceLow
        /// priceHigh
        /// rating
        /// popular
        /// </summary>
        public string SortBy { get; set; } = "popular";

        [Range(1, int.MaxValue)]
        public int Page { get; set; } = 1;

        [Range(1, 100)]
        public int PageSize { get; set; } = 12;
    }
}
