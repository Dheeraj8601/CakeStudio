import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Link,
    Box
} from "@mui/material";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import { useNavigate } from "react-router-dom";

import "./CategoryCard.css";

export default function CategoryCard({

    category

}) {

    const navigate = useNavigate();

    const handleClick = () => {

        navigate(
            `/cakes?category=${encodeURIComponent(category.id)}`
        );

    };

    return (

        <Card

            className="category-card"

            onClick={handleClick}

        >

            <CardMedia

                component="img"

                image={category.imageUrl}

                alt={category.categoryName}

                className="category-image"

            />

            <CardContent className="category-content">

                <Typography

                    className="category-title"

                >

                    {category.categoryName}

                </Typography>

                <Typography

                    className="category-subtitle"

                >

                    Freshly baked cakes crafted with love.

                </Typography>

                <Box className="category-link-container">

                    <Link

                        underline="none"

                        className="category-link"

                    >

                        Explore Cakes
                        

                    </Link>

                    

                </Box>

            </CardContent>

        </Card>

    );

}