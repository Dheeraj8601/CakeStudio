import { useEffect, useState } from "react";
import Service from "../services/Service";
import qs from "qs";

export default function useCakeCatalog(initialCategory = null) {

    const [cakes, setCakes] = useState([]);

    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(1);

    const [pageSize, setPageSize] = useState(12);

    const [totalPages, setTotalPages] = useState(1);

    const [totalRecords, setTotalRecords] = useState(0);

    const [sortBy, setSortBy] = useState("popular");

    const [selectedCategories, setSelectedCategories] = useState(initialCategory ? [initialCategory] : []);

    const [selectedRatings, setSelectedRatings] = useState([]);

    const [priceRange, setPriceRange] = useState([100, 5000]);

    useEffect(() => {
        loadCakes();
    }, [page, pageSize, sortBy, selectedCategories, selectedRatings, priceRange]);

    const loadCakes = async () => {

        try {

            setLoading(true);

            const params = {

                page,

                pageSize,

                sortBy,

                categoryIds: selectedCategories,

                ratings: selectedRatings,

                minPrice: priceRange[0],

                maxPrice: priceRange[1]
            };

            //console.log("params", paramsSerializer)
            const response = await Service.getCakeCatalog(params);
            console.log(response, "response", params)
            setCakes(response.data.data);

            setTotalPages(response.data.totalPages);

            setTotalRecords(response.data.totalRecords);

        }
        finally {

            setLoading(false);

        }

    };

    const handleCategoryChange = (id) => {
        //alert(id)
        setSelectedCategories(prev =>
            prev.includes(id)
                ? prev.filter(x => x !== id)
                : [...prev, id]);
        console.log(selectedCategories,"19-5")
        setPage(1);

    };

    const handleRatingChange = (rating) => {

        setSelectedRatings(prev =>
            prev.includes(rating)
                ? prev.filter(x => x !== rating)
                : [...prev, rating]);

        setPage(1);

    };

    const handleClear = () => {

        setSelectedCategories([]);

        setSelectedRatings([]);

        setPriceRange([100, 5000]);

        setSortBy("popular");

        setPage(1);

    };

    return {

        loading,

        cakes,

        totalPages,

        totalRecords,

        page,

        setPage,

        pageSize,

        setPageSize,

        sortBy,

        setSortBy,

        selectedCategories,

        selectedRatings,

        priceRange,

        setPriceRange,

        handleCategoryChange,

        handleRatingChange,

        handleClear
    };

}