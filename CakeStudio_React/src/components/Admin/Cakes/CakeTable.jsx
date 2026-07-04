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

import CakeRow from "./CakeRow";
import EmptyCakes from "./EmptyCakes";

import "./CakeTable.css";

export default function CakeTable({

    cakes,

    totalRecords,

    page,

    rowsPerPage,

    setPage,

    setRowsPerPage,

    onDelete

}) {

    if (!cakes || cakes.length === 0) {

        return <EmptyCakes />;

    }

    const handlePageChange = (

        event,

        newPage

    ) => {

        setPage(newPage);

    };

    const handleRowsPerPageChange = (

        event

    ) => {

        setRowsPerPage(

            parseInt(event.target.value, 10)

        );

        setPage(0);

    };

    return (

        <Paper

            className="cake-table"

        >

            <TableContainer>

                <Table>

                    <TableHead>

                        <TableRow>

                            <TableCell>

                                Image

                            </TableCell>

                            <TableCell>

                                Name

                            </TableCell>

                            <TableCell>

                                Price

                            </TableCell>

                            <TableCell>

                                Category

                            </TableCell>

                            <TableCell align="center">

                                Edit

                            </TableCell>

                            <TableCell align="center">

                                Delete

                            </TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {

                            cakes.map(cake => (

                                <CakeRow

                                    key={cake.id}

                                    cake={cake}

                                    onDelete={onDelete}

                                />

                            ))

                        }

                    </TableBody>

                </Table>

            </TableContainer>

            <TablePagination

                component="div"

                count={totalRecords}

                page={page}

                rowsPerPage={rowsPerPage}

                rowsPerPageOptions={[

                    5,

                    10,

                    25,

                    50

                ]}

                onPageChange={handlePageChange}

                onRowsPerPageChange={

                    handleRowsPerPageChange

                }

            />

        </Paper>

    );

}