import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    IconButton,
    Rating,
    Typography
} from "@mui/material";

import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";

import "./CakeCard.css";
import { useNavigate } from "react-router-dom";
import useCart from "../../../hooks/useCart";
import SessionManage from "../../../Session/SessionManage";
import { toast } from "react-toastify";
import Service from "../../../services/Service";

const CakeCard = ({
    id,
    image,
    name,
    rating,
    reviews,
    price,
    favourite = false,
    onLoad
}) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const handleNavigate = () => {
        navigate(`/product/${id}`);
    };

    const handleCart = () => {
        addToCart(id, 1)
    }

    const handleWishlist = async (e) => {

        e.stopPropagation();

        if (!SessionManage.getTokenId()) {

            toast.warning("Please login to add items to your wishlist.");

            return;

        }

        try {
            if (!favourite) {


                await Service.addToWishlist({ cakeId: id });
                toast.success("Added to wishlist.");
            } else {
                await Service.removeWishlistByCakeId(id)
                toast.success("Removed from wishlist.");
            }
            await onLoad?.()


        }
        catch (error) {

            console.error(error);

            toast.error("Unable to add item to wishlist.");

        }

    };

    return (

        <Card className="cake-card" onClick={handleNavigate}>

            <Box className="cake-image-container">

                <CardMedia
                    component="img"
                    image={image}
                    alt={name}
                    className="cake-image-2"
                />

                <IconButton className="favorite-btn" onClick={handleWishlist}>
                    {
                        favourite
                            ?
                            <FavoriteOutlinedIcon color="error" />
                            :
                            <FavoriteBorderOutlinedIcon />
                    }

                </IconButton>

            </Box>

            <CardContent>

                <Typography className="cake-name">
                    {name}
                </Typography>

                <Box className="rating-container">

                    <Rating
                        value={rating}
                        precision={0.5}
                        readOnly
                        size="small"
                    />

                    <Typography className="review-count">
                        ({reviews})
                    </Typography>

                </Box>

                <Typography className="cake-price">
                    ₹{price}
                </Typography>

                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<ShoppingCartOutlinedIcon />}
                    className="add-cart-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleCart();
                    }}
                >
                    Add to Cart
                </Button>

            </CardContent>

        </Card>

    );

};

export default CakeCard;