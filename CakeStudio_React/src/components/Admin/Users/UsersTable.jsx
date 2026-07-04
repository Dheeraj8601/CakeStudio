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

import UserRow from "./UserRow";

import "./UsersTable.css";

export default function UsersTable({

    users,

    onDelete,

    onStatusChange

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

        <Paper className="users-table-card">

            <TableContainer>

                <Table>

                    <TableHead>

                        <TableRow>

                            <TableCell>

                                ID

                            </TableCell>

                            <TableCell>

                                Customer

                            </TableCell>

                            <TableCell>

                                Mobile

                            </TableCell>

                            <TableCell align="center">

                                Joined On

                            </TableCell>

                            <TableCell align="center">

                                Status

                            </TableCell>

                            <TableCell align="center">

                                Delete

                            </TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {

                            users

                                .slice(

                                    page * rowsPerPage,

                                    page * rowsPerPage + rowsPerPage

                                )

                                .map(user => (

                                    <UserRow

                                        key={user.id}

                                        user={user}

                                        onDelete={onDelete}

                                        onStatusChange={onStatusChange}

                                    />

                                ))

                        }

                    </TableBody>

                </Table>

            </TableContainer>

            <TablePagination

                component="div"

                count={users.length}

                page={page}

                rowsPerPage={rowsPerPage}

                rowsPerPageOptions={[5,10,25]}

                onPageChange={handleChangePage}

                onRowsPerPageChange={handleChangeRowsPerPage}

            />

        </Paper>

    );

}