import {
    Box,
    Divider,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography
} from "@mui/material";

import DashboardOutlinedIcon
    from "@mui/icons-material/DashboardOutlined";

import CakeOutlinedIcon
    from "@mui/icons-material/CakeOutlined";

import ShoppingBagOutlinedIcon
    from "@mui/icons-material/ShoppingBagOutlined";

import CategoryOutlinedIcon
    from "@mui/icons-material/CategoryOutlined";

import PeopleOutlineOutlinedIcon
    from "@mui/icons-material/PeopleOutlineOutlined";

import ReviewsOutlinedIcon
    from "@mui/icons-material/ReviewsOutlined";

import LocalOfferOutlinedIcon
    from "@mui/icons-material/LocalOfferOutlined";

import SettingsOutlinedIcon
    from "@mui/icons-material/SettingsOutlined";

import LogoutOutlinedIcon
    from "@mui/icons-material/LogoutOutlined";

import {
    useLocation,
    useNavigate
} from "react-router-dom";

import {
    useState
} from "react";

import "./AdminSidebar.css";

import LogoutDialog
    from "../../../../components/Admin/common/LogoutDialog/LogoutDialog";

import Service
    from "../../../../services/Service";

import SessionManage
    from "../../../../Session/SessionManage";

import {
    useAuth
} from "../../../../context/AuthContext";


export default function AdminSidebar({

    open

}) {

    const navigate =
        useNavigate();


    const location =
        useLocation();


    const {
        clearUser
    } = useAuth();


    const [
        openLogout,
        setOpenLogout
    ] = useState(false);


    // =========================================================
    // MENU ITEMS
    // =========================================================

    const menuItems = [

        {
            label: "Dashboard",
            icon: <DashboardOutlinedIcon />,
            path: "/admin/dashboard"
        },

        {
            label: "Cakes",
            icon: <CakeOutlinedIcon />,
            path: "/admin/cakes"
        },

        {
            label: "Orders",
            icon: <ShoppingBagOutlinedIcon />,
            path: "/admin/orders"
        },

        {
            label: "Categories",
            icon: <CategoryOutlinedIcon />,
            path: "/admin/categories"
        },

        {
            label: "Users",
            icon: <PeopleOutlineOutlinedIcon />,
            path: "/admin/users"
        },

        {
            label: "Reviews",
            icon: <ReviewsOutlinedIcon />,
            path: "/admin/reviews"
        },

        {
            label: "Offers",
            icon: <LocalOfferOutlinedIcon />,
            path: "/admin/offers"
        },

        {
            label: "Settings",
            icon: <SettingsOutlinedIcon />,
            path: "/admin/settings"
        }

    ];


    // =========================================================
    // LOGOUT
    // =========================================================

    const handleLogout = async () => {

        try {

            // Browser automatically sends
            // refresh_token HttpOnly cookie.
            await Service.logout();

        }
        catch (error) {

            console.error(
                "Backend logout failed:",
                error
            );

        }
        finally {

            // ---------------------------------------------
            // TEMPORARY MIGRATION CLEANUP
            // ---------------------------------------------

            SessionManage.clearSession();


            // ---------------------------------------------
            // CLEAR AUTH CONTEXT
            // ---------------------------------------------

            clearUser();


            // ---------------------------------------------
            // CLOSE DIALOG
            // ---------------------------------------------

            setOpenLogout(false);


            // ---------------------------------------------
            // REDIRECT
            // ---------------------------------------------

            navigate(
                "/login",
                {
                    replace: true
                }
            );

        }

    };


    // =========================================================
    // UI
    // =========================================================

    return (

        <>

            <Box

                className={
                    `admin-sidebar ${
                        open
                            ? "expanded"
                            : "collapsed"
                    }`
                }

            >

                {/* ========================================= */}
                {/* LOGO */}
                {/* ========================================= */}

                <Box className="admin-logo">

                    {
                        open &&

                        <Box>

                            <Typography
                                className="logo-title"
                            >

                                CakeStudio

                            </Typography>

                            <Typography
                                className="logo-subtitle"
                            >

                                ADMIN PANEL

                            </Typography>

                        </Box>
                    }

                </Box>


                <Divider />


                {/* ========================================= */}
                {/* NAVIGATION */}
                {/* ========================================= */}

                <List>

                    {
                        menuItems.map(
                            item => (

                                <ListItemButton

                                    key={
                                        item.label
                                    }

                                    selected={
                                        location.pathname ===
                                        item.path
                                    }

                                    className="admin-menu-item"

                                    onClick={() =>
                                        navigate(
                                            item.path
                                        )
                                    }

                                >

                                    <ListItemIcon>

                                        {item.icon}

                                    </ListItemIcon>


                                    {
                                        open &&

                                        <ListItemText

                                            primary={
                                                item.label
                                            }

                                        />
                                    }

                                </ListItemButton>

                            )
                        )
                    }

                </List>


                <Divider />


                {/* ========================================= */}
                {/* LOGOUT */}
                {/* ========================================= */}

                <List>

                    <ListItemButton

                        className="admin-menu-item"

                        onClick={() =>
                            setOpenLogout(true)
                        }

                    >

                        <ListItemIcon>

                            <LogoutOutlinedIcon />

                        </ListItemIcon>


                        {
                            open &&

                            <ListItemText

                                primary="Logout"

                            />
                        }

                    </ListItemButton>

                </List>

            </Box>


            <LogoutDialog

                open={
                    openLogout
                }

                onClose={() =>
                    setOpenLogout(false)
                }

                onConfirm={
                    handleLogout
                }

            />

        </>

    );

}