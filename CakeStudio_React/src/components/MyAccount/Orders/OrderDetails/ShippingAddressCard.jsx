import {
    Box,
    Card,
    CardContent,
    Divider,
    Typography
} from "@mui/material";

import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

import "./ShippingAddressCard.css";

export default function ShippingAddressCard({ shipping }) {

    if (!shipping) {

        return (

            <Card className="shipping-card">

                <CardContent>

                    <Typography>

                        Address not available.

                    </Typography>

                </CardContent>

            </Card>

        );

    }

    return (

        <Card className="shipping-card">

            <CardContent>

                <Box className="shipping-header">

                    <LocationOnOutlinedIcon />

                    <Typography className="shipping-title">

                        Delivery Address

                    </Typography>

                </Box>

                <Divider sx={{ mb: 3 }} />

                <Box className="address-box">

                    <Typography className="address-text">

                        {shipping.addressLine1}

                    </Typography>

                    {

                        shipping.addressLine2 &&

                        <Typography className="address-text">

                            {shipping.addressLine2}

                        </Typography>

                    }

                    <Typography className="address-text">

                        {shipping.city}, {shipping.state}

                    </Typography>

                    <Typography className="address-text">

                        {shipping.postalCode}

                    </Typography>

                    <Typography className="address-text">

                        {shipping.country}

                    </Typography>

                </Box>

            </CardContent>

        </Card>

    );

}