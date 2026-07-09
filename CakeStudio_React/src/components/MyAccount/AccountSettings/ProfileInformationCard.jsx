import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Typography
} from "@mui/material";

import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import "./ProfileInformationCard.css";

export default function ProfileInformationCard({

    profile,

    onEdit

}) {

    return (

        <Card className="profile-card">

            <CardContent>

                <Box className="profile-header">

                    <Box className="profile-title-wrapper">

                        <PersonOutlineOutlinedIcon />

                        <Box>

                            <Typography className="profile-title">

                                Profile Information

                            </Typography>

                            <Typography className="profile-subtitle">

                                Update your personal information

                            </Typography>

                        </Box>

                    </Box>

                    <Button

                        variant="outlined"

                        startIcon={<EditOutlinedIcon />}

                        className="edit-profile-btn"

                        onClick={onEdit}

                    >

                        Edit

                    </Button>

                </Box>

                <Divider sx={{ my: 3 }} />

                <Box className="profile-row">

                    <Typography className="profile-label">

                        Full Name

                    </Typography>

                    <Typography className="profile-value">

                        {profile.fullName}

                    </Typography>

                </Box>

                <Divider />

                <Box className="profile-row">

                    <Typography className="profile-label">

                        Email Address

                    </Typography>

                    <Box className="profile-value-box">

                        <Typography className="profile-value">

                            {profile.email}

                        </Typography>

                        {

                            profile.emailVerified &&

                            <Chip

                                label="Verified"

                                size="small"

                                className="verified-chip"

                            />

                        }

                    </Box>

                </Box>

                <Divider />

                <Box className="profile-row">

                    <Typography className="profile-label">

                        Mobile Number

                    </Typography>

                    <Box className="profile-value-box">

                        <Typography className="profile-value">

                            {profile.phoneNumber}

                        </Typography>

                        {

                            profile.mobileVerified &&

                            <Chip

                                label="Verified"

                                size="small"

                                className="verified-chip"

                            />

                        }

                    </Box>

                </Box>

            </CardContent>

        </Card>

    );

}