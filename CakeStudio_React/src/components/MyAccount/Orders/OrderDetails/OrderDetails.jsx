import { useEffect, useState } from "react";
import Service from "../../../../services/Service";
import { Box, Typography, Grid } from "@mui/material";
import OrderHeaderCard from "./OrderHeaderCard";
import OrderedItemsCard from "./OrderedItemsCard";
import ShippingAddressCard from "./ShippingAddressCard"
import PaymentDetailsCard from "./PaymentDetailsCard"
import AccountSupportCard from "../../AccountSupportCard";
import dayjs from "dayjs";
import OrderTimeline from "../../../Admin/OrderDetails/OrderTimeline"
import ReviewSection from "./ReviewSection";
export default function OrderDetails(props) {

    const [order, setOrder] = useState(null);

    useEffect(() => {

        loadOrder();

    }, []);

    const loadOrder = async () => {

        try {

            const response =
                await Service.getOrderDetails(props.id);
console.log(response.data,"44")
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

        <Box>

            <Typography className="page-title">

                Order #{order.orderId}

            </Typography>

            <Typography className="page-subtitle">

                Placed on {dayjs(order.createdAt).format("dddd, DD MMMM YYYY")}

            </Typography>

            <OrderHeaderCard
                order={order}
            />

            <OrderedItemsCard
                items={order.items}
            />

            {/*

            <OrderTrackingCard
                tracking={tracking}
            />

            */}

            <OrderTimeline order={order} />

            <Grid
                container
                spacing={3}
                sx={{ mt: 1 }}
            >

                <Grid size={{ xs: 12, md: 6 }}>

                    <ShippingAddressCard
                        shipping={order.shippingAddress}
                    />

                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>

                    <PaymentDetailsCard
                        order={order}
                    />



                </Grid>

                {
                    order.orderStatus === "Delivered" &&

                    <Box mt={4}>

                        <ReviewSection
                            items={order.items}
                        />

                    </Box>
                }

            </Grid>

            <Box mt={4}>

                <AccountSupportCard />

            </Box>

        </Box>

    );

}