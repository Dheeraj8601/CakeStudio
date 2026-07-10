import {
    Card,
    CardContent,
    Divider,
    Grid,
    Typography
} from "@mui/material";

import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";

import PaymentStatusChip from "../Orders/PaymentStatusChip";

import "./PaymentInformationCard.css";

export default function PaymentInformationCard({ order }) {

    const details = [

        {
            label: "Payment Method",
            value: order.paymentMethod.toUpperCase(),
            icon: <CreditCardOutlinedIcon />
        },

        {
            label: "Transaction ID",
            value: '-',
            icon: <ReceiptOutlinedIcon />
        },

        {
            label: "Payment Date",
            value: '-',
            icon: <CalendarTodayOutlinedIcon />
        },

        {
            label: "Amount Paid",
            value: `₹${order.totalAmount}`,
            icon: <CurrencyRupeeOutlinedIcon />
        }

    ];

    return (

        <Card className="payment-card">

            <CardContent>

                <Typography className="payment-title">

                    Payment Information

                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>

                    {

                        details.map(item => (

                            <Grid

                                key={item.label}

                                size={12}

                            >

                                <div className="payment-row">

                                    <div className="payment-icon">

                                        {item.icon}

                                    </div>

                                    <div className="payment-content">

                                        <Typography className="payment-label">

                                            {item.label}

                                        </Typography>

                                        <Typography className="payment-value">

                                            {item.value}

                                        </Typography>

                                    </div>

                                </div>

                            </Grid>

                        ))

                    }

                    <Grid size={12}>

                        <div className="payment-row">

                            <div className="payment-icon">

                                <CreditCardOutlinedIcon />

                            </div>

                            <div className="payment-content">

                                <Typography className="payment-label">

                                    Payment Status

                                </Typography>

                                <PaymentStatusChip

                                    status={order.paymentStatus}

                                />

                            </div>

                        </div>

                    </Grid>

                </Grid>

            </CardContent>

        </Card>

    );

}