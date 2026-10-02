import {
    Box
} from "@mui/material";

import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    toast
} from "react-toastify";

import Service
    from "../../../../services/Service";

import SessionManage
    from "../../../../Session/SessionManage";

import "./SocialLogin.css";


const SocialLogin = () => {

    const navigate =
        useNavigate();

    const googleButtonRef =
        useRef(null);

    const [googleLoaded, setGoogleLoaded] =
        useState(false);


    // ==========================================
    // GOOGLE LOGIN SUCCESS
    // ==========================================

    const handleGoogleResponse =
        async (credentialResponse) => {

            if (!credentialResponse?.credential) {

                toast.error(
                    "Google login failed."
                );

                return;
            }


            try {

                const response =
                    await Service.googleLogin(
                        credentialResponse.credential
                    );


                const data =
                    response.data;


                if (
                    !data?.success ||
                    !data?.accessToken
                ) {

                    toast.error(
                        data?.message ||
                        "Google login failed."
                    );

                    return;
                }


                // ==================================
                // STORE CAKESTUDIO SESSION
                // ==================================

                await SessionManage.setTokenId(
                    data.accessToken
                );

                await SessionManage.setRefreshToken(
                    data.refreshToken
                );

                await SessionManage.setUserId(
                    data.userId
                );

                await SessionManage.setUserRole(
                    data.role
                );


                toast.success(
                    "Google login successful."
                );


                // ==================================
                // ROLE BASED REDIRECT
                // ==================================

                const role =
                    data.role
                        ?.trim()
                        ?.toLowerCase();


                if (role === "admin") {

                    navigate(
                        "/admin",
                        {
                            replace: true
                        }
                    );

                    return;
                }


                navigate(
                    "/",
                    {
                        replace: true
                    }
                );

            }
            catch (error) {

                console.error(
                    "Google login failed:",
                    error
                );


                toast.error(
                    error.response?.data?.message ||
                    error.response?.data?.Message ||
                    "Google login failed."
                );

            }
        };


    // ==========================================
    // INITIALIZE GOOGLE
    // ==========================================

    useEffect(() => {

        let attempts = 0;

        const initializeGoogle = () => {

            if (
                !window.google ||
                !googleButtonRef.current
            ) {

                attempts++;

                if (attempts < 50) {

                    setTimeout(
                        initializeGoogle,
                        100
                    );

                }

                return;
            }


            const clientId =
                window.appConfig
                    ?.GOOGLE_CLIENT_ID;


            if (!clientId) {

                console.error(
                    "GOOGLE_CLIENT_ID is missing from config.js"
                );

                return;
            }


            window.google.accounts.id.initialize({

                client_id:
                    clientId,

                callback:
                    handleGoogleResponse

            });


            googleButtonRef.current.innerHTML =
                "";


            window.google.accounts.id.renderButton(

                googleButtonRef.current,

                {
                    theme: "outline",

                    size: "large",

                    text: "continue_with",

                    shape: "rectangular",

                    width: 400
                }

            );


            setGoogleLoaded(true);
        };


        initializeGoogle();

    }, []);


    return (

        <Box
            className="social-login"
            sx={{
                width: "100%"
            }}
        >

            <Box
                ref={googleButtonRef}
                sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",

                    opacity:
                        googleLoaded
                            ? 1
                            : 0,

                    minHeight: "44px"
                }}
            />

        </Box>
    );
};


export default SocialLogin;