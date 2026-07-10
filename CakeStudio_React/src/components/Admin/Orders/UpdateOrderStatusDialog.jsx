import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    TextField
} from "@mui/material";

import { useEffect, useState } from "react";

import { toast } from "react-toastify";

import Service from "../../../services/Service";

export default function UpdateOrderStatusDialog({

    open,

    onClose,

    order,

    onSuccess

}) {

    const [status, setStatus] = useState("");

    useEffect(() => {

        if (order) {

            setStatus(order.orderStatus);

        }

    }, [order]);

    const handleUpdate = async () => {

        try {

            await Service.updateOrderStatus(
                order.orderId,
                status
            );

            toast.success("Order status updated.");

            onSuccess?.();

            onClose();

        }
        catch {

            toast.error("Unable to update order status.");

        }

    };

    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="xs"
        >

            <DialogTitle>

                Update Order Status

            </DialogTitle>

            <DialogContent>

                <TextField

                    select

                    fullWidth

                    sx={{ mt: 1 }}

                    label="Status"

                    value={status}

                    onChange={(e) =>
                        setStatus(e.target.value)
                    }

                >

                    <MenuItem value="Placed">Placed</MenuItem>

                    <MenuItem value="Confirmed">Confirmed</MenuItem>

                    <MenuItem value="Processing">Processing</MenuItem>

                    <MenuItem value="Out for Delivery">

                        Out for Delivery

                    </MenuItem>

                    <MenuItem value="Delivered">

                        Delivered

                    </MenuItem>

                    <MenuItem value="Cancelled">

                        Cancelled

                    </MenuItem>

                </TextField>

            </DialogContent>

            <DialogActions>

                <Button onClick={onClose}>

                    Cancel

                </Button>

                <Button
                    variant="contained"
                    onClick={handleUpdate}
                >

                    Update

                </Button>

            </DialogActions>

        </Dialog>

    );

}