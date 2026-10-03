import {
    Box,
    Grid,
    Button,
    CircularProgress,
    Typography
} from "@mui/material";

import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";

import { useEffect, useState } from "react";

import OrderHeader from "./OrderHeader";
import OrderSummaryCard from "./OrderSummaryCard";
import PaymentInformationCard from "./PaymentInformationCard";
import CustomerInformationCard from "./CustomerInformationCard";
import ShippingAddressCard from "./ShippingAddressCard";
import OrderedItemsTable from "./OrderedItemsTable";
import OrderTimeline from "./OrderTimeline";
import UpdateOrderStatus from "./UpdateOrderStatus";

import "./OrderDetails.css";

import Service from "../../../services/Service";
import { toast } from "react-toastify";


export default function OrderDetails(props) {

    const orderId = props.id;

    const [order, setOrder] = useState(null);
    const [downloadingInvoice, setDownloadingInvoice] =
        useState(false);


    // ---------------------------------------------------------
    // Load Order
    // ---------------------------------------------------------

    const loadOrder = async () => {

        try {

            const response =
                await Service.getOrderDetails(orderId);

            setOrder(response.data);

        }
        catch (error) {

            console.error(
                "Failed to load order:",
                error
            );

            toast.error(
                "Unable to load order details."
            );

        }

    };


    useEffect(() => {

        loadOrder();

    }, [orderId]);


    // ---------------------------------------------------------
    // Download Invoice
    // ---------------------------------------------------------

    const handleDownloadInvoice = async () => {

        if (downloadingInvoice) {
            return;
        }

        try {

            setDownloadingInvoice(true);

            const response =
                await Service.downloadInvoice(
                    order.orderId
                );

            const blob = new Blob(
                [response.data],
                {
                    type: "application/pdf"
                }
            );

            const url =
                window.URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                `CakeStudio_Invoice_${order.orderId}.pdf`;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        }
        catch (error) {

            console.error(
                "Invoice download failed:",
                error
            );

            let message =
                "Unable to download invoice.";

            if (
                error.response?.data instanceof Blob
            ) {

                try {

                    const text =
                        await error.response.data.text();

                    const data =
                        JSON.parse(text);

                    if (data.message) {
                        message = data.message;
                    }

                }
                catch {
                    // Use default message
                }

            }

            toast.error(message);

        }
        finally {

            setDownloadingInvoice(false);

        }

    };


    // ---------------------------------------------------------
    // Loading
    // ---------------------------------------------------------

    if (!order) {

        return (

            <Box className="admin-order-loading">

                <CircularProgress size={30} />

                <Typography>
                    Loading order details...
                </Typography>

            </Box>

        );

    }


    const isDelivered =
        order.orderStatus?.toLowerCase() ===
        "delivered";


    return (

        <Box className="admin-order-page">

            <Box className="admin-order-container">


                {/* =============================================
                    HEADER
                ============================================== */}

                <Box className="admin-order-header-section">

                    <OrderHeader
                        order={order}
                    />

                </Box>


                {/* =============================================
                    ORDER ACTIONS
                ============================================== */}

                {isDelivered && (

                    <Box className="admin-order-actions">

                        <Box>

                            <Typography
                                className="admin-order-actions-title"
                            >
                                Order Actions
                            </Typography>

                            <Typography
                                className="admin-order-actions-description"
                            >
                                Download the final invoice for
                                this order.
                            </Typography>

                        </Box>


                        <Button
                            className="admin-download-invoice-btn"
                            variant="contained"
                            startIcon={
                                downloadingInvoice
                                    ? (
                                        <CircularProgress
                                            size={17}
                                            color="inherit"
                                        />
                                    )
                                    : (
                                        <DownloadOutlinedIcon />
                                    )
                            }
                            disabled={downloadingInvoice}
                            onClick={handleDownloadInvoice}
                        >

                            {
                                downloadingInvoice
                                    ? "Generating Invoice..."
                                    : "Download Invoice"
                            }

                        </Button>

                    </Box>

                )}


                {/* =============================================
                    MAIN INFORMATION
                ============================================== */}

                <Grid
                    container
                    spacing={2.5}
                    alignItems="stretch"
                >

                    {/* Order Summary */}

                    <Grid
                        size={{
                            xs: 12,
                            lg: 6
                        }}
                    >

                        <Box className="admin-order-card">

                            <OrderSummaryCard
                                order={order}
                            />

                        </Box>

                    </Grid>


                    {/* Payment */}

                    <Grid
                        size={{
                            xs: 12,
                            lg: 6
                        }}
                    >

                        <Box className="admin-order-card">

                            <PaymentInformationCard
                                order={order}
                                onRefundSuccess={loadOrder}
                            />

                        </Box>

                    </Grid>


                    {/* Customer */}

                    <Grid
                        size={{
                            xs: 12,
                            lg: 6
                        }}
                    >

                        <Box className="admin-order-card">

                            <CustomerInformationCard
                                order={order}
                            />

                        </Box>

                    </Grid>


                    {/* Shipping */}

                    <Grid
                        size={{
                            xs: 12,
                            lg: 6
                        }}
                    >

                        <Box className="admin-order-card">

                            <ShippingAddressCard
                                order={
                                    order.shippingAddress
                                }
                            />

                        </Box>

                    </Grid>


                    {/* Ordered Items */}

                    <Grid size={{ xs: 12 }}>

                        <Box className="admin-order-card">

                            <OrderedItemsTable
                                items={order.items}
                            />

                        </Box>

                    </Grid>


                    {/* Timeline */}

                    <Grid
                        size={{
                            xs: 12,
                            lg: 6
                        }}
                    >

                        <Box className="admin-order-card">

                            <OrderTimeline
                                order={order}
                            />

                        </Box>

                    </Grid>


                    {/* Update Status */}

                    <Grid
                        size={{
                            xs: 12,
                            lg: 6
                        }}
                    >

                        <Box className="admin-order-card">

                            <UpdateOrderStatus
                                order={order}
                                onReload={loadOrder}
                            />

                        </Box>

                    </Grid>

                </Grid>

            </Box>

        </Box>

    );

}