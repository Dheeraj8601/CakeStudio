import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField
} from "@mui/material";

import { useEffect, useState } from "react";

const initialProfile = {

    id: 0,

    firstName: "",

    lastName: "",

    email: "",

    phoneNumber: ""

};

export default function EditProfileDialog({

    open,

    onClose,

    profile,

    onSave

}) {

    const [formData, setFormData] = useState(initialProfile);

    useEffect(() => {

        if (profile) {

            setFormData(profile);

        }
        else {

            setFormData(initialProfile);

        }

    }, [profile, open]);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData(prev => ({

            ...prev,

            [name]: value

        }));

    };

    const handleSave = async () => {

        await onSave?.(formData);

    };

    return (

        <Dialog

            open={open}

            onClose={onClose}

            fullWidth

            maxWidth="sm"

        >

            <DialogTitle>

                Edit Profile

            </DialogTitle>

            <DialogContent dividers>

                <Grid
                    container
                    spacing={3}
                >

                    <Grid size={{ xs: 12, md: 6 }}>

                        <TextField

                            fullWidth

                            label="First Name"

                            name="firstName"

                            value={formData.firstName}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <TextField

                            fullWidth

                            label="Last Name"

                            name="lastName"

                            value={formData.lastName}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid size={{ xs: 12 }}>

                        <TextField

                            fullWidth

                            label="Email"

                            name="email"

                            value={formData.email}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid size={{ xs: 12 }}>

                        <TextField

                            fullWidth

                            label="Phone Number"

                            name="phoneNumber"

                            value={formData.phoneNumber}

                            onChange={handleChange}

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

                    onClick={handleSave}

                    sx={{
                        background: "#ff5b84",
                        "&:hover": {
                            background: "#ec4f79"
                        }
                    }}

                >

                    Save Changes

                </Button>

            </DialogActions>

        </Dialog>

    );

}