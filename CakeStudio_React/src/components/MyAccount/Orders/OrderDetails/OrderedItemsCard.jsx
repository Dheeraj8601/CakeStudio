import {
    Box,
    Card,
    CardContent,
    Divider,
    Typography
} from "@mui/material";

import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

import "./OrderedItemsCard.css";

export default function OrderedItemsCard({ items }) {

    const subtotal = items.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0
    );

    const deliveryCharge = 0;

    const total = subtotal + deliveryCharge;

    return (

        <Card className="ordered-items-card">

            <CardContent>

                <Box className="ordered-header">

                    <ShoppingBagOutlinedIcon />

                    <Typography className="ordered-title">

                        Order Items

                    </Typography>

                </Box>

                {

                    items.map(item => (

                        <Box
                            key={item.id}
                            className="ordered-item"
                        >

                            <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="ordered-image"
                            />

                            <Box className="ordered-info">

                                <Typography className="cake-name">

                                    {item.cakeName}

                                </Typography>

                                <Typography className="cake-price">

                                    ₹{item.unitPrice}

                                </Typography>

                            </Box>

                            <Box className="ordered-qty">

                                <Typography className="heading">

                                    Quantity

                                </Typography>

                                <Typography>

                                    {item.quantity}

                                </Typography>

                            </Box>

                            <Box className="ordered-total">

                                <Typography className="heading">

                                    Total

                                </Typography>

                                <Typography className="item-total">

                                    ₹{item.unitPrice * item.quantity}

                                </Typography>

                            </Box>

                        </Box>

                    ))

                }

                <Divider sx={{ my: 3 }} />

                <Box className="summary">

                    <Box className="summary-row">

                        <Typography>

                            Subtotal

                        </Typography>

                        <Typography>

                            ₹{subtotal}

                        </Typography>

                    </Box>

                    <Box className="summary-row">

                        <Typography>

                            Delivery Charge

                        </Typography>

                        <Typography className="free">

                            FREE

                        </Typography>

                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box className="summary-row total">

                        <Typography>

                            Total Amount

                        </Typography>

                        <Typography>

                            ₹{total}

                        </Typography>

                    </Box>

                </Box>

            </CardContent>

        </Card>

    );

}