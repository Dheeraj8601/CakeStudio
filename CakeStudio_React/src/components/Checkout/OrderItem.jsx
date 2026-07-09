import {
    Box,
    Typography
} from "@mui/material";
import "./checkout.css"
const OrderItem = ({ item }) => {

    return (

        <Box className="order-item">

            <img
                src={item.imageUrl}
                alt={item.name}
                className="order-image"
            />

            <Box className="order-info">

                <Typography className="order-name">

                    {item.name}

                </Typography>

                <Typography className="order-qty">

                    Qty : {item.quantity}

                </Typography>

            </Box>

            <Typography className="order-price">

                ₹{item.price * item.quantity}

            </Typography>

        </Box>

    );

};

export default OrderItem;