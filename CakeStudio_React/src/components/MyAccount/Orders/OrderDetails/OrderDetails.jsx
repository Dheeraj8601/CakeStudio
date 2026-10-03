import { useEffect, useState } from "react";
import Service from "../../../../services/Service";

import {
    Box,
    Typography,
    Grid,
    Button,
    CircularProgress
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";

import OrderHeaderCard from "./OrderHeaderCard";
import OrderedItemsCard from "./OrderedItemsCard";
import ShippingAddressCard from "./ShippingAddressCard";
import PaymentDetailsCard from "./PaymentDetailsCard";
import AccountSupportCard from "../../AccountSupportCard";
import OrderTimeline from "../../../Admin/OrderDetails/OrderTimeline";
import ReviewSection from "./ReviewSection";

import dayjs from "dayjs";
import { toast } from "react-toastify";

import "./OrderDetails.css";


export default function OrderDetails(props) {

    const [order, setOrder] = useState(null);

    const [downloadingInvoice, setDownloadingInvoice] =
        useState(false);


    useEffect(() => {

        loadOrder();

    }, [props.id]);


    const loadOrder = async () => {

        try {

            const response =
                await Service.getOrderDetails(props.id);

            setOrder(response.data);

        }
        catch (error) {

            console.error(error);

        }

    };


    // =========================================================
    // Download Invoice
    // =========================================================

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

                        message =
                            data.message;

                    }

                }
                catch {

                    // Keep default message

                }

            }


            toast.error(message);

        }
        finally {

            setDownloadingInvoice(false);

        }

    };


    if (!order) {

        return (

            <Box className="customer-order-loading">

                <CircularProgress size={30} />

            </Box>

        );

    }


    const isDelivered =
        order.orderStatus?.toLowerCase() ===
        "delivered";


    return (

        <Box className="customer-order-page">

            <Box className="customer-order-container">


                {/* =================================================
                    PAGE HEADER
                ================================================= */}

                <Box className="customer-order-page-header">

                    <Box>

                        <Typography className="page-title">

                            Order #{order.orderId}

                        </Typography>


                        <Typography className="page-subtitle">

                            Placed on{" "}

                            {dayjs(order.createdAt).format(
                                "dddd, DD MMMM YYYY"
                            )}

                        </Typography>

                    </Box>


                    {
                        isDelivered && (

                            <Button
                                className="customer-invoice-button"
                                variant="outlined"
                                startIcon={
                                    downloadingInvoice
                                        ? (
                                            <CircularProgress
                                                size={17}
                                            />
                                        )
                                        : (
                                            <DownloadIcon />
                                        )
                                }
                                disabled={
                                    downloadingInvoice
                                }
                                onClick={
                                    handleDownloadInvoice
                                }
                            >

                                {
                                    downloadingInvoice
                                        ? "Generating..."
                                        : "Download Invoice"
                                }

                            </Button>

                        )
                    }

                </Box>


                {/* =================================================
                    ORDER HEADER CARD
                ================================================= */}

                <Box className="customer-order-section">

                    <OrderHeaderCard
                        order={order}
                    />

                </Box>


                {/* =================================================
                    ORDERED ITEMS
                ================================================= */}

                <Box className="customer-order-section">

                    <OrderedItemsCard
                        items={order.items}
                    />

                </Box>


                {/* =================================================
                    ORDER TIMELINE
                ================================================= */}

                <Box className="customer-order-section">

                    <OrderTimeline
                        order={order}
                    />

                </Box>


                {/* =================================================
                    ADDRESS + PAYMENT
                ================================================= */}

                <Grid
                    container
                    spacing={2.5}
                    alignItems="stretch"
                >

                    <Grid
                        size={{
                            xs: 12,
                            md: 6
                        }}
                    >

                        <Box className="customer-order-grid-card">

                            <ShippingAddressCard
                                shipping={
                                    order.shippingAddress
                                }
                            />

                        </Box>

                    </Grid>


                    <Grid
                        size={{
                            xs: 12,
                            md: 6
                        }}
                    >

                        <Box className="customer-order-grid-card">

                            <PaymentDetailsCard
                                order={order}
                            />

                        </Box>

                    </Grid>

                </Grid>


                {/* =================================================
                    REVIEW
                ================================================= */}

                {
                    isDelivered && (

                        <Box className="customer-order-section">

                            <ReviewSection
                                items={order.items}
                            />

                        </Box>

                    )
                }


                {/* =================================================
                    SUPPORT
                ================================================= */}

                <Box className="customer-order-support">

                    <AccountSupportCard />

                </Box>


            </Box>

        </Box>

    );

}