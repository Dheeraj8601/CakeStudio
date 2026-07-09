import {
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    Typography
} from "@mui/material";

import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";

import "./PaymentDetailsCard.css";

export default function PaymentDetailsCard({ order }) {

    const isCod =
        order.paymentMethod?.toLowerCase() === "cod";

    return (

        <Card className="payment-card">

            <CardContent>

                <Box className="payment-header">

                    <PaymentsOutlinedIcon />

                    <Typography className="payment-title">

                        Payment Details

                    </Typography>

                </Box>

                <Divider sx={{ mb: 3 }} />

                <Box className="payment-item">

                    <PaymentsOutlinedIcon />

                    <Box>

                        <Typography className="payment-label">

                            Payment Method

                        </Typography>

                        <Typography className="payment-value">

                            {order.paymentMethod?.toUpperCase()}

                        </Typography>

                    </Box>

                </Box>

                {

                    !isCod && order.transactionId && (

                        <Box className="payment-item">

                            <ReceiptLongOutlinedIcon />

                            <Box>

                                <Typography className="payment-label">

                                    Transaction ID

                                </Typography>

                                <Typography className="payment-value">

                                    {order.transactionId}

                                </Typography>

                            </Box>

                        </Box>

                    )

                }

                <Box className="payment-item">

                    <CalendarTodayOutlinedIcon />

                    <Box>

                        <Typography className="payment-label">

                            Payment Date

                        </Typography>

                        <Typography className="payment-value">

                            {

                                new Date(order.createdAt)
                                    .toLocaleString()

                            }

                        </Typography>

                    </Box>

                </Box>

                <Box className="payment-item">

                    <CurrencyRupeeOutlinedIcon />

                    <Box>

                        <Typography className="payment-label">

                            Amount

                        </Typography>

                        <Typography className="payment-value amount">

                            ₹{order.totalAmount}

                        </Typography>

                    </Box>

                </Box>

                <Divider sx={{ my: 3 }} />

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                >

                    <Typography
                        fontWeight={600}
                    >

                        Payment Status

                    </Typography>

                    <Chip

                        label={order.paymentStatus}

                        color={
                            order.paymentStatus === "Paid"
                                ? "success"
                                : order.paymentStatus === "Failed"
                                    ? "error"
                                    : "warning"
                        }

                    />

                </Box>

            </CardContent>

        </Card>

    );

}