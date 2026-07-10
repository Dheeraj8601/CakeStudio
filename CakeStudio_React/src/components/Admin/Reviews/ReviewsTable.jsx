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

import { useState } from "react";

import ReviewRow from "./ReviewRow";

import "./ReviewsTable.css";

export default function ReviewsTable({

    reviews,

    onView,

    onReply

}) {

    const [page, setPage] = useState(0);

    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {

        setPage(newPage);

    };

    const handleChangeRowsPerPage = (event) => {

        setRowsPerPage(parseInt(event.target.value, 10));

        setPage(0);

    };

    return (

        <Paper className="reviews-table-card">

            <TableContainer>

                <Table>

                    <TableHead>

                        <TableRow>

                            <TableCell>

                                Customer

                            </TableCell>

                            {/* <TableCell align="center">

                                Type

                            </TableCell> */}

                            <TableCell align="center">

                                Order ID

                            </TableCell>

                            <TableCell align="center">

                                Rating

                            </TableCell>

                            <TableCell>

                                Message

                            </TableCell>

                            <TableCell align="center">

                                Status

                            </TableCell>

                            <TableCell align="center">

                                Date

                            </TableCell>

                            <TableCell align="center">

                                Actions

                            </TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {

                            reviews

                                .slice(

                                    page * rowsPerPage,

                                    page * rowsPerPage + rowsPerPage

                                )

                                .map(review => (

                                    <ReviewRow

                                        key={review.id}

                                        review={review}

                                        onView={onView}

                                        onReply={onReply}

                                    />

                                ))

                        }

                    </TableBody>

                </Table>

            </TableContainer>

            <TablePagination

                component="div"

                count={reviews.length}

                page={page}

                rowsPerPage={rowsPerPage}

                rowsPerPageOptions={[5,10,25]}

                onPageChange={handleChangePage}

                onRowsPerPageChange={handleChangeRowsPerPage}

            />

        </Paper>

    );

}