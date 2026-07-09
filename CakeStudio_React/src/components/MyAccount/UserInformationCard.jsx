import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    Typography
} from "@mui/material";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";

import "./UserInformationCard.css";
import { useNavigate } from "react-router-dom";

export default function UserInformationCard({ user }) {
const navigate = useNavigate()
    return (

        <Card className="user-info-card">

            <CardContent>

                <Box className="user-header">

                    <Box className="user-profile">

                        <Avatar className="user-avatar">

                            {user.fullName.charAt(0)}

                        </Avatar>

                        <Box>

                            <Typography className="user-name">

                                {user.fullName}

                            </Typography>

                            <Typography className="member-text">

                                CakeStudio Member

                            </Typography>

                        </Box>

                    </Box>

                    <Button
                        variant="outlined"
                        startIcon={<EditOutlinedIcon />}
                        className="edit-profile-btn"
                        onClick={() => navigate("/my-account/settings")}
                    >

                        Edit Profile

                    </Button>

                </Box>

                <Divider sx={{ my: 3 }} />

                <Grid container spacing={3}>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <Box className="info-box">

                            <PersonOutlineOutlinedIcon className="info-icon"/>

                            <Box>

                                <Typography className="info-label">

                                    Full Name

                                </Typography>

                                <Typography className="info-value">

                                    {user.fullName}

                                </Typography>

                            </Box>

                        </Box>

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <Box className="info-box">

                            <EmailOutlinedIcon className="info-icon"/>

                            <Box>

                                <Typography className="info-label">

                                    Email

                                </Typography>

                                <Typography className="info-value">

                                    {user.email}

                                </Typography>

                            </Box>

                            {

                                user.emailVerified &&

                                <Chip
                                    icon={<VerifiedRoundedIcon />}
                                    label="Verified"
                                    color="success"
                                    size="small"
                                />

                            }

                        </Box>

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <Box className="info-box">

                            <CallOutlinedIcon className="info-icon"/>

                            <Box>

                                <Typography className="info-label">

                                    Mobile

                                </Typography>

                                <Typography className="info-value">

                                    {user.mobile}

                                </Typography>

                            </Box>

                            {

                                user.mobileVerified &&

                                <Chip
                                    icon={<VerifiedRoundedIcon />}
                                    label="Verified"
                                    color="success"
                                    size="small"
                                />

                            }

                        </Box>

                    </Grid>

                </Grid>

            </CardContent>

        </Card>

    );

}