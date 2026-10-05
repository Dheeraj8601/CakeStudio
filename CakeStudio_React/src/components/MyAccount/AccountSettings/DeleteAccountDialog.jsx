import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography
} from "@mui/material";

import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

import { useEffect, useState } from "react";

export default function DeleteAccountDialog({

    open,

    onClose,

    onDelete

}) {

    const [confirmation, setConfirmation] = useState("");

    useEffect(() => {

        if (!open) {

            setConfirmation("");

        }

    }, [open]);

    const handleDelete = () => {


        onDelete?.();

        onClose();

    };

    return (

        <Dialog

            open={open}

            onClose={onClose}

            fullWidth

            maxWidth="sm"

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

                <WarningAmberOutlinedIcon />

                Delete Account

            </DialogTitle>

            <DialogContent dividers>

                <Alert

                    severity="error"

                    sx={{ mb: 3 }}

                >

                    This action is permanent and cannot be undone.

                </Alert>

                <Typography sx={{ mb: 2 }}>

                    Deleting your account will permanently remove:

                </Typography>

                <ul style={{ marginTop: 0, lineHeight: 2 }}>

                    <li>Your profile information</li>

                    <li>Your saved addresses</li>

                    <li>Your wishlist</li>

                    <li>Your order history</li>

                    <li>Your saved preferences</li>

                </ul>

                <Typography

                    sx={{

                        mt: 3,

                        mb: 1,

                        fontWeight: 600

                    }}

                >

                    Type <strong>DELETE</strong> to confirm

                </Typography>

                <TextField

                    fullWidth

                    placeholder="DELETE"

                    value={confirmation}

                    onChange={(e) =>

                        setConfirmation(e.target.value)

                    }

                />

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

                    disabled={confirmation !== "DELETE"}

                    onClick={handleDelete}

                >

                    Delete Account

                </Button>

            </DialogActions>

        </Dialog>

    );

}