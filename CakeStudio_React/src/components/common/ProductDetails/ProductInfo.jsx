import { useState } from "react";

import {
    Box,
    Button,
    Divider,
    Rating,
    Typography
} from "@mui/material";

import ReviewsDialog from "./ReviewsDialog";

import ProductSpecifications from "./ProductSpecifications";
import QuantitySelector from "./QuantitySelector";
import ProductActions from "./ProductActions";

import "./ProductInfo.css";

export default function ProductInfo({ product }) {

    const [quantity, setQuantity] = useState(1);

    const [openReviews, setOpenReviews] = useState(false);

    return (

        <Box className="product-info">

            <Typography className="product-title">
                {product.name}
            </Typography>

            <Typography className="product-price">
                ₹{product.price}
            </Typography>

            <Box className="product-rating">

                <Rating
                    value={product.rating}
                    precision={0.5}
                    readOnly
                />

                <Button
                    size="small"
                    onClick={() => setOpenReviews(true)}
                    sx={{
                        textTransform: "none",
                        ml: 1
                    }}
                >
                    ({product.reviewCount} Reviews)
                </Button>

            </Box>

            <Typography className="product-heading">
                Description
            </Typography>

            <Typography className="product-description">
                {product.description}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <ProductSpecifications
                product={product}
            />

            <Divider sx={{ my: 3 }} />

            <QuantitySelector
                value={quantity}
                onChange={setQuantity}
            />

            <ProductActions
                product={product}
                quantity={quantity}
            />

            <ReviewsDialog
                open={openReviews}
                onClose={() => setOpenReviews(false)}
                cakeId={product.id}
            />

        </Box>

    );

}