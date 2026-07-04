import { Box, Button, Typography } from "@mui/material";

import FilterSection from "./FilterSection";
import CategoryFilter from "./CategoryFilter";
import PriceFilter from "./PriceFilter";
import RatingFilter from "./RatingFilter";

import {
    ratings
} from "../../../constants/filterData";

import "./FilterSidebar.css";
import { useEffect, useState } from "react";
import Service from "../../../services/Service";

const FilterSidebar = ({

    selectedCategories,
    selectedRatings,
    priceRange,

    onCategoryChange,
    onRatingChange,
    onPriceChange,

    onApply,
    onClear

}) => {

    const [categories, setCategories] = useState([]);
    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {

        try {

            const response =
                await Service.getAllCategories();

            setCategories(
                response.data.map(x => ({
                    id: x.id,
                    name: x.categoryName
                }))
            );

        }
        catch (error) {

            console.error(error);

        }

    };

    return (

        <Box className="filter-sidebar">

            <Typography
                className="filter-title"
            >
                Filters
            </Typography>

            <FilterSection title="Category">

                <CategoryFilter
                    categories={categories}
                    selectedCategories={selectedCategories}
                    onChange={onCategoryChange}
                />

            </FilterSection>

            <FilterSection title="Price Range">

                <PriceFilter
                    value={priceRange}
                    onChange={onPriceChange}
                />

            </FilterSection>

            <FilterSection title="Rating">

                <RatingFilter
                    ratings={ratings}
                    selectedRatings={selectedRatings}
                    onChange={onRatingChange}
                />

            </FilterSection>

            <Button
                fullWidth
                variant="contained"
                sx={{ mt: 2 }}
                onClick={onApply}
            >
                Apply Filters
            </Button>

            <Button
                fullWidth
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={onClear}
            >
                Clear All
            </Button>

        </Box>

    );

};

export default FilterSidebar;