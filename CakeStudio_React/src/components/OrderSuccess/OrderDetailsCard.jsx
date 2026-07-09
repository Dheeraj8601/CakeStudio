import {
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    Typography
} from "@mui/material";
import dayjs from "dayjs";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

import "./OrderDetailsCard.css";

export default function OrderDetailsCard({

    order,

    shipping

}) {

    console.log(order,"11")
    return (

        <Card className="order-details-card">

            <CardContent>

                <Box className="details-header">

                    <Inventory2OutlinedIcon className="details-icon" />

                    <Typography className="details-title">

                        Order Details

                    </Typography>

                </Box>

                <Grid
                    container
                    spacing={3}
                >

                    <Grid size={{ xs: 12, md: 6 }}>

                        <Box className="detail-row">

                            <ReceiptLongOutlinedIcon />

                            <Box>

                                <Typography className="detail-label">

                                    Order ID

                                </Typography>

                                <Typography className="detail-value">

                                    {order.orderId}

                                </Typography>

                            </Box>

                        </Box>

                    </Grid>

                    {

                        order.transactionId &&

                        <Grid size={{ xs: 12, md: 6 }}>

                            <Box className="detail-row">

                                <PaymentsOutlinedIcon />

                                <Box>

                                    <Typography className="detail-label">

                                        Transaction ID

                                    </Typography>

                                    <Typography className="detail-value">

                                        {order.transactionId}

                                    </Typography>

                                </Box>

                            </Box>

                        </Grid>

                    }

                    <Grid size={{ xs: 12, md: 6 }}>

                        <Box className="detail-row">

                            <CalendarMonthOutlinedIcon />

                            <Box>

                                <Typography className="detail-label">

                                    Order Date

                                </Typography>

                                <Typography className="detail-value">

                                    {dayjs(order.createdAt).format("dddd, DD MMMM YYYY, hh:mm A")}

                                </Typography>

                            </Box>

                        </Box>

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <Box className="detail-row">

                            <LocalShippingOutlinedIcon />

                            <Box>

                                <Typography className="detail-label">

                                    Estimated Delivery

                                </Typography>

                                <Typography className="detail-value">

                                    {order.estimatedDelivery}

                                </Typography>

                            </Box>

                        </Box>

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <Box className="detail-row">

                            <PaymentsOutlinedIcon />

                            <Box>

                                <Typography className="detail-label">

                                    Payment Method

                                </Typography>

                                <Typography className="detail-value">

                                    {order.paymentMethod}

                                </Typography>

                            </Box>

                        </Box>

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <Box className="detail-row">

                            <PaymentsOutlinedIcon />

                            <Box>

                                <Typography className="detail-label">

                                    Payment Status

                                </Typography>

                                <Chip

                                    size="small"

                                    color={
                                        order.paymentStatus === "Paid"

                                            ? "success"

                                            : "warning"
                                    }

                                    label={order.paymentStatus}

                                />

                            </Box>

                        </Box>

                    </Grid>

                </Grid>

                <Divider className="address-divider" />

                <Box className="address-header">

                    <LocationOnOutlinedIcon />

                    <Typography>

                        Delivery Address

                    </Typography>

                </Box>
                {shipping &&
                    <Box className="address-box">

                        <Typography>

                            {shipping.addressLine1}

                        </Typography>

                        {

                            shipping.addressLine2 &&

                            <Typography>

                                {shipping.addressLine2}

                            </Typography>

                        }

                        <Typography>

                            {shipping.city}, {shipping.state}

                        </Typography>

                        <Typography>

                            {shipping.postalCode}

                        </Typography>

                        <Typography>

                            {shipping.country}

                        </Typography>

                    </Box>
                }
            </CardContent>

        </Card>

    );

}