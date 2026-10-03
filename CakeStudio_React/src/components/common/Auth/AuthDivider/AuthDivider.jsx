import {
    Box,
    Divider,
    Typography
} from "@mui/material";

import "./AuthDivider.css";


const AuthDivider = ({ text }) => {

    return (

        <Box className="auth-divider">

            <Divider className="auth-divider-line" />

            <Typography className="auth-divider-text">

                {text}

            </Typography>

            <Divider className="auth-divider-line" />

        </Box>

    );

};


export default AuthDivider;