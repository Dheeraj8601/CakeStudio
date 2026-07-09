import { Box } from "@mui/material";

import OrderCard from "./OrderCard";
import EmptyOrders from "./EmptyOrders";

export default function OrdersList({

    orders,

    onReload

}) {

    if (!orders || orders.length === 0) {

        return <EmptyOrders />;

    }

    return (

        <Box>

            {

                orders.map(order => (

                    <OrderCard

                        key={order.orderId}

                        order={order}

                        onReload={onReload}

                    />

                ))

            }

        </Box>

    );

}