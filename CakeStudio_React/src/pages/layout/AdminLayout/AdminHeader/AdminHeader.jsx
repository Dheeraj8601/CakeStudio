import {
    AppBar,
    Avatar,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Typography
} from "@mui/material";

import MenuOutlinedIcon
    from "@mui/icons-material/MenuOutlined";

import NotificationsNoneOutlinedIcon
    from "@mui/icons-material/NotificationsNoneOutlined";

import KeyboardArrowDownOutlinedIcon
    from "@mui/icons-material/KeyboardArrowDownOutlined";

import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import "./AdminHeader.css";

import LogoutDialog
    from "../../../../components/Admin/common/LogoutDialog/LogoutDialog";

import SessionManage
    from "../../../../Session/SessionManage";

import Service
    from "../../../../services/Service";

import {
    useAuth
} from "../../../../context/AuthContext";


export default function AdminHeader({

    onMenuClick,

    pageTitle = "Dashboard"

}) {

    const navigate =
        useNavigate();


    const {
        user,
        clearUser
    } = useAuth();


    const [
        openLogout,
        setOpenLogout
    ] = useState(false);


    const [
        anchorEl,
        setAnchorEl
    ] = useState(null);


    const [
        admin,
        setAdmin
    ] = useState(null);


    const open =
        Boolean(anchorEl);


    // =========================================================
    // LOAD LOGGED-IN ADMIN PROFILE
    // =========================================================

    useEffect(() => {

        if (!user?.userId) {
            return;
        }


        loadAdmin();

    }, [user?.userId]);


    const loadAdmin = async () => {

        try {

            const response =
                await Service.getUserById(
                    user.userId
                );


            setAdmin(
                response.data
            );

        }
        catch (error) {

            console.error(
                "Unable to load admin profile:",
                error
            );

        }

    };


    // =========================================================
    // PROFILE MENU
    // =========================================================

    const handleOpen = (event) => {

        setAnchorEl(
            event.currentTarget
        );

    };


    const handleClose = () => {

        setAnchorEl(null);

    };


    // =========================================================
    // LOGOUT
    // =========================================================

    const handleLogout = async () => {
        try {

            // No refresh token is passed.
            // Browser sends refresh_token HttpOnly cookie.
            await Service.logout();

        }
        catch (error) {

            console.error(
                "Backend logout failed:",
                error
            );

        }
        finally {

            SessionManage.clearSession();


            // -------------------------------------------------
            // CLEAR REACT AUTH STATE
            // -------------------------------------------------

            clearUser();


            // -------------------------------------------------
            // CLOSE UI
            // -------------------------------------------------

            setAdmin(null);

            setOpenLogout(false);

            handleClose();


            // -------------------------------------------------
            // REDIRECT TO LOGIN
            // -------------------------------------------------

            navigate(
                "/login",
                {
                    replace: true
                }
            );

        }

    };


    // =========================================================
    // DISPLAY VALUES
    // =========================================================

    const fullName =
        admin
            ? `${admin.firstName ?? ""} ${admin.lastName ?? ""}`.trim()
            : "";


    const displayName =
        fullName ||
        user?.name ||
        "Admin";


    const email =
        admin?.email ||
        user?.email ||
        "";


    const avatarLetter =
        admin?.firstName
            ?.charAt(0)
            ?.toUpperCase()
        ||
        user?.name
            ?.charAt(0)
            ?.toUpperCase()
        ||
        "A";


    // =========================================================
    // UI
    // =========================================================

    return (

        <AppBar

            position="sticky"

            elevation={0}

            className="admin-header"

        >

            <Toolbar>

                {/* ========================================= */}
                {/* MENU BUTTON */}
                {/* ========================================= */}

                <IconButton
                    onClick={
                        onMenuClick
                    }
                >

                    <MenuOutlinedIcon />

                </IconButton>


                {/* ========================================= */}
                {/* PAGE TITLE */}
                {/* ========================================= */}

                <Typography
                    className="admin-page-title"
                >

                    {pageTitle}

                </Typography>


                <Box
                    sx={{
                        flexGrow: 1
                    }}
                />


                {/* ========================================= */}
                {/* NOTIFICATION */}
                {/* ========================================= */}

                <IconButton>

                    <NotificationsNoneOutlinedIcon />

                </IconButton>


                {/* ========================================= */}
                {/* ADMIN PROFILE */}
                {/* ========================================= */}

                <Box

                    className="admin-profile"

                    onClick={
                        handleOpen
                    }

                >

                    <Avatar
                        className="admin-avatar"
                    >

                        {avatarLetter}

                    </Avatar>


                    <Box>

                        <Typography
                            className="admin-name"
                        >

                            {displayName}

                        </Typography>


                        <Typography
                            className="admin-email"
                        >

                            {email}

                        </Typography>

                    </Box>


                    <KeyboardArrowDownOutlinedIcon />

                </Box>


                {/* ========================================= */}
                {/* PROFILE MENU */}
                {/* ========================================= */}

                <Menu

                    anchorEl={
                        anchorEl
                    }

                    open={
                        open
                    }

                    onClose={
                        handleClose
                    }

                >

                    <MenuItem

                        onClick={() => {

                            handleClose();

                            navigate(
                                "/admin/profile"
                            );

                        }}

                    >

                        Profile

                    </MenuItem>


                    <MenuItem

                        onClick={() => {

                            handleClose();

                            setOpenLogout(
                                true
                            );

                        }}

                    >

                        Logout

                    </MenuItem>

                </Menu>

            </Toolbar>


            {/* ============================================= */}
            {/* LOGOUT CONFIRMATION */}
            {/* ============================================= */}

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

        </AppBar>

    );

}