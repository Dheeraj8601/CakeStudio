import { useState } from "react";

import {
    Box,
    CircularProgress,
    Link,
    Paper,
    Typography
} from "@mui/material";

import {
    Link as RouterLink,
    useNavigate,
    useSearchParams
} from "react-router-dom";

import { toast } from "react-toastify";

import Service
    from "../../../../services/Service";

import SessionManage
    from "../../../../Session/SessionManage";

import CustomPasswordField
    from "../../CustomFields/CustomPasswordField/CustomPasswordField";

import PrimaryButton
    from "../../CustomFields/PrimaryButton/PrimaryButton";


const ResetPassword = () => {

    const navigate = useNavigate();

    const [searchParams] =
        useSearchParams();

    // ==========================================
    // GET TOKEN FROM EMAIL URL
    // ==========================================

    const token =
        searchParams.get("token");


    const [form, setForm] =
        useState({
            newPassword: "",
            confirmPassword: ""
        });

    const [loading, setLoading] =
        useState(false);

    const [success, setSuccess] =
        useState(false);


    // ==========================================
    // INPUT CHANGE
    // ==========================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };


    // ==========================================
    // RESET PASSWORD
    // ==========================================

    const handleResetPassword =
        async (e) => {

            e.preventDefault();


            // ==================================
            // TOKEN VALIDATION
            // ==================================

            if (!token) {

                toast.error(
                    "Invalid password reset link."
                );

                return;
            }


            // ==================================
            // PASSWORD VALIDATION
            // ==================================

            if (!form.newPassword) {

                toast.error(
                    "New password is required."
                );

                return;
            }


            if (form.newPassword.length < 8) {

                toast.error(
                    "Password must be at least 8 characters."
                );

                return;
            }


            if (!form.confirmPassword) {

                toast.error(
                    "Please confirm your password."
                );

                return;
            }


            if (
                form.newPassword !==
                form.confirmPassword
            ) {

                toast.error(
                    "Passwords do not match."
                );

                return;
            }


            try {

                setLoading(true);


                // ==================================
                // CALL BACKEND
                // ==================================

                await Service.resetPassword(
                    token,
                    form.newPassword,
                    form.confirmPassword
                );


                // ==================================
                // CLEAR OLD SESSION
                // ==================================

                SessionManage.clearSession();


                setSuccess(true);


                toast.success(
                    "Password reset successfully."
                );


                // ==================================
                // REDIRECT TO LOGIN
                // ==================================

                setTimeout(() => {

                    navigate(
                        "/login",
                        {
                            replace: true
                        }
                    );

                }, 2000);

            }
            catch (error) {

                console.error(
                    "Reset password failed:",
                    error
                );


                const message =
                    error.response?.data?.message ||
                    error.response?.data?.Message;


                if (
                    error.response?.status === 401
                ) {

                    toast.error(
                        message ||
                        "This password reset link is invalid or has expired."
                    );

                    return;
                }


                toast.error(
                    message ||
                    "Unable to reset password. Please try again."
                );

            }
            finally {

                setLoading(false);
            }
        };


    // ==========================================
    // INVALID URL
    // ==========================================

    if (!token) {

        return (

            <Box
                sx={{
                    minHeight: "70vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    px: 2
                }}
            >

                <Paper
                    elevation={2}
                    sx={{
                        width: "100%",
                        maxWidth: 450,
                        p: 4,
                        textAlign: "center",
                        borderRadius: 3
                    }}
                >

                    <Typography
                        variant="h5"
                        fontWeight={700}
                        gutterBottom
                    >

                        Invalid Reset Link

                    </Typography>


                    <Typography
                        color="text.secondary"
                        sx={{
                            mb: 3
                        }}
                    >

                        This password reset link is
                        invalid or incomplete.

                    </Typography>


                    <Link
                        component={RouterLink}
                        to="/forgot-password"
                        underline="hover"
                    >

                        Request a new reset link

                    </Link>

                </Paper>

            </Box>
        );
    }


    // ==========================================
    // UI
    // ==========================================

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

                {
                    !success
                        ? (
                            <>

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

                                        Reset Password

                                    </Typography>


                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >

                                        Enter your new password
                                        below.

                                    </Typography>

                                </Box>


                                {/* FORM */}

                                <form
                                    onSubmit={
                                        handleResetPassword
                                    }
                                >

                                    <CustomPasswordField

                                        label="New Password"

                                        placeholder="Enter new password"

                                        name="newPassword"

                                        value={
                                            form.newPassword
                                        }

                                        onChange={
                                            handleChange
                                        }

                                    />


                                    <CustomPasswordField

                                        label="Confirm Password"

                                        placeholder="Confirm new password"

                                        name="confirmPassword"

                                        value={
                                            form.confirmPassword
                                        }

                                        onChange={
                                            handleChange
                                        }

                                    />


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

                                                            Resetting...

                                                        </Box>
                                                    )
                                                    : "Reset Password"
                                            }

                                        </PrimaryButton>

                                    </Box>

                                </form>


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
                                    >

                                        Back to Login

                                    </Link>

                                </Box>

                            </>
                        )
                        : (
                            <Box
                                sx={{
                                    textAlign: "center"
                                }}
                            >

                                <Typography
                                    variant="h5"
                                    fontWeight={700}
                                    gutterBottom
                                >

                                    Password Changed Successfully

                                </Typography>


                                <Typography
                                    color="text.secondary"
                                >

                                    Your password has been
                                    updated successfully.

                                </Typography>


                                <Typography
                                    color="text.secondary"
                                    sx={{
                                        mt: 1
                                    }}
                                >

                                    Redirecting you to login...

                                </Typography>

                            </Box>
                        )
                }

            </Paper>

        </Box>
    );
};

export default ResetPassword;