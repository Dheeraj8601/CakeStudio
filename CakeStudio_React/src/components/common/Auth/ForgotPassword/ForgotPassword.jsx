import { useState } from "react";

import {
    Box,
    CircularProgress,
    Link,
    Paper,
    Typography
} from "@mui/material";

import {
    Link as RouterLink
} from "react-router-dom";

import {
    toast
} from "react-toastify";

import Service
    from "../../../../services/Service";

import CustomTextField
    from "../../CustomFields/CustomTextField/CustomTextField";

import PrimaryButton
    from "../../CustomFields/PrimaryButton/PrimaryButton";


const ForgotPassword = () => {

    const [email, setEmail] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [submitted, setSubmitted] =
        useState(false);


    // ==========================================
    // SUBMIT
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        const trimmedEmail =
            email.trim();

        if (!trimmedEmail) {

            toast.error(
                "Email is required."
            );

            return;
        }


        try {

            setLoading(true);

            await Service.forgotPassword(
                trimmedEmail
            );

            setSubmitted(true);

            toast.success(
                "If an account exists for this email, a reset link has been sent."
            );

        }
        catch (error) {

            console.error(
                "Forgot password failed:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                error.response?.data?.Message ||
                "Unable to process your request. Please try again."
            );

        }
        finally {

            setLoading(false);
        }
    };


    return (

        <Box
            sx={{
                minHeight: "70vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 2,
                py: 5
            }}
        >

            <Paper
                elevation={2}
                sx={{
                    width: "100%",
                    maxWidth: 450,
                    p: {
                        xs: 3,
                        sm: 4
                    },
                    borderRadius: 3
                }}
            >

                {/* TITLE */}

                <Box
                    sx={{
                        textAlign: "center",
                        mb: 4
                    }}
                >

                    <Typography
                        variant="h4"
                        fontWeight={700}
                        gutterBottom
                    >

                        Forgot Password?

                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >

                        Enter your email address and
                        we'll send you a link to reset
                        your password.

                    </Typography>

                </Box>


                {
                    !submitted
                        ? (

                            <form
                                onSubmit={
                                    handleSubmit
                                }
                            >

                                {/* EMAIL */}

                                <CustomTextField

                                    label="Email Address"

                                    placeholder="Enter your email"

                                    name="email"

                                    value={email}

                                    onChange={
                                        (e) =>
                                            setEmail(
                                                e.target.value
                                            )
                                    }

                                />


                                {/* BUTTON */}

                                <Box
                                    sx={{
                                        mt: 3
                                    }}
                                >

                                    <PrimaryButton
                                        type="submit"
                                        disabled={loading}
                                    >

                                        {
                                            loading
                                                ? (
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            gap: 1
                                                        }}
                                                    >

                                                        <CircularProgress
                                                            size={18}
                                                            color="inherit"
                                                        />

                                                        Sending...

                                                    </Box>
                                                )
                                                : "Send Reset Link"
                                        }

                                    </PrimaryButton>

                                </Box>

                            </form>

                        )
                        : (

                            <Box
                                sx={{
                                    backgroundColor:
                                        "#f1f8f4",

                                    border:
                                        "1px solid #c8e6c9",

                                    borderRadius: 2,

                                    p: 2.5,

                                    textAlign: "center"
                                }}
                            >

                                <Typography
                                    fontWeight={600}
                                    sx={{
                                        mb: 1
                                    }}
                                >

                                    Check your email

                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >

                                    If an account exists for

                                    <strong>
                                        {" "}
                                        {email}
                                    </strong>

                                    , we've sent a password
                                    reset link.

                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        mt: 1
                                    }}
                                >

                                    The link will expire
                                    in 30 minutes.

                                </Typography>

                            </Box>

                        )
                }


                {/* BACK TO LOGIN */}

                <Box
                    sx={{
                        textAlign: "center",
                        mt: 3
                    }}
                >

                    <Link
                        component={RouterLink}
                        to="/login"
                        underline="hover"
                        sx={{
                            fontWeight: 500
                        }}
                    >

                        Back to Login

                    </Link>

                </Box>

            </Paper>

        </Box>
    );
};

export default ForgotPassword;