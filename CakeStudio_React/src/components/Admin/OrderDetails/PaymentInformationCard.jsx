import {
    Card,
    CardContent,
    Divider,
    Grid,
    Button,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    RadioGroup,
    FormControlLabel,
    Radio,
    Chip,
    Box
} from "@mui/material";

import Service from "../../../services/Service";
import { toast } from "react-toastify";

import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";

import { useState } from "react";

import PaymentStatusChip from "../Orders/PaymentStatusChip";

import "./PaymentInformationCard.css";

export default function PaymentInformationCard({
    order,
    onRefundSuccess
}) {
    const [refundOpen, setRefundOpen] = useState(false);
    const [refundType, setRefundType] = useState("full");
    const [refundAmount, setRefundAmount] = useState("");
    const [refundReason, setRefundReason] = useState("");
    const [refunding, setRefunding] = useState(false);

    const refundedAmount = Number(
        order.refundedAmount ?? 0
    );

    const refundableAmount = Number(
        order.refundableAmount ??
        order.totalAmount ??
        0
    );

    const refunds = order.refunds ?? [];

    // ---------------------------------------
    // DATE FORMATTER
    // ---------------------------------------

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "-";
        }

        return parsedDate.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    // ---------------------------------------
    // PAYMENT DETAILS
    // ---------------------------------------

    const details = [
        {
            label: "Payment Method",
            value: order.paymentMethod
                ? order.paymentMethod.toUpperCase()
                : "-",
            icon: <CreditCardOutlinedIcon />
        },

        {
            label: "Transaction ID",
            value:
                order.stripePaymentIntentId ||
                "-",
            icon: <ReceiptOutlinedIcon />
        },

        {
            label: "Payment Date",
            value: formatDate(
                order.paymentDate
            ),
            icon: <CalendarTodayOutlinedIcon />
        },

        {
            label: "Amount Paid",
            value: `₹${Number(
                order.totalAmount ?? 0
            ).toFixed(2)}`,
            icon: <CurrencyRupeeOutlinedIcon />
        },

        ...(refundedAmount > 0
            ? [
                  {
                      label: "Amount Refunded",
                      value: `₹${refundedAmount.toFixed(
                          2
                      )}`,
                      icon: (
                          <CurrencyRupeeOutlinedIcon />
                      )
                  },

                  {
                      label: "Refundable Amount",
                      value: `₹${refundableAmount.toFixed(
                          2
                      )}`,
                      icon: (
                          <CurrencyRupeeOutlinedIcon />
                      )
                  }
              ]
            : [])
    ];

    // ---------------------------------------
    // REFUND STATUS COLOR
    // ---------------------------------------

    const getRefundStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "succeeded":
                return "success";

            case "failed":
                return "error";

            case "pending":
                return "warning";

            default:
                return "default";
        }
    };

    // ---------------------------------------
    // OPEN REFUND DIALOG
    // ---------------------------------------

    const handleOpenRefund = () => {
        setRefundType("full");
        setRefundAmount("");
        setRefundReason("");
        setRefundOpen(true);
    };

    // ---------------------------------------
    // CLOSE REFUND DIALOG
    // ---------------------------------------

    const handleCloseRefund = () => {
        if (refunding) {
            return;
        }

        setRefundOpen(false);
        setRefundType("full");
        setRefundAmount("");
        setRefundReason("");
    };

    // ---------------------------------------
    // PROCESS REFUND
    // ---------------------------------------

    const handleRefund = async () => {
        if (refundableAmount <= 0) {
            toast.error(
                "This payment has already been fully refunded."
            );

            return;
        }

        // Partial refund validation

        if (refundType === "partial") {
            const amount =
                Number(refundAmount);

            if (
                !refundAmount ||
                Number.isNaN(amount) ||
                amount <= 0
            ) {
                toast.error(
                    "Enter a valid refund amount."
                );

                return;
            }

            if (amount > refundableAmount) {
                toast.error(
                    `Maximum refundable amount is ₹${refundableAmount.toFixed(
                        2
                    )}.`
                );

                return;
            }
        }

        // Refund reason validation

        const reason =
            refundReason.trim();

        if (!reason) {
            toast.error(
                "Please enter a refund reason."
            );

            return;
        }

        if (reason.length < 5) {
            toast.error(
                "Refund reason must be at least 5 characters."
            );

            return;
        }

        if (reason.length > 500) {
            toast.error(
                "Refund reason cannot exceed 500 characters."
            );

            return;
        }

        try {
            setRefunding(true);

            const data = {
                amount:
                    refundType === "full"
                        ? null
                        : Number(
                              refundAmount
                          ),

                reason: reason
            };

            await Service.refundPayment(
                order.orderId,
                data
            );

            toast.success(
                refundType === "full"
                    ? "Full refund submitted successfully."
                    : "Partial refund submitted successfully."
            );

            setRefundOpen(false);
            setRefundAmount("");
            setRefundReason("");
            setRefundType("full");

            // Reload order details

            if (onRefundSuccess) {
                await onRefundSuccess();
            }
        } catch (error) {
            console.error(
                "Refund failed:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                error.response?.data?.Message ||
                "Unable to process refund."
            );
        } finally {
            setRefunding(false);
        }
    };

    // ---------------------------------------
    // CAN REFUND
    // ---------------------------------------

    const canRefund =
        order.paymentMethod?.toLowerCase() ===
            "card" &&
        (
            order.paymentStatus?.toLowerCase() ===
                "paid" ||
            order.paymentStatus?.toLowerCase() ===
                "partiallyrefunded"
        ) &&
        refundableAmount > 0;

    return (
        <>
            {/* PAYMENT INFORMATION */}

            <Card className="payment-card">
                <CardContent>
                    <Typography className="payment-title">
                        Payment Information
                    </Typography>

                    <Divider sx={{ mb: 3 }} />

                    <Grid
                        container
                        spacing={3}
                    >
                        {details.map(
                            (item) => (
                                <Grid
                                    key={
                                        item.label
                                    }
                                    size={12}
                                >
                                    <div className="payment-row">
                                        <div className="payment-icon">
                                            {
                                                item.icon
                                            }
                                        </div>

                                        <div className="payment-content">
                                            <Typography className="payment-label">
                                                {
                                                    item.label
                                                }
                                            </Typography>

                                            <Typography
                                                className="payment-value"
                                                sx={
                                                    item.label ===
                                                    "Transaction ID"
                                                        ? {
                                                              wordBreak:
                                                                  "break-all"
                                                          }
                                                        : undefined
                                                }
                                            >
                                                {
                                                    item.value
                                                }
                                            </Typography>
                                        </div>
                                    </div>
                                </Grid>
                            )
                        )}

                        {/* PAYMENT STATUS */}

                        <Grid size={12}>
                            <div className="payment-row">
                                <div className="payment-icon">
                                    <CreditCardOutlinedIcon />
                                </div>

                                <div className="payment-content">
                                    <Typography className="payment-label">
                                        Payment
                                        Status
                                    </Typography>

                                    <PaymentStatusChip
                                        status={
                                            order.paymentStatus
                                        }
                                    />
                                </div>
                            </div>
                        </Grid>

                        {/* REFUND BUTTON */}

                        {canRefund && (
                            <Grid size={12}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={
                                        handleOpenRefund
                                    }
                                >
                                    {order.paymentStatus?.toLowerCase() ===
                                    "partiallyrefunded"
                                        ? "Refund More"
                                        : "Refund Payment"}
                                </Button>
                            </Grid>
                        )}
                    </Grid>

                    {/* REFUND HISTORY */}

                    {refunds.length > 0 && (
                        <>
                            <Divider
                                sx={{
                                    my: 3
                                }}
                            />

                            <Box
                                sx={{
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    gap: 1,
                                    mb: 2
                                }}
                            >
                                <HistoryOutlinedIcon />

                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight:
                                            600
                                    }}
                                >
                                    Refund
                                    History
                                </Typography>
                            </Box>

                            {refunds.map(
                                (
                                    refund,
                                    index
                                ) => (
                                    <Box
                                        key={
                                            refund.stripeRefundId ||
                                            index
                                        }
                                        sx={{
                                            border:
                                                "1px solid",
                                            borderColor:
                                                "divider",
                                            borderRadius:
                                                2,
                                            p: 2,

                                            mb:
                                                index <
                                                refunds.length -
                                                    1
                                                    ? 2
                                                    : 0
                                        }}
                                    >
                                        {/* REFUND AMOUNT + STATUS */}

                                        <Box
                                            sx={{
                                                display:
                                                    "flex",
                                                justifyContent:
                                                    "space-between",
                                                alignItems:
                                                    "center",
                                                gap: 2,
                                                mb: 1
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontWeight:
                                                        600,
                                                    fontSize:
                                                        "1.05rem"
                                                }}
                                            >
                                                ₹
                                                {Number(
                                                    refund.amount ??
                                                        0
                                                ).toFixed(
                                                    2
                                                )}
                                            </Typography>

                                            <Chip
                                                label={
                                                    refund.status ||
                                                    "Unknown"
                                                }
                                                color={getRefundStatusColor(
                                                    refund.status
                                                )}
                                                size="small"
                                            />
                                        </Box>

                                        {/* REQUESTED DATE */}

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                mb: 0.5
                                            }}
                                        >
                                            Requested:{" "}
                                            {formatDate(
                                                refund.requestedAt
                                            )}
                                        </Typography>

                                        {/* REFUNDED DATE */}

                                        {refund.refundedAt && (
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    mb: 0.5
                                                }}
                                            >
                                                Refunded:{" "}
                                                {formatDate(
                                                    refund.refundedAt
                                                )}
                                            </Typography>
                                        )}

                                        {/* REFUND REASON */}

                                        {refund.refundReason && (
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    mt: 1,
                                                    mb: 0.5
                                                }}
                                            >
                                                <strong>
                                                    Reason:
                                                </strong>{" "}
                                                {
                                                    refund.refundReason
                                                }
                                            </Typography>
                                        )}

                                        {/* STRIPE REFUND ID */}

                                        {refund.stripeRefundId && (
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    wordBreak:
                                                        "break-all"
                                                }}
                                            >
                                                Refund
                                                ID:{" "}
                                                {
                                                    refund.stripeRefundId
                                                }
                                            </Typography>
                                        )}
                                    </Box>
                                )
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            {/* REFUND DIALOG */}

            <Dialog
                open={refundOpen}
                onClose={
                    handleCloseRefund
                }
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Refund Payment
                </DialogTitle>

                <DialogContent>
                    {/* PAYMENT AMOUNTS */}

                    <Typography>
                        Paid Amount: ₹
                        {Number(
                            order.totalAmount ??
                                0
                        ).toFixed(2)}
                    </Typography>

                    {refundedAmount > 0 && (
                        <Typography>
                            Already Refunded: ₹
                            {refundedAmount.toFixed(
                                2
                            )}
                        </Typography>
                    )}

                    <Typography
                        sx={{ mb: 2 }}
                    >
                        Available to Refund: ₹
                        {refundableAmount.toFixed(
                            2
                        )}
                    </Typography>

                    {/* REFUND TYPE */}

                    <RadioGroup
                        value={refundType}
                        onChange={(e) => {
                            setRefundType(
                                e.target.value
                            );

                            setRefundAmount(
                                ""
                            );
                        }}
                    >
                        <FormControlLabel
                            value="full"
                            control={
                                <Radio />
                            }
                            label={`Full Refund (₹${refundableAmount.toFixed(
                                2
                            )})`}
                        />

                        <FormControlLabel
                            value="partial"
                            control={
                                <Radio />
                            }
                            label="Partial Refund"
                        />
                    </RadioGroup>

                    {/* PARTIAL REFUND AMOUNT */}

                    {refundType ===
                        "partial" && (
                        <TextField
                            fullWidth
                            type="number"
                            label="Refund Amount"
                            value={
                                refundAmount
                            }
                            onChange={(
                                e
                            ) =>
                                setRefundAmount(
                                    e.target
                                        .value
                                )
                            }
                            inputProps={{
                                min: 0.01,
                                max: refundableAmount,
                                step: 0.01
                            }}
                            helperText={`Maximum refundable amount: ₹${refundableAmount.toFixed(
                                2
                            )}`}
                            sx={{
                                mt: 2
                            }}
                        />
                    )}

                    {/* REFUND REASON */}

                    <TextField
                        fullWidth
                        required
                        multiline
                        rows={3}
                        label="Refund Reason"
                        value={
                            refundReason
                        }
                        onChange={(e) =>
                            setRefundReason(
                                e.target.value
                            )
                        }
                        inputProps={{
                            maxLength: 500
                        }}
                        helperText={`${refundReason.length}/500 characters`}
                        sx={{
                            mt: 2
                        }}
                    />
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={
                            handleCloseRefund
                        }
                        disabled={
                            refunding
                        }
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        onClick={
                            handleRefund
                        }
                        disabled={
                            refunding
                        }
                    >
                        {refunding
                            ? "Processing..."
                            : "Confirm Refund"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}