import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography
} from "@mui/material";

import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

import "./LogoutDialog.css";

export default function LogoutDialog({

    open,

    onClose,

    onConfirm

}) {

    return (

        <Dialog

            open={open}

            onClose={onClose}

            maxWidth="xs"

            fullWidth

        >

            <DialogTitle className="logout-title">

                Logout

            </DialogTitle>

            <DialogContent>

                <Typography className="logout-text">

                    Are you sure you want to logout from your account?

                </Typography>

            </DialogContent>

            <DialogActions>

                <Button

                    className="logout-cancel-btn"

                    onClick={onClose}

                >

                    Cancel

                </Button>

                <Button

                    variant="contained"

                    startIcon={<LogoutOutlinedIcon />}

                    className="logout-confirm-btn"

                    onClick={() => {
                        onConfirm?.();
                    }}

                >

                    Logout

                </Button>

            </DialogActions>

        </Dialog>

    );

}