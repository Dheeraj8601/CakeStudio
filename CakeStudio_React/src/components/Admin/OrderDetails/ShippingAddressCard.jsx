import {
    Card,
    CardContent,
    Divider,
    Grid,
    Typography
} from "@mui/material";

import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import LocationCityOutlinedIcon from "@mui/icons-material/LocationCityOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import MarkunreadMailboxOutlinedIcon from "@mui/icons-material/MarkunreadMailboxOutlined";

import "./ShippingAddressCard.css";

export default function ShippingAddressCard({ order }) {

    const details = [

        {
            label: "Address",
            value: order.addressLine1,
            icon: <LocationOnOutlinedIcon />
        },

        {
            label: "Landmark",
            value: order.addressLine2 || "-",
            icon: <ApartmentOutlinedIcon />
        },

        {
            label: "City",
            value: order.city,
            icon: <LocationCityOutlinedIcon />
        },

        {
            label: "State",
            value: order.state,
            icon: <PublicOutlinedIcon />
        },

        {
            label: "Pincode",
            value: order.postalCode,
            icon: <MarkunreadMailboxOutlinedIcon />
        }

    ];

    return (

        <Card className="shipping-card">

            <CardContent>

                <Typography className="shipping-title">

                    Shipping Address

                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>

                    {

                        details.map(item => (

                            <Grid

                                key={item.label}

                                size={12}

                            >

                                <div className="shipping-row">

                                    <div className="shipping-icon">

                                        {item.icon}

                                    </div>

                                    <div className="shipping-content">

                                        <Typography className="shipping-label">

                                            {item.label}

                                        </Typography>

                                        <Typography className="shipping-value">

                                            {item.value}

                                        </Typography>

                                    </div>

                                </div>

                            </Grid>

                        ))

                    }

                </Grid>

            </CardContent>

        </Card>

    );

}