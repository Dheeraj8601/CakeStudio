import {
    Avatar,
    Card,
    CardContent,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Paper
} from "@mui/material";

import "./OrderedItemsTable.css";

export default function OrderedItemsTable({ items }) {

    return (

        <Card className="ordered-items-card">

            <CardContent>

                <Typography className="ordered-items-title">

                    Ordered Items

                </Typography>

                <Divider sx={{ mb: 3 }} />

                <TableContainer component={Paper} elevation={0}>

                    <Table>

                        <TableHead>

                            <TableRow>

                                <TableCell>Image</TableCell>

                                <TableCell>Cake</TableCell>

                                <TableCell align="center">

                                    Quantity

                                </TableCell>

                                <TableCell align="right">

                                    Price

                                </TableCell>

                                <TableCell align="right">

                                    Total

                                </TableCell>

                            </TableRow>

                        </TableHead>

                        <TableBody>

                            {

                                items.map(item => (

                                    <TableRow

                                        key={item.id}

                                        hover

                                    >

                                        <TableCell>

                                            <Avatar

                                                src={item.imageUrl}

                                                variant="rounded"

                                                className="ordered-item-image"

                                            />

                                        </TableCell>

                                        <TableCell>

                                            <Typography className="ordered-item-name">

                                                {item.cakeName}

                                            </Typography>

                                        </TableCell>

                                        <TableCell align="center">

                                            {item.quantity}

                                        </TableCell>

                                        <TableCell align="right">

                                            ₹{item.unitPrice}

                                        </TableCell>

                                        <TableCell align="right">

                                            <Typography className="ordered-item-total">

                                                ₹{item.unitPrice * item.quantity}

                                            </Typography>

                                        </TableCell>

                                    </TableRow>

                                ))

                            }

                        </TableBody>

                    </Table>

                </TableContainer>

            </CardContent>

        </Card>

    );

}