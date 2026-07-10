import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Typography
} from "@mui/material";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";

import "./AddressCard.css";

export default function AddressCard({

    address,

    onEdit,

    onDelete,

    onSetDefault

}) {

    return (

        <Card className="address-card">

            <CardContent>

                <Box className="address-top">

                    <Typography
                        variant="h6"
                        fontWeight={600}
                    >

                        Delivery Address

                    </Typography>

                    {

                        address.isDefault &&

                        <Chip

                            label="Default Address"

                            sx={{
                                background: "#fff2f6",
                                color: "#ff5b84",
                                border: "1px solid #ffd5df",
                                fontWeight: 600
                            }}

                        />

                    }

                </Box>

                <Box className="address-info">

                    <Box className="address-user">

                        <Box>

                            <Typography className="customer-name">

                                {address.fullName}

                            </Typography>

                            <Typography className="customer-mobile">

                                {address.mobile}

                            </Typography>

                            {

                                address.email &&

                                <Typography className="customer-email">

                                    {address.email}

                                </Typography>

                            }

                        </Box>

                    </Box>

                    <Box className="address-row">

                        <LocationOnOutlinedIcon />

                        <Typography>

                            {address.addressLine1}

                            {

                                address.addressLine2 &&

                                `, ${address.addressLine2}`

                            }

                            {`, ${address.city}, ${address.state} - ${address.postalCode}, ${address.country}`}

                        </Typography>

                    </Box>

                </Box>

                <Box className="address-actions">

                    <Button

                        variant="outlined"

                        startIcon={<EditOutlinedIcon />}

                        onClick={() => onEdit(address)}

                    >

                        Edit

                    </Button>

                    <Button

                        variant="outlined"

                        color="error"

                        startIcon={<DeleteOutlineOutlinedIcon />}

                        onClick={() => onDelete(address)}

                    >

                        Delete

                    </Button>

                    {

                        !address.isDefault &&

                        <Button

                            variant="contained"

                            startIcon={<StarBorderRoundedIcon />}

                            onClick={() => onSetDefault(address.addressId)}

                            sx={{
                                background: "#ff5b84",
                                "&:hover": {
                                    background: "#e84b74"
                                }
                            }}

                        >

                            Set as Default

                        </Button>

                    }

                </Box>

            </CardContent>

        </Card>

    );

}