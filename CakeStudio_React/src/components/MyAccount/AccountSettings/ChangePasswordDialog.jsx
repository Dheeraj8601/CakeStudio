import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    InputAdornment,
    TextField
} from "@mui/material";

import {
    Visibility,
    VisibilityOff
} from "@mui/icons-material";

import { useEffect, useState } from "react";

const initialPasswords = {

    currentPassword: "",

    newPassword: "",

    confirmPassword: ""

};

export default function ChangePasswordDialog({

    open,

    onClose,

    onSave

}) {

    const [passwords, setPasswords] = useState(initialPasswords);

    const [show, setShow] = useState({

        current: false,

        new: false,

        confirm: false

    });

    useEffect(() => {

        if (open) {

            setPasswords(initialPasswords);

            setShow({

                current: false,

                new: false,

                confirm: false

            });

        }

    }, [open]);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setPasswords(prev => ({

            ...prev,

            [name]: value

        }));

    };

    const handleSubmit = async () => {

        await onSave?.(passwords);

    };

    return (

        <Dialog

            open={open}

            onClose={onClose}

            fullWidth

            maxWidth="sm"

        >

            <DialogTitle>

                Change Password

            </DialogTitle>

            <DialogContent dividers>

                <Alert

                    severity="info"

                    sx={{ mb: 3 }}

                >

                    Your new password should be at least 8 characters long.

                </Alert>

                <Grid
                    container
                    spacing={3}
                >

                    <Grid size={{ xs: 12 }}>

                        <TextField

                            fullWidth

                            type={show.current ? "text" : "password"}

                            label="Current Password"

                            name="currentPassword"

                            value={passwords.currentPassword}

                            onChange={handleChange}

                            InputProps={{

                                endAdornment:

                                    <InputAdornment position="end">

                                        <IconButton

                                            onClick={() =>

                                                setShow(prev => ({

                                                    ...prev,

                                                    current: !prev.current

                                                }))

                                            }

                                        >

                                            {

                                                show.current

                                                    ?

                                                    <VisibilityOff />

                                                    :

                                                    <Visibility />

                                            }

                                        </IconButton>

                                    </InputAdornment>

                            }}

                        />

                    </Grid>

                    <Grid size={{ xs: 12 }}>

                        <TextField

                            fullWidth

                            type={show.new ? "text" : "password"}

                            label="New Password"

                            name="newPassword"

                            value={passwords.newPassword}

                            onChange={handleChange}

                            InputProps={{

                                endAdornment:

                                    <InputAdornment position="end">

                                        <IconButton

                                            onClick={() =>

                                                setShow(prev => ({

                                                    ...prev,

                                                    new: !prev.new

                                                }))

                                            }

                                        >

                                            {

                                                show.new

                                                    ?

                                                    <VisibilityOff />

                                                    :

                                                    <Visibility />

                                            }

                                        </IconButton>

                                    </InputAdornment>

                            }}

                        />

                    </Grid>

                    <Grid size={{ xs: 12 }}>

                        <TextField

                            fullWidth

                            type={show.confirm ? "text" : "password"}

                            label="Confirm Password"

                            name="confirmPassword"

                            value={passwords.confirmPassword}

                            onChange={handleChange}

                            InputProps={{

                                endAdornment:

                                    <InputAdornment position="end">

                                        <IconButton

                                            onClick={() =>

                                                setShow(prev => ({

                                                    ...prev,

                                                    confirm: !prev.confirm

                                                }))

                                            }

                                        >

                                            {

                                                show.confirm

                                                    ?

                                                    <VisibilityOff />

                                                    :

                                                    <Visibility />

                                            }

                                        </IconButton>

                                    </InputAdornment>

                            }}

                        />

                    </Grid>

                </Grid>

            </DialogContent>

            <DialogActions sx={{ p: 2 }}>

                <Button

                    onClick={onClose}

                >

                    Cancel

                </Button>

                <Button

                    variant="contained"

                    sx={{
                        background: "#ff5b84",
                        "&:hover": {
                            background: "#ec4f79"
                        }
                    }}

                    onClick={handleSubmit}

                >

                    Update Password

                </Button>

            </DialogActions>

        </Dialog>

    );

}