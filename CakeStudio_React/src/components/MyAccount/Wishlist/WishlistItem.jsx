import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    IconButton,
    Rating,
    Typography
} from "@mui/material";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

import "./WishlistItem.css";
import useCart from "../../../hooks/useCart";
import Service from "../../../services/Service";

export default function WishlistItem({

    item,

    onReload,

}) {
    const { addToCart } = useCart();
    const onAddToCart = async(item) => {
        //console.log("ff", item)
        await addToCart(item.cakeId, 1)
        await handleRemove()
    }
    const handleRemove = async () => {

        try {

            await Service.removeWishlistItem(
                item.wishlistId
            );

            onReload?.();

        }
        catch (error) {

            console.error(error);

        }

    };

    return (

        <Card className="wishlist-item">

            <CardContent>

                <Box className="wishlist-row">

                    <img

                        src={item.imageUrl}

                        alt={item.name}

                        className="wishlist-image"

                    />

                    <Box className="wishlist-info">

                        <Typography className="wishlist-name">

                            {item.name}

                        </Typography>

                        <Box className="wishlist-rating">

                            <Rating

                                value={item.rating}

                                precision={0.5}

                                readOnly

                                size="small"

                            />

                            <Typography className="review-count">

                                ({item.reviews} Reviews)

                            </Typography>

                        </Box>

                        <Typography className="wishlist-description">

                            {item.description}

                        </Typography>

                        <Chip

                            label={item.weight}

                            size="small"

                            className="weight-chip"

                        />

                    </Box>

                    <Box className="wishlist-right">

                        <Typography className="wishlist-price">

                            ₹{item.price}

                        </Typography>

                        <Typography

                            className={

                                item.inStock

                                    ? "stock in-stock"

                                    : "stock out-stock"

                            }

                        >

                            {

                                item.inStock

                                    ? "In Stock"

                                    : "Out of Stock"

                            }

                        </Typography>

                        <Box className="wishlist-actions">

                            <IconButton

                                className="delete-btn"

                                onClick={handleRemove}

                            >

                                <DeleteOutlineOutlinedIcon />

                            </IconButton>

                            <Button

                                variant="contained"

                                startIcon={<ShoppingCartOutlinedIcon />}

                                className="cart-btn"

                                disabled={!item.inStock}

                                onClick={() => onAddToCart(item)}

                            >

                                Add to Cart

                            </Button>

                        </Box>

                    </Box>

                </Box>

            </CardContent>

        </Card>

    );

}