import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";

import OrderHeader from "./OrderHeader";
import OrderFilters from "./OrderFilters";
import OrdersTable from "./OrdersTable";
import EmptyOrders from "./EmptyOrders";

import "./Orders.css";
import Service from "../../../services/Service";

export default function Orders() {

    const [orders, setOrders] = useState([]);

    const [totalCount, setTotalCount] = useState(0);

    const [search, setSearch] = useState("");

    const [paymentStatus, setPaymentStatus] = useState("All");

    const [orderStatus, setOrderStatus] = useState("All");

    const [page, setPage] = useState(0);

    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {

        loadOrders();

    }, [page, rowsPerPage, search, paymentStatus, orderStatus]);

    const loadOrders = async () => {

        try {

            const response =
                await Service.getOrders({

                    search,

                    paymentStatus,

                    orderStatus,

                    pageNumber: page + 1,

                    pageSize: rowsPerPage

                });

            setOrders(response.data.data);

            setTotalCount(response.data.totalRecords);

        }
        catch (error) {

            console.error(error);

        }

    };

    return (

        <Box className="orders-page">

            <OrderHeader />

            <OrderFilters

                search={search}
                setSearch={setSearch}

                paymentStatus={paymentStatus}
                setPaymentStatus={setPaymentStatus}

                orderStatus={orderStatus}
                setOrderStatus={setOrderStatus}

            />



            {
                orders.length === 0
                    ? <EmptyOrders />
                    : <OrdersTable
                        orders={orders}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        totalCount={totalCount}
                        setPage={setPage}
                        setRowsPerPage={setRowsPerPage}
                    />
            }



        </Box>

    );

}