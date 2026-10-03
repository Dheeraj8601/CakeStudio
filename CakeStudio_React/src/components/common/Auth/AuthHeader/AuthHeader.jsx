import {
    Box,
    Typography
} from "@mui/material";

import FavoriteRoundedIcon
    from "@mui/icons-material/FavoriteRounded";

import "./AuthHeader.css";


const AuthHeader = ({
    title,
    subtitle
}) => {

    return (

        <Box className="auth-header">

            <Box className="auth-title-container">

                <Typography
                    component="h1"
                    className="auth-title"
                >

                    {title}

                </Typography>


                <FavoriteRoundedIcon
                    className="auth-title-icon"
                />

            </Box>


            <Typography className="auth-subtitle">

                {subtitle}

            </Typography>

        </Box>

    );

};


export default AuthHeader;