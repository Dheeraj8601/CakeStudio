import { useEffect, useRef, useState } from "react";

import {
    Box,
    Grid,
    IconButton
} from "@mui/material";

import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import Breadcrumb from "../common/Breadcrumb/Breadcrumb";
import SectionTitle from "../common/SectionTitle/SectionTitle";
import CategoryCardLarge from "../common/Categories/CategoryCardLarge";

import Service from "../../services/Service";

import "./CategoriesComponent.css";

export default function CategoriesComponent() {

    const [categories, setCategories] = useState([]);

    const sliderRef = useRef(null);

    useEffect(() => {

        loadCategory();

    }, []);

    const loadCategory = async () => {

        const res =
            await Service.getCategories();

        setCategories(

            res.data.data.map(item => ({

                id: item.id,

                slug: item.id,

                image: item.imageUrl,

                icon: item.imageUrl,

                description: item.description,

                title: item.categoryName

            }))

        );

    };

    const scrollLeft = () => {

        sliderRef.current?.scrollBy({

            left: -1350,

            behavior: "smooth"

        });

    };

    const scrollRight = () => {

        sliderRef.current?.scrollBy({

            left: 1350,

            behavior: "smooth"

        });

    };

    return (

        <Box
            sx={{
                maxWidth: "1400px",
                mx: "auto",
                px: { xs: 2, md: 4 },
                py: 3
            }}
        >

            <Breadcrumb
                items={[
                    {
                        label: "Home",
                        path: "/"
                    },
                    {
                        label: "Categories"
                    }
                ]}
            />

            <SectionTitle
                title="Featured Categories"
                subtitle="Discover delicious cakes for every celebration."
            />

            <Box className="category-slider-wrapper">

                {

                    categories.length > 4 &&

                    <IconButton

                        className="category-nav left"

                        onClick={scrollLeft}

                    >

                        <ChevronLeftRoundedIcon />

                    </IconButton>

                }

                <Box

                    ref={sliderRef}

                    className="category-slider"

                >

                    {

                        categories.map(category => (

                            <Box

                                key={category.id}

                                className="category-slide"

                            >

                                <CategoryCardLarge

                                    category={category}

                                />

                            </Box>

                        ))

                    }

                </Box>

                {

                    categories.length > 4 &&

                    <IconButton

                        className="category-nav right"

                        onClick={scrollRight}

                    >

                        <ChevronRightRoundedIcon />

                    </IconButton>

                }

            </Box>

        </Box>

    );

}