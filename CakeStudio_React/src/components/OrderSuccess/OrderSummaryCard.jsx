import {
    Box,
    Card,
    CardContent,
    Divider,
    Typography
} from "@mui/material";

import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

import "./OrderSummaryCard.css";

export default function OrderSummaryCard({ items }) {

    const subtotal = items.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0
    );

    const delivery = 0;

    const tax = 0;

    const total = subtotal + delivery + tax;

    return (

        <Card className="summary-card">

            <CardContent>

                <Box className="summary-header">

                    <ShoppingBagOutlinedIcon />

                    <Typography className="summary-title">

                        Order Summary

                    </Typography>

                </Box>

                <Box className="summary-items">

                    {

                        items.map(item => (

                            <Box
                                key={item.id}
                                className="summary-item"
                            >

                                <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className="summary-image"
                                />

                                <Box className="summary-info">

                                    <Typography className="cake-name">

                                        {item.cakeName}

                                    </Typography>

                                    <Typography className="cake-qty">

                                        Qty : {item.quantity}

                                    </Typography>

                                </Box>

                                <Typography className="cake-price">

                                    ₹{item.unitPrice}

                                </Typography>

                            </Box>

                        ))

                    }

                </Box>

                <Divider className="summary-divider"/>

                <Box className="price-row">

                    <Typography>

                        Subtotal

                    </Typography>

                    <Typography>

                        ₹{subtotal}

                    </Typography>

                </Box>

                <Box className="price-row">

                    <Typography>

                        Delivery

                    </Typography>

                    <Typography className="free">

                        FREE

                    </Typography>

                </Box>

                <Box className="price-row">

                    <Typography>

                        GST

                    </Typography>

                    <Typography>

                        ₹0

                    </Typography>

                </Box>

                <Divider className="summary-divider"/>

                <Box className="price-row total-row">

                    <Typography>

                        Grand Total

                    </Typography>

                    <Typography>

                        ₹{total}

                    </Typography>

                </Box>

            </CardContent>

        </Card>

    );

}