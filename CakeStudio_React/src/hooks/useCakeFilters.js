import { useMemo, useState } from "react";

const useCakeFilters = (cakes, initialCategory = null) => {

    const [sortBy, setSortBy] = useState("popular");
    const [showCount, setShowCount] = useState(12);
    const [view, setView] = useState("grid");
    const [page, setPage] = useState(1);

    const [selectedCategories, setSelectedCategories] = useState(() => {
        if (!initialCategory)
            return [];

        return [initialCategory];
    });
    const [selectedRatings, setSelectedRatings] = useState([]);
    const [priceRange, setPriceRange] = useState([100, 5000]);

    const handleCategoryChange = (id) => {
        setSelectedCategories(prev =>
            prev.includes(id)
                ? prev.filter(x => x !== id)
                : [...prev, id]
        );

        setPage(1);
    };

    const handleRatingChange = (rating) => {
        setSelectedRatings(prev =>
            prev.includes(rating)
                ? prev.filter(x => x !== rating)
                : [...prev, rating]
        );

        setPage(1);
    };

    const handleClear = () => {
        setSelectedCategories([]);
        setSelectedRatings([]);
        setPriceRange([100, 5000]);
        setSortBy("popular");
        setPage(1);
    };

    const filteredCakes = useMemo(() => {

        let result = [...cakes];

        // Category Filter
        if (selectedCategories.length > 0) {
            result = result.filter(cake =>
                selectedCategories.includes(cake.categoryId)
            );
        }

        // Rating Filter
        if (selectedRatings.length > 0) {
            result = result.filter(cake =>
                selectedRatings.some(r => cake.rating >= r)
            );
        }

        // Price Filter
        result = result.filter(cake =>
            cake.price >= priceRange[0] &&
            cake.price <= priceRange[1]
        );

        // Sorting
        switch (sortBy) {

            case "priceLow":
                result.sort((a, b) => a.price - b.price);
                break;

            case "priceHigh":
                result.sort((a, b) => b.price - a.price);
                break;

            case "rating":
                result.sort((a, b) => b.rating - a.rating);
                break;

            default:
                break;
        }

        return result;

    }, [
        cakes,
        selectedCategories,
        selectedRatings,
        priceRange,
        sortBy
    ]);

    const totalPages = Math.ceil(filteredCakes.length / showCount);

    const currentCakes = filteredCakes.slice(
        (page - 1) * showCount,
        page * showCount
    );

    return {

        sortBy,
        setSortBy,

        showCount,
        setShowCount,

        view,
        setView,

        page,
        setPage,

        selectedCategories,
        selectedRatings,
        priceRange,

        setPriceRange,

        handleCategoryChange,
        handleRatingChange,
        handleClear,

        currentCakes,
        filteredCakes,
        totalPages
    };
};

export default useCakeFilters;