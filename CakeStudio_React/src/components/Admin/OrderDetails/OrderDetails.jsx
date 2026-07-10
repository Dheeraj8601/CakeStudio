import {
    Box,
    Grid
} from "@mui/material";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import OrderHeader from "./OrderHeader";
import OrderSummaryCard from "./OrderSummaryCard";
import PaymentInformationCard from "./PaymentInformationCard";
import CustomerInformationCard from "./CustomerInformationCard";
import ShippingAddressCard from "./ShippingAddressCard";
import OrderedItemsTable from "./OrderedItemsTable";
import OrderTimeline from "./OrderTimeline";
import UpdateOrderStatus from "./UpdateOrderStatus";

import "./OrderDetails.css";
import OrderNotesCard from "./OrderNotesCard";
import Service from "../../../services/Service"

export default function OrderDetails(props) {

    const orderId = props.id

    const [order, setOrder] = useState(null);

    const loadOrder = async () => {

        try {

            const response =
                await Service.getOrderDetails(orderId);
            console.log("19-5 orderdata", response.data)
            setOrder(response.data);

        }
        catch (error) {

            console.error(error);

        }

    };

    useEffect(() => {

        loadOrder();

    }, [orderId]);

    if (!order) {

        return null;

    }

    return (

        <Box className="admin-order-details">

            <OrderHeader order={order} />

            <Grid

                container

                spacing={3}

            >

                <Grid size={{ xs: 12, md: 6 }}>

                    <OrderSummaryCard

                        order={order}

                    />

                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>

                    <PaymentInformationCard

                        order={order}

                    />

                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>

                    <CustomerInformationCard

                        order={order}

                    />

                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>

                    <ShippingAddressCard

                        order={order.shippingAddress}

                    />

                </Grid>

                <Grid size={12}>

                    <OrderedItemsTable

                        items={order.items}

                    />

                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>

                    <OrderTimeline

                        order={order}

                    />

                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>

                    <UpdateOrderStatus

                        order={order}
                        onReload={loadOrder}

                    />

                </Grid>

            </Grid>

        </Box>

    );

}