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

import { useNavigate }
    from "react-router-dom";

import "./AdminHeader.css";

import LogoutDialog
    from "../../../../components/Admin/common/LogoutDialog/LogoutDialog";

import SessionManage
    from "../../../../Session/SessionManage";

import Service
    from "../../../../services/Service";

export default function AdminHeader({

    onMenuClick,

    pageTitle = "Dashboard"

}) {

    const navigate = useNavigate();

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

    // ==========================================
    // LOAD LOGGED-IN ADMIN
    // ==========================================

    useEffect(() => {

        loadAdmin();

    }, []);

    const loadAdmin = async () => {

        try {

            const userId =
                SessionManage.getUserId();

            if (!userId) {
                return;
            }

            const response =
                await Service.getUserById(
                    userId
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

    // ==========================================
    // PROFILE MENU
    // ==========================================

    const handleOpen = (event) => {

        setAnchorEl(
            event.currentTarget
        );
    };

    const handleClose = () => {

        setAnchorEl(null);
    };

    // ==========================================
    // LOGOUT
    // ==========================================

    const handleLogout = () => {

        SessionManage.clearSession();

        setOpenLogout(false);

        handleClose();

        navigate(
            "/login",
            {
                replace: true
            }
        );
    };

    // ==========================================
    // DISPLAY VALUES
    // ==========================================

    const fullName = admin
        ? `${admin.firstName ?? ""} ${admin.lastName ?? ""}`.trim()
        : "";

    const displayName =
        fullName || "Admin";

    const email =
        admin?.email || "";

    const avatarLetter =
        admin?.firstName
            ?.charAt(0)
            ?.toUpperCase()
        || "A";

    return (

        <AppBar

            position="sticky"

            elevation={0}

            className="admin-header"

        >

            <Toolbar>

                <IconButton
                    onClick={
                        onMenuClick
                    }
                >

                    <MenuOutlinedIcon />

                </IconButton>

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

                <IconButton>

                    <NotificationsNoneOutlinedIcon />

                </IconButton>

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