import DeliveryCard from "./DeliveryCard";
import OrderDetailsCard from "./OrderDetailsCard";
import PaymentCard from "./PaymentCard";
import SuccessHeader from "./SuccessHeader";
import useCart from "../../hooks/useCart"
import OrderSummaryCard from "./OrderSummaryCard";
import { Box } from "@mui/material"
import Breadcrumb from "../common/Breadcrumb/Breadcrumb"
import SuccessActions from "./SuccessActions";

import { useEffect, useState } from "react";

import Service from "../../services/Service";
import { useParams } from "react-router-dom";
//const order = {orderId: "ORD-1001",transactionId: "txn_3PH82JSH928",orderDate: "29 Jun 2026, 10:30 AM",estimatedDelivery: "30 Jun 2026, 4 PM - 6 PM",paymentMethod: "Credit Card",paymentStatus: "Paid"};

//const shipping = {fullName: "Dr Raj",mobile: "9876543210", email: "raj@gmail.com",address: "123 Sweet Street",landmark: "Near City Mall",city: "Bengaluru",state: "Karnataka",pincode: "560001"};


export default function OrderSuccessComponent() {

    const { orderId } = useParams();

    const [order, setOrder] = useState(null);

    useEffect(() => {

        loadOrder();

    }, []);

    const loadOrder = async () => {

        try {

            const response =
                await Service.getOrderDetails(orderId);

            setOrder(response.data);

        }
        catch (error) {

            console.error(error);

        }

    };

    if (!order) {

        return null;

    }

    return (

        <Box className="order-success-page">

            <Breadcrumb
                items={[
                    {
                        label: "Home",
                        path: "/"
                    },
                    {
                        label: "Order Success"
                    }
                ]}
            />

            <SuccessHeader />

            <OrderDetailsCard
                order={order}
                shipping={order.shippingAddress}
            />

            <OrderSummaryCard
                items={order.items}
            />

            <SuccessActions
                orderId={order.orderId}
            />

        </Box>

    );

}