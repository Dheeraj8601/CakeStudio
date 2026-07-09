import {
    Button,
    TableCell,
    TableRow,
    Typography
} from "@mui/material";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import PaymentStatusChip from "./PaymentStatusChip";
import OrderStatusChip from "./OrderStatusChip";

import "./OrderRow.css";

export default function OrderRow({

    order

}) {
    console.log(order, "order 55")
    const navigate = useNavigate();

    return (

        <TableRow hover>

            <TableCell>

                <Typography className="order-id">

                    #{order.orderId}

                </Typography>

            </TableCell>

            <TableCell>

                {
                    dayjs(order.orderDate)
                        .format("DD MMM YYYY")
                }

            </TableCell>

            <TableCell>

                <Typography className="customer-name">

                    <Typography className="customer-name">
                        {order.customerName}
                    </Typography>

                    <Typography className="payment-method">
                        {order.paymentMethod}
                    </Typography>

                </Typography>

            </TableCell>

            <TableCell>

                <Typography className="order-amount">

                    ₹{order.totalAmount}

                </Typography>

            </TableCell>



            <TableCell>

                <PaymentStatusChip

                    status={order.paymentStatus}

                />

            </TableCell>

            <TableCell>

                <OrderStatusChip

                    status={order.orderStatus}

                />

            </TableCell>

            <TableCell>

                <Typography className="transaction-id">

                    {order.transactionId}

                </Typography>

            </TableCell>

            <TableCell align="center">

                <Button

                    variant="outlined"

                    startIcon={<VisibilityOutlinedIcon />}

                    className="view-order-btn"

                    onClick={() =>
                        navigate(`/admin/orders/${order.orderId}`)
                    }

                >

                    View

                </Button>

            </TableCell>

        </TableRow>

    );

}