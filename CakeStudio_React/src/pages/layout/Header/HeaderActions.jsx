import {
    Badge,
    Box,
    Button
} from "@mui/material";

import PersonOutlineOutlinedIcon
    from "@mui/icons-material/PersonOutlineOutlined";

import ShoppingCartOutlinedIcon
    from "@mui/icons-material/ShoppingCartOutlined";

import AccountCircleOutlinedIcon
    from "@mui/icons-material/AccountCircleOutlined";

import {
    useNavigate
} from "react-router-dom";

import useCart
    from "../../../hooks/useCart";

import {
    useAuth
} from "../../../context/AuthContext";

import "./HeaderActions.css";


const HeaderActions = () => {

    const {
        user,
        loading
    } = useAuth();


    const navigate =
        useNavigate();


    const {
        cartCount
    } = useCart();


    // Wait until /Auth/me finishes
    if (loading) {
        return null;
    }


    const isLoggedIn =
        !!user;


    return (

        <Box className="header-actions">

            {
                isLoggedIn
                    ? (
                        <Button
                            variant="outlined"
                            startIcon={
                                <AccountCircleOutlinedIcon />
                            }
                            className="login-btn"
                            onClick={() =>
                                navigate("/my-account")
                            }
                        >
                            My Account
                        </Button>
                    )
                    : (
                        <Button
                            variant="outlined"
                            startIcon={
                                <PersonOutlineOutlinedIcon />
                            }
                            className="login-btn"
                            onClick={() =>
                                navigate("/login")
                            }
                        >
                            Login
                        </Button>
                    )
            }


            <Button
                variant="contained"
                className="cart-btn"
                startIcon={
                    <Badge
                        badgeContent={cartCount}
                        color="error"
                    >
                        <ShoppingCartOutlinedIcon />
                    </Badge>
                }
                onClick={() =>
                    navigate("/cart")
                }
            >
                Cart
            </Button>

        </Box>

    );

};


export default HeaderActions;