import {
    Card,
    CardContent,
    Divider,
    Grid,
    Typography
} from "@mui/material";

import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";

import "./OrderSummaryCard.css";
import dayjs from "dayjs";

export default function OrderSummaryCard({ order }) {

    const details = [

        {
            label: "Order ID",
            value: order.orderId,
            icon: <ReceiptLongOutlinedIcon />
        },

        {
            label: "Order Date",
            value: dayjs(order.createdAt).format("dddd,DD MMMM YYYY,hh:mm A"),
            icon: <CalendarMonthOutlinedIcon />
        },

        {
            label: "Estimated Delivery",
            value: order.estimatedDelivery,
            icon: <LocalShippingOutlinedIcon />
        },

        {
            label: "Items",
            value: order.items.length,
            icon: <ShoppingBagOutlinedIcon />
        },

        {
            label: "Total Amount",
            value: `₹${order.totalAmount}`,
            icon: <CurrencyRupeeOutlinedIcon />
        }

    ];

    return (

        <Card className="summary-card">

            <CardContent>

                <Typography className="summary-title">

                    Order Summary

                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>

                    {

                        details.map(item => (

                            <Grid

                                key={item.label}

                                size={12}

                            >

                                <div className="summary-row">

                                    <div className="summary-icon">

                                        {item.icon}

                                    </div>

                                    <div className="summary-content">

                                        <Typography className="summary-label">

                                            {item.label}

                                        </Typography>

                                        <Typography className="summary-value">

                                            {item.value}

                                        </Typography>

                                    </div>

                                </div>

                            </Grid>

                        ))

                    }

                </Grid>

            </CardContent>

        </Card>

    );

}