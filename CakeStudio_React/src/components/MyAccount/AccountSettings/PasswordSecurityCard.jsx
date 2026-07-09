import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Typography
} from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import PasswordOutlinedIcon from "@mui/icons-material/PasswordOutlined";

import "./PasswordSecurityCard.css";

export default function PasswordSecurityCard({

    onChangePassword,

    onEnable2FA,

    onViewLoginActivity

}) {

    return (

        <Card className="security-card">

            <CardContent>

                <Box className="security-header">

                    <Box className="security-title-wrapper">

                        <LockOutlinedIcon />

                        <Box>

                            <Typography className="security-title">

                                Password & Security

                            </Typography>

                            <Typography className="security-subtitle">

                                Keep your account secure

                            </Typography>

                        </Box>

                    </Box>

                    <Button

                        variant="outlined"

                        className="security-btn"

                        startIcon={<PasswordOutlinedIcon />}

                        onClick={onChangePassword}

                    >

                        Change Password

                    </Button>

                </Box>

                <Divider sx={{ my: 3 }} />

                <Box className="security-row">

                    <Typography className="security-label">

                        Password

                    </Typography>

                    <Box className="security-value-box">

                        <Typography className="security-value">

                            ••••••••••••

                        </Typography>

                        <Typography className="security-note">

                            Click "Change Password" to update your password.

                        </Typography>

                    </Box>

                </Box>

                <Divider />

                <Box className="security-row">

                    <Typography className="security-label">

                        Two-Factor Authentication

                    </Typography>

                    <Box className="security-action">

                        <Typography className="security-note">

                            Not Enabled

                        </Typography>

                        <Button

                            variant="outlined"

                            size="small"

                            className="security-small-btn"

                            startIcon={<KeyOutlinedIcon />}

                            onClick={onEnable2FA}

                        >

                            Enable

                        </Button>

                    </Box>

                </Box>

                <Divider />

                <Box className="security-row">

                    <Typography className="security-label">

                        Login Activity

                    </Typography>

                    <Box className="security-action">

                        <Typography className="security-note">

                            Manage your active sessions

                        </Typography>

                        <Button

                            variant="outlined"

                            size="small"

                            className="security-small-btn"

                            startIcon={<HistoryOutlinedIcon />}

                            onClick={onViewLoginActivity}

                        >

                            View

                        </Button>

                    </Box>

                </Box>

            </CardContent>

        </Card>

    );

}