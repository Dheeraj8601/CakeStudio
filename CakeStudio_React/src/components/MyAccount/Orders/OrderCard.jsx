import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Typography
} from "@mui/material";

import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import { useNavigate } from "react-router-dom";

import "./OrderCard.css";

import Service from "../../../services/Service";
import { toast } from "react-toastify";
import useCart from "../../../hooks/useCart";
import dayjs from "dayjs";

export default function OrderCard({

    order,

    onReload

}) {

    const navigate = useNavigate();

    const { addToCart } = useCart();

    const firstItem = order.items[0];
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

    const handleCancel = async () => {

        try {

            await Service.cancelOrder(
                order.orderId
            );

            toast.success(
                "Order cancelled successfully."
            );

            onReload?.();

        }
        catch (error) {

            toast.error(
                error.response?.data?.message ??
                "Unable to cancel order."
            );

        }

    };

    const handleReorder = () => {

        order.items.forEach(item => {

            addToCart(
                item.cakeId,
                item.quantity
            );

        });

        toast.success(
            "Items added to cart."
        );

    };

    return (

        <Card className="order-card">

            <CardContent>

                <Box className="order-top">

                    <Box className="order-product">

                        <img
                            src={firstItem.imageUrl}
                            alt={firstItem.cakeName}
                            className="order-image"
                        />

                        <Box>

                            <Typography className="cake-title">

                                {firstItem.cakeName}

                            </Typography>

                            {

                                order.items.length === 1 ? (

                                    <Typography className="cake-qty">

                                        Qty : {firstItem.quantity}

                                    </Typography>

                                ) : (

                                    <>

                                        <Typography className="cake-qty">

                                            {order.items.length} Items

                                        </Typography>

                                        <Typography
                                            sx={{
                                                fontSize: 13,
                                                color: "#777",
                                                mt: 0.5
                                            }}
                                        >

                                            + {order.items.length - 1} more item
                                            {order.items.length > 2 ? "s" : ""}

                                        </Typography>

                                    </>

                                )

                            }

                        </Box>

                    </Box>

                    <Chip

                        label={order.orderStatus}

                        color={
                            getStatusColor(
                                order.orderStatus
                            )
                        }

                    />

                </Box>

                <Box className="order-details">

                    <Box className="detail">

                        <ReceiptLongOutlinedIcon />

                        <Box>

                            <Typography className="label">

                                Order ID

                            </Typography>

                            <Typography>

                                #{order.orderId}

                            </Typography>

                        </Box>

                    </Box>

                    <Box className="detail">

                        <CalendarTodayOutlinedIcon />

                        <Box>

                            <Typography className="label">

                                Ordered On

                            </Typography>

                            <Typography>

                                {dayjs(order.createdAt).format("dddd, DD MMMM YYYY, hh:mm A")}

                            </Typography>

                        </Box>

                    </Box>

                    <Box className="detail">

                        <LocalShippingOutlinedIcon />

                        <Box>

                            <Typography className="label">

                                Delivery

                            </Typography>

                            <Typography>

                                {order.estimatedDelivery ?? "-"}

                            </Typography>

                        </Box>

                    </Box>

                    <Box className="detail">

                        <PaymentsOutlinedIcon />

                        <Box>

                            <Typography className="label">

                                Payment

                            </Typography>

                            <Typography>

                                {order.paymentMethod}

                            </Typography>

                        </Box>

                    </Box>

                </Box>

                <Box className="order-footer">

                    <Typography className="amount">

                        ₹{order.totalAmount}

                    </Typography>

                    <Box className="buttons">

                        <Button

                            variant="outlined"

                            startIcon={
                                <VisibilityOutlinedIcon />
                            }

                            onClick={() =>
                                navigate(
                                    `/my-account/orders/${order.orderId}`
                                )
                            }

                        >

                            View Details

                        </Button>

                        {

                            order.orderStatus !== "Cancelled" &&
                            order.orderStatus !== "Delivered" &&

                            <Button

                                color="error"

                                variant="outlined"

                                onClick={handleCancel}

                            >

                                Cancel

                            </Button>

                        }

                        <Button

                            variant="contained"

                            startIcon={
                                <ShoppingCartOutlinedIcon />
                            }

                            onClick={handleReorder}

                        >

                            Reorder

                        </Button>

                    </Box>

                </Box>

            </CardContent>

        </Card>

    );

}