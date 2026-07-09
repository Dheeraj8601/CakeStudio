import {
    Box
} from "@mui/material";

import { useEffect, useState } from "react";

import OrdersList from "./OrdersList";

import "./Orders.css";

import Service from "../../../services/Service";

export default function Orders() {

    const [orders, setOrders] = useState([]);

    useEffect(() => {

        loadOrders();

    }, []);

    const loadOrders = async () => {

        try {

            const response =
                await Service.getMyOrders();
console.log(response,"response order")
            setOrders(response.data);

        }
        catch (error) {

            console.error(error);

        }

    };

    return (

        <OrdersList
            orders={orders}
            onReload={loadOrders}
        />

    );

}