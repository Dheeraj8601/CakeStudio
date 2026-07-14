import { AppBar, Box, Toolbar, Typography } from "@mui/material";

import Logo from "./Logo";
import SearchBar from "./SearchBar";
import HeaderActions from "./HeaderActions";

import "./Header.css";
import { LocalShippingOutlined } from "@mui/icons-material";

const Header = () => {

    return (

        <AppBar
            position="static"
            elevation={0}
            color="inherit"
            className="header"
        >

            <Toolbar className="header-toolbar">

                <Logo />

                {/* <SearchBar /> */}
                <Box className="header-promo">

                    <LocalShippingOutlined/>

                    <Typography>

                        Same Day Delivery •  Birthday Cakes | Anniversary Specials | Midnight Delivery Available

                    </Typography>

                </Box>

                <HeaderActions />

            </Toolbar>

        </AppBar>

    );

};

export default Header;