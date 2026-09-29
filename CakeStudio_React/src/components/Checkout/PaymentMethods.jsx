import {
    Box,
    Card,
    CardContent,
    FormControlLabel,
    Radio,
    RadioGroup,
    Typography,
    Collapse
} from "@mui/material";

import PaymentsOutlinedIcon
    from "@mui/icons-material/PaymentsOutlined";

import "./payment.css";

const PaymentMethods = ({
    paymentMethod,
    setPaymentMethod
}) => {

    const handleChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    return (
        <Card
            sx={{
                mt: 4,
                borderRadius: 4,
                border: "1px solid #f4dbe2",
                boxShadow: "none"
            }}
        >
            <CardContent sx={{ p: 4 }}>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 3
                    }}
                >
                    <PaymentsOutlinedIcon
                        sx={{
                            color: "#ff5b84"
                        }}
                    />

                    <Typography
                        variant="h6"
                        fontWeight={700}
                    >
                        Payment Method
                    </Typography>
                </Box>

                <RadioGroup
                    value={paymentMethod}
                    onChange={handleChange}
                >
                    <FormControlLabel
                        value="cod"
                        control={<Radio />}
                        label="Cash on Delivery"
                    />

                    <FormControlLabel
                        value="card"
                        control={<Radio />}
                        label="Credit / Debit Card"
                    />
                </RadioGroup>

                {/* Stripe Card Payment */}
                <Collapse
                    in={paymentMethod === "card"}
                >
                    <Box
                        sx={{
                            mt: 3,
                            p: 2,
                            background: "#f8f9ff",
                            borderRadius: 2,
                            border: "1px solid #dde2ff"
                        }}
                    >
                        <Typography>
                            You will be redirected to Stripe
                            to securely complete your payment.
                        </Typography>
                    </Box>
                </Collapse>

                {/* Cash on Delivery */}
                <Collapse
                    in={paymentMethod === "cod"}
                >
                    <Box
                        sx={{
                            mt: 3,
                            p: 2,
                            background: "#fff8fa",
                            borderRadius: 2,
                            border: "1px solid #ffd8e3"
                        }}
                    >
                        <Typography>
                            Pay when your order is delivered.
                        </Typography>
                    </Box>
                </Collapse>

            </CardContent>
        </Card>
    );
};

export default PaymentMethods;