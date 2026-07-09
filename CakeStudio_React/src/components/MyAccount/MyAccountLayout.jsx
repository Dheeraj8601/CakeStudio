import {
    Box,
    Grid,
    Typography
} from "@mui/material";

import Breadcrumb from "../common/Breadcrumb/Breadcrumb";

// import AccountSidebar from "./AccountSidebar";
// import AccountOverview from "./AccountOverview";

import "./MyAccount.css";
import AccountSidebar from "./AccountSidebar";
import AccountOverview from "./AccountOverview";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutDialog from "./LogOut/LogoutDialog";
import SessionManage from "../../Session/SessionManage";

export default function MyAccountLayout({ children }) {
    const [logoutOpen, setLogoutOpen] = useState(false);

    const navigate = useNavigate();
    return (

        <Box className="account-page">

            <Breadcrumb
                items={[
                    { label: "Home", path: "/" },
                    { label: "My Account" }
                ]}
            />

            <Typography className="account-title">

                My Account

            </Typography>

            <Typography className="account-subtitle">

                Manage your profile, orders and preferences

            </Typography>

            <Grid
                container
                spacing={4}
            >

                {/* Sidebar */}

                <Grid size={{ xs: 12, md: 3 }}>

                    <AccountSidebar onLogout={() => setLogoutOpen(true)} />

                </Grid>

                {/* Content */}

                <Grid size={{ xs: 12, md: 9 }}>

                    {children}

                </Grid>

            </Grid>
            <LogoutDialog

                open={logoutOpen}

                onClose={() => setLogoutOpen(false)}

                onLogout={() => {

                    localStorage.clear();
                    SessionManage.clearSession();
                    setLogoutOpen(false);

                    navigate("/login");

                }}

            />

        </Box>

    );

}