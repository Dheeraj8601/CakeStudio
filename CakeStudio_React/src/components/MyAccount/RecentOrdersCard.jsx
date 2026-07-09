import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Typography
} from "@mui/material";

import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";

import { useNavigate } from "react-router-dom";

import "./RecentOrdersCard.css";

export default function RecentOrdersCard({ orders }) {

    const navigate = useNavigate();

    const getStatusColor = (status) => {

        switch (status) {

            case "Delivered":
                return "success";

            case "Placed":
            case "Processing":
                return "warning";

            case "Cancelled":
                return "error";

            default:
                return "default";

        }

    };

    if (!orders || orders.length === 0) {

        return (

            <Card className="recent-orders-card">

                <CardContent>

                    <Typography>

                        No recent orders found.

                    </Typography>

                </CardContent>

            </Card>

        );

    }

    return (

        <Card className="recent-orders-card">

            <CardContent>

                <Box className="orders-header">

                    <Typography className="orders-title">

                        Recent Orders

                    </Typography>

                    <Button

                        endIcon={<ArrowForwardOutlinedIcon />}

                        onClick={() =>
                            navigate("/my-account/orders")
                        }

                    >

                        View All

                    </Button>

                </Box>

                {

                    orders.map((order, index) => {

                        const firstItem = order.items[0];

                        return (

                            <Box key={order.orderId}>

                                <Box className="order-item">

                                    <img

                                        src={firstItem.imageUrl}

                                        alt={firstItem.cakeName}

                                        className="order-image"

                                    />

                                    <Box className="order-content">

                                        <Typography className="cake-name">

                                            {firstItem.cakeName}

                                        </Typography>

                                        {

                                            order.items.length > 1 &&

                                            <Typography
                                                sx={{
                                                    fontSize: 13,
                                                    color: "#777"
                                                }}
                                            >

                                                +{order.items.length - 1} more item
                                                {order.items.length > 2 ? "s" : ""}

                                            </Typography>

                                        }

                                        <Typography className="order-id">

                                            #{order.orderId}

                                        </Typography>

                                        <Typography className="order-date">

                                            {

                                                new Date(order.createdAt)
                                                    .toLocaleDateString()

                                            }

                                        </Typography>

                                    </Box>

                                    <Box className="order-right">

                                        <Typography className="order-price">

                                            ₹{order.totalAmount}

                                        </Typography>

                                        <Chip

                                            label={order.orderStatus}

                                            color={getStatusColor(order.orderStatus)}

                                            size="small"

                                        />

                                        <Button

                                            size="small"

                                            sx={{ mt: 1 }}

                                            onClick={() =>
                                                navigate(`/my-account/orders/${order.orderId}`)
                                            }

                                        >

                                            View Details

                                        </Button>

                                    </Box>

                                </Box>

                                {

                                    index !== orders.length - 1 &&

                                    <Divider sx={{ my: 2 }} />

                                }

                            </Box>

                        );

                    })

                }

            </CardContent>

        </Card>

    );

}