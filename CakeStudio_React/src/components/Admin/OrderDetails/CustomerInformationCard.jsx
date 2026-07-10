import {
    Card,
    CardContent,
    Divider,
    Grid,
    Typography
} from "@mui/material";

import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";

import "./CustomerInformationCard.css";

export default function CustomerInformationCard({ order }) {

    const details = [

        {
            label: "Customer Name",
            value: order.customerName ?? '-',
            icon: <PersonOutlineOutlinedIcon />
        },

        {
            label: "Email Address",
            value: order.email?? '-',
            icon: <EmailOutlinedIcon />
        },

        {
            label: "Mobile Number",
            value: order.mobile ?? '-',
            icon: <PhoneOutlinedIcon />
        }

    ];

    return (

        <Card className="customer-card">

            <CardContent>

                <Typography className="customer-title">

                    Customer Information

                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>

                    {

                        details.map(item => (

                            <Grid

                                key={item.label}

                                size={12}

                            >

                                <div className="customer-row">

                                    <div className="customer-icon">

                                        {item.icon}

                                    </div>

                                    <div className="customer-content">

                                        <Typography className="customer-label">

                                            {item.label}

                                        </Typography>

                                        <Typography className="customer-value">

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