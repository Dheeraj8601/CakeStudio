import {
    Checkbox,
    FormControlLabel,
    Grid,
    MenuItem,
    TextField
} from "@mui/material";

export default function AddressForm({

    address,

    onChange

}) {

    const handleChange = (e) => {

        const { name, value, checked, type } = e.target;

        onChange({

            ...address,

            [name]: type === "checkbox"
                ? checked
                : value

        });

    };

    return (

        <Grid
            container
            spacing={3}
        >

            <Grid size={{ xs: 12 }}>

                <TextField

                    fullWidth

                    multiline

                    rows={3}

                    label="Address Line 1"

                    name="addressLine1"

                    value={address.addressLine1}

                    onChange={handleChange}

                />

            </Grid>

            <Grid size={{ xs: 12 }}>

                <TextField

                    fullWidth

                    label="Address Line 2"

                    name="addressLine2"

                    value={address.addressLine2}

                    onChange={handleChange}

                />

            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>

                <TextField

                    fullWidth

                    label="City"

                    name="city"

                    value={address.city}

                    onChange={handleChange}

                />

            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>

                <TextField

                    select

                    fullWidth

                    label="State"

                    name="state"

                    value={address.state}

                    onChange={handleChange}

                >

                    <MenuItem value="Karnataka">
                        Karnataka
                    </MenuItem>

                    <MenuItem value="Tamil Nadu">
                        Tamil Nadu
                    </MenuItem>

                    <MenuItem value="Andhra Pradesh">
                        Andhra Pradesh
                    </MenuItem>

                    <MenuItem value="Telangana">
                        Telangana
                    </MenuItem>

                </TextField>

            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>

                <TextField

                    fullWidth

                    label="Postal Code"

                    name="postalCode"

                    value={address.postalCode}

                    onChange={handleChange}

                />

            </Grid>

            <Grid size={{ xs: 12 }}>

                <TextField

                    fullWidth

                    label="Country"

                    name="country"

                    value={address.country}

                    onChange={handleChange}

                />

            </Grid>

            <Grid size={{ xs: 12 }}>

                <FormControlLabel

                    control={

                        <Checkbox

                            name="isDefault"

                            checked={address.isDefault}

                            onChange={handleChange}

                        />

                    }

                    label="Set as Default Address"

                />

            </Grid>

        </Grid>

    );

}