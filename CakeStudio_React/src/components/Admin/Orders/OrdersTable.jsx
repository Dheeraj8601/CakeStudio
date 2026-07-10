import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow
} from "@mui/material";

import OrderRow from "./OrderRow";

import "./OrdersTable.css";

export default function OrdersTable({

    orders,

    page,

    rowsPerPage,

    setPage,

    setRowsPerPage,
    onReload

}) {

    const handleChangePage = (event, newPage) => {

        setPage(newPage);

    };

    const handleChangeRowsPerPage = (event) => {

        setRowsPerPage(parseInt(event.target.value, 10));

        setPage(0);

    };

    return (

        <Paper className="orders-table-card">

            <TableContainer>

                <Table>

                    <TableHead>

                        <TableRow>

                            <TableCell>Order ID</TableCell>

                            <TableCell>Order Date</TableCell>

                            <TableCell>Customer</TableCell>

                            <TableCell>Amount</TableCell>

                            <TableCell>Payment</TableCell>

                            <TableCell>Order Status</TableCell>

                            <TableCell>Transaction ID</TableCell>

                            <TableCell align="center">

                                Action

                            </TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {

                            orders

                                .slice(

                                    page * rowsPerPage,

                                    page * rowsPerPage + rowsPerPage

                                )

                                .map(order => (

                                    <OrderRow

                                        key={order.id}

                                        order={order}
                                        onReload={onReload}

                                    />

                                ))

                        }

                    </TableBody>

                </Table>

            </TableContainer>

            <TablePagination

                component="div"

                count={orders.length}

                page={page}

                rowsPerPage={rowsPerPage}

                rowsPerPageOptions={[5,10,25]}

                onPageChange={handleChangePage}

                onRowsPerPageChange={handleChangeRowsPerPage}

            />

        </Paper>

    );

}