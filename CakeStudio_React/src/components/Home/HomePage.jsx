import { useEffect, useRef, useState } from "react";

import HeroBanner from "../common/HeroBanner/HeroBanner";
import { HERO_BANNER } from "../../constants/heroBanner";

import {
    Box,
    Grid,
    IconButton
} from "@mui/material";

import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import CategoryCard from "../common/CategoryCard/CategoryCard";
import CakeCard from "../common/CakeCard/CakeCard";
import FeatureCard from "../common/FeatureCard/FeatureCard";
import SectionTitle from "../common/SectionTitle/SectionTitle";

import Service from "../../services/Service";
import { features } from "../../constants/featureData";

import "./homepage.css";

export default function HomePage() {

    const [wishlistCakeIds, setWishlistCakeIds] = useState([])
    const [categories, setCategories] = useState([]);
    const [cakes, setCakes] = useState([]);

    const sliderRef = useRef(null);

    useEffect(() => {
        loadCategories();
        loadFeaturedCakes();
        loadWishlistIds();
    }, []);

    const loadCategories = async () => {

        try {

            const response =
                await Service.getAllCategories();
            setCategories(response.data);

        }
        catch (error) {

            console.error(error);

        }

    };

    const loadFeaturedCakes = async () => {

        try {

            const response =
                await Service.getFeaturedCakes();

            setCakes(response.data);

        }
        catch (error) {

            console.error(error);

        }

    };

    const loadWishlistIds = async () => {
        try {
            const res = await Service.getWishlistCakeIds();
            setWishlistCakeIds(res.data)
        } catch (err) {
            console.error(err?.response)
        }
    }

    const scrollLeft = () => {

        sliderRef.current?.scrollBy({

            left: -300,

            behavior: "smooth"

        });

    };

    const scrollRight = () => {

        sliderRef.current?.scrollBy({

            left: 300,

            behavior: "smooth"

        });

    };

    return (

        <>

            <HeroBanner banner={HERO_BANNER} />

            <SectionTitle
                title="Featured Categories"
            />

            <Box className="categories-wrapper">

                {categories.length > 4 && (
                    <IconButton
                        className="category-arrow left"
                        onClick={scrollLeft}
                    >
                        <ChevronLeftRoundedIcon />
                    </IconButton>
                )}

                <Grid
                    ref={sliderRef}
                    container
                    wrap="nowrap"
                    spacing={4}
                    className="categories-slider"
                >
                    {categories.map(category => (

                        <Grid
                            key={category.id}
                            sx={{
                                minWidth: 300,
                                flexShrink: 0
                            }}
                        >
                            <CategoryCard
                                category={category}
                            />
                        </Grid>

                    ))}
                </Grid>

                {categories.length > 4 && (
                    <IconButton
                        className="category-arrow right"
                        onClick={scrollRight}
                    >
                        <ChevronRightRoundedIcon />
                    </IconButton>
                )}

            </Box>

            <SectionTitle
                title="Popular Cakes"
            />

            <Grid
                container
                spacing={4}
                sx={{
                    justifyContent: "center",
                    alignItems: "stretch",
                    mt: 1
                }}
            >

                {

                    cakes.map(cake => (

                        <Grid key={cake.id}>

                            <CakeCard
                                id={cake.id}
                                image={cake.imageUrl}
                                name={cake.name}
                                rating={cake.rating}
                                reviews={cake.totalReviews}
                                price={cake.price}
                                favourite={wishlistCakeIds.includes(cake.id)}
                            />

                        </Grid>

                    ))

                }

            </Grid>

            <Box
                sx={{
                    mx: "auto",
                    pt: 5
                }}
            >

                <Box className="feature-section">

                    <Grid
                        container
                        spacing={4}
                        sx={{
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}
                    >

                        {

                            features.map(feature => (

                                <Grid
                                    key={feature.id}
                                    size={{
                                        xs: 12,
                                        md: 3
                                    }}
                                >

                                    <FeatureCard
                                        feature={feature}
                                    />

                                </Grid>

                            ))

                        }

                    </Grid>

                </Box>

            </Box>

        </>

    );

}