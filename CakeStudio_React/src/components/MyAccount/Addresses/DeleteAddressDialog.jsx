import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography
} from "@mui/material";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

export default function DeleteAddressDialog({

    open,

    onClose,

    address,

    onDelete

}) {

    const handleDelete = () => {

        if (onDelete) {

            onDelete(address.addressId);

        }

        onClose();

    };

    return (

        <Dialog

            open={open}

            onClose={onClose}

            maxWidth="xs"

            fullWidth

        >

            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: "#d32f2f",
                    fontWeight: 700
                }}
            >

                <DeleteOutlineOutlinedIcon />

                Delete Address

            </DialogTitle>

            <DialogContent>

                <Typography
                    sx={{
                        mt: 1,
                        color: "#666",
                        lineHeight: 1.8
                    }}
                >

                    Are you sure you want to delete this address?

                </Typography>

                {

                    address &&

                    <Typography
                        sx={{
                            mt: 2,
                            p: 2,
                            bgcolor: "#fff8fa",
                            borderRadius: 2,
                            border: "1px solid #f5dce3"
                        }}
                    >

                        <strong>{address.fullName}</strong>

                        <br />

                        {address.address}

                        <br />

                        {address.city}, {address.state} - {address.pincode}

                    </Typography>

                }

                <Typography
                    sx={{
                        mt: 2,
                        color: "#d32f2f",
                        fontWeight: 500
                    }}
                >

                    This action cannot be undone.

                </Typography>

            </DialogContent>

            <DialogActions sx={{ p: 2 }}>

                <Button

                    onClick={onClose}

                >

                    Cancel

                </Button>

                <Button

                    variant="contained"

                    color="error"

                    onClick={handleDelete}

                >

                    Delete

                </Button>

            </DialogActions>

        </Dialog>

    );

}