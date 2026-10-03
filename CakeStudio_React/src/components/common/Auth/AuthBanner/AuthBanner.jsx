import {
    Box,
    Typography
} from "@mui/material";

import FavoriteRoundedIcon
    from "@mui/icons-material/FavoriteRounded";

import "./AuthBanner.css";


const AuthBanner = ({ banner }) => {

    return (

        <Box className="auth-banner">

            {/* =============================================
                BACKGROUND IMAGE
            ============================================== */}

            <Box
                component="img"
                src={banner.src}
                alt="CakeStudio"
                className="auth-banner-image"
            />


            {/* =============================================
                MODERN GRADIENT
            ============================================== */}

            <Box className="auth-banner-gradient" />


            {/* =============================================
                BRAND - TOP LEFT
            ============================================== */}

            <Box className="auth-brand-badge">

                <Box className="auth-brand-mark">

                    <FavoriteRoundedIcon />

                </Box>


                <Typography
                    component="div"
                    className="auth-brand-name"
                >

                    <Box
                        component="span"
                        className="auth-brand-cake"
                    >
                        Cake
                    </Box>

                    <Box
                        component="span"
                        className="auth-brand-studio"
                    >
                        Studio
                    </Box>

                </Typography>

            </Box>


            {/* =============================================
                BOTTOM CONTENT
            ============================================== */}

            <Box className="auth-banner-content">

                <Box className="auth-banner-content-inner">

                    <Box className="auth-banner-small-label">

                        <FavoriteRoundedIcon />

                        <Typography>
                            Made with love
                        </Typography>

                    </Box>


                    <Typography
                        component="h2"
                        className="auth-banner-heading"
                    >

                        Every slice tells
                        <br />

                        <Box
                            component="span"
                            className="auth-banner-heading-accent"
                        >
                            a story.
                        </Box>

                    </Typography>


                    {banner.description && (

                        <Typography
                            className="auth-banner-description"
                        >

                            {banner.description}

                        </Typography>

                    )}


                    <Box className="auth-banner-footer">

                        <Box className="auth-banner-line" />

                        <Typography>
                            CakeStudio
                        </Typography>

                    </Box>

                </Box>

            </Box>

        </Box>

    );

};


export default AuthBanner;