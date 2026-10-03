import { Box, Grid } from "@mui/material";

import AuthBanner
    from "../common/Auth/AuthBanner/AuthBanner";

import AuthHeader
    from "../common/Auth/AuthHeader/AuthHeader";

import AuthDivider
    from "../common/Auth/AuthDivider/AuthDivider";

import SocialLogin
    from "../common/Auth/SocialLogin/SocialLogin";

import LoginForm
    from "../common/Auth/LoginForm/LoginForm";

import {
    AUTH_BANNER
} from "../../constants/authBanner";

import {
    AUTH_HEADER
} from "../../constants/authConstants";

import "./LoginPage.css";


export default function LoginComponent() {

    return (

        <Box className="login-page">

            <Grid
                container
                className="login-layout"
            >

                {/* =============================================
                    LEFT - BRAND / IMAGE
                ============================================== */}

                <Grid
                    size={{
                        xs: 12,
                        md: 5
                    }}
                    className="login-banner-column"
                >

                    <AuthBanner
                        banner={AUTH_BANNER.login}
                    />

                </Grid>


                {/* =============================================
                    RIGHT - LOGIN
                ============================================== */}

                <Grid
                    size={{
                        xs: 12,
                        md: 7
                    }}
                    className="login-form-column"
                >

                    <Box className="auth-form-container">

                        <Box className="auth-form-content">

                            <AuthHeader
                                title={
                                    AUTH_HEADER.login.title
                                }
                                subtitle={
                                    AUTH_HEADER.login.subtitle
                                }
                            />


                            <Box className="auth-social-section">

                                <AuthDivider
                                    text="Continue with"
                                />

                                <SocialLogin />

                            </Box>


                            <AuthDivider
                                text="Or continue with email"
                            />


                            <LoginForm />

                        </Box>

                    </Box>

                </Grid>

            </Grid>

        </Box>

    );

}