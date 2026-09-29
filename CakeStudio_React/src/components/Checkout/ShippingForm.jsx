import {
    Box,
    Card,
    CardContent,
    Checkbox,
    FormControlLabel,
    Grid,
    MenuItem,
    TextField,
    Typography
} from "@mui/material";

import LocalShippingOutlinedIcon
    from "@mui/icons-material/LocalShippingOutlined";

const ShippingForm = ({
    shipping,
    setShipping,
    errors = {}
}) => {

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setShipping(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    return (
        <Card
            sx={{
                borderRadius: 4,
                border: "1px solid #f4dbe2",
                boxShadow: "none"
            }}
        >
            <CardContent sx={{ p: 4 }}>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 3
                    }}
                >
                    <LocalShippingOutlinedIcon
                        sx={{ color: "#ff5b84" }}
                    />

                    <Typography
                        variant="h6"
                        fontWeight={700}
                    >
                        Shipping Details
                    </Typography>
                </Box>

                <Typography
                    sx={{
                        color: "#777",
                        mb: 4,
                        fontSize: 14
                    }}
                >
                    Please provide your delivery information.
                </Typography>

                <Grid container spacing={3}>

                    {/* Full Name */}

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Full Name"
                            name="fullName"
                            value={shipping.fullName}
                            onChange={handleChange}
                            required
                            error={!!errors.fullName}
                            helperText={errors.fullName}
                        />
                    </Grid>

                    {/* Mobile */}

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Mobile Number"
                            name="mobile"
                            value={shipping.mobile}
                            onChange={handleChange}
                            required
                            error={!!errors.mobile}
                            helperText={errors.mobile}
                        />
                    </Grid>

                    {/* Email */}

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            value={shipping.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email}
                        />
                    </Grid>

                    {/* Address */}

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Address"
                            name="address"
                            value={shipping.address}
                            onChange={handleChange}
                            required
                            error={!!errors.address}
                            helperText={errors.address}
                        />
                    </Grid>

                    {/* Landmark */}

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Landmark (Optional)"
                            name="landmark"
                            value={shipping.landmark}
                            onChange={handleChange}
                        />
                    </Grid>

                    {/* City */}

                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            fullWidth
                            label="City"
                            name="city"
                            value={shipping.city}
                            onChange={handleChange}
                            required
                            error={!!errors.city}
                            helperText={errors.city}
                        />
                    </Grid>

                    {/* State */}

                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            select
                            fullWidth
                            label="State"
                            name="state"
                            value={shipping.state}
                            onChange={handleChange}
                            required
                            error={!!errors.state}
                            helperText={errors.state}
                        >
                            <MenuItem value="KA">
                                Karnataka
                            </MenuItem>

                            <MenuItem value="AP">
                                Andhra Pradesh
                            </MenuItem>

                            <MenuItem value="TN">
                                Tamil Nadu
                            </MenuItem>

                            <MenuItem value="TS">
                                Telangana
                            </MenuItem>
                        </TextField>
                    </Grid>

                    {/* Pincode */}

                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            fullWidth
                            label="Pincode"
                            name="pincode"
                            value={shipping.pincode}
                            onChange={handleChange}
                            required
                            error={!!errors.pincode}
                            helperText={errors.pincode}
                        />
                    </Grid>

                    {/* Save Address */}

                    <Grid size={{ xs: 12 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="saveAddress"
                                    checked={shipping.saveAddress}
                                    onChange={handleChange}
                                    sx={{
                                        color: "#ff5b84",
                                        "&.Mui-checked": {
                                            color: "#ff5b84"
                                        }
                                    }}
                                />
                            }
                            label="Save this address for future orders"
                        />
                    </Grid>

                </Grid>

            </CardContent>
        </Card>
    );
};

export default ShippingForm;