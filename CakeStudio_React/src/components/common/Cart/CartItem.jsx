import {
    Box,
    IconButton,
    TableCell,
    TableRow,
    Typography
} from "@mui/material";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

import QuantitySelector from "../ProductDetails/QuantitySelector";
import "../../Cart/cart.css"
const CartItem = ({

    item,

    onIncrease,

    onDecrease,

    onRemove

}) => {

    return (

        <TableRow hover>

            {/* Product Image */}

            <TableCell>

                <Box
                    component="img"
                    src={item.imageUrl}
                    alt={item.name}
                    className="cart-product-image"
                />

            </TableCell>

            {/* Name */}

            <TableCell>

                <Typography className="cart-product-name">

                    {item.name}

                </Typography>

                <Typography className="cart-product-weight">

                    {item.weight}

                </Typography>

            </TableCell>

            {/* Quantity */}

            <TableCell align="center">

                <QuantitySelector

                    compact

                    value={item.quantity}

                    onChange={(value) => {

                        if (value > item.quantity) {

                            onIncrease(item);

                        }
                        else {

                            onDecrease(item);

                        }

                    }}

                />

            </TableCell>

            {/* Price */}

            <TableCell align="center">

                <Typography
                    className="cart-price"
                >

                    ₹{item.price}

                </Typography>

            </TableCell>

            {/* Total */}

            <TableCell align="center">

                <Typography
                    className="cart-total"
                >

                    ₹{item.price * item.quantity}

                </Typography>

            </TableCell>

            {/* Remove */}

            <TableCell align="center">

                <IconButton

                    color="error"

                    onClick={() =>
                        onRemove(item)
                    }

                >

                    <CloseOutlinedIcon />

                </IconButton>

            </TableCell>

        </TableRow>

    );

};

export default CartItem;