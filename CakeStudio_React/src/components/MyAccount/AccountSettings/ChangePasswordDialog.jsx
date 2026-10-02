import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    InputAdornment,
    TextField,
    Typography
} from "@mui/material";

import {
    Visibility,
    VisibilityOff
} from "@mui/icons-material";

import { useEffect, useState } from "react";

import { toast } from "react-toastify";

import Service from "../../../services/Service";


const initialForm = {
    currentPassword: "",
    otp: "",
    newPassword: "",
    confirmPassword: ""
};


export default function ChangePasswordDialog({

    open,

    onClose,

    onPasswordChanged

}) {

    const [form, setForm] =
        useState(initialForm);

    const [step, setStep] =
        useState(1);

    const [loading, setLoading] =
        useState(false);

    const [show, setShow] =
        useState({
            current: false,
            new: false,
            confirm: false
        });


    // ==========================================
    // RESET DIALOG
    // ==========================================

    useEffect(() => {

        if (open) {

            setForm(initialForm);

            setStep(1);

            setLoading(false);

            setShow({
                current: false,
                new: false,
                confirm: false
            });

        }

    }, [open]);


    // ==========================================
    // INPUT CHANGE
    // ==========================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        // OTP - ONLY NUMBERS, MAX 6 DIGITS
        if (name === "otp") {

            const numericValue =
                value
                    .replace(/\D/g, "")
                    .slice(0, 6);

            setForm(prev => ({
                ...prev,
                otp: numericValue
            }));

            return;
        }


        setForm(prev => ({
            ...prev,
            [name]: value
        }));

    };


    // ==========================================
    // STEP 1 - SEND OTP
    // ==========================================

    const handleSendOtp = async () => {

        if (!form.currentPassword) {

            toast.error(
                "Current password is required."
            );

            return;
        }


        try {

            setLoading(true);


            const response =
                await Service
                    .sendChangePasswordOtp(
                        form.currentPassword
                    );


            toast.success(
                response.data?.message ||
                "OTP sent to your registered email."
            );


            setStep(2);

        }
        catch (error) {

            console.error(
                "Send OTP failed:",
                error
            );


            toast.error(
                error.response?.data?.message ||
                error.response?.data?.Message ||
                "Unable to send OTP."
            );

        }
        finally {

            setLoading(false);

        }

    };


    // ==========================================
    // RESEND OTP
    // ==========================================

    const handleResendOtp = async () => {

        if (!form.currentPassword) {

            toast.error(
                "Current password is required."
            );

            setStep(1);

            return;
        }


        try {

            setLoading(true);


            const response =
                await Service
                    .sendChangePasswordOtp(
                        form.currentPassword
                    );


            setForm(prev => ({
                ...prev,
                otp: ""
            }));


            toast.success(
                response.data?.message ||
                "A new OTP has been sent."
            );

        }
        catch (error) {

            console.error(
                "Resend OTP failed:",
                error
            );


            toast.error(
                error.response?.data?.message ||
                error.response?.data?.Message ||
                "Unable to resend OTP."
            );

        }
        finally {

            setLoading(false);

        }

    };


    // ==========================================
    // STEP 2 - CHANGE PASSWORD
    // ==========================================

    const handleChangePassword = async () => {

        if (!form.otp) {

            toast.error(
                "OTP is required."
            );

            return;
        }


        if (form.otp.length !== 6) {

            toast.error(
                "Enter the 6-digit OTP."
            );

            return;
        }


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


        if (
            form.newPassword !==
            form.confirmPassword
        ) {

            toast.error(
                "Passwords do not match."
            );

            return;
        }


        const request = {

            otp:
                form.otp,

            newPassword:
                form.newPassword,

            confirmPassword:
                form.confirmPassword

        };


        try {

            setLoading(true);


            const response =
                await Service.changePassword(
                    request
                );


            toast.success(
                response.data?.message ||
                "Password changed successfully."
            );


            onPasswordChanged?.();

        }
        catch (error) {

            console.error(
                "Change password failed:",
                error
            );


            toast.error(
                error.response?.data?.message ||
                error.response?.data?.Message ||
                "Unable to change password."
            );

        }
        finally {

            setLoading(false);

        }

    };


    return (

        <Dialog
            open={open}
            onClose={
                loading
                    ? undefined
                    : onClose
            }
            fullWidth
            maxWidth="sm"
        >

            <DialogTitle>

                Change Password

            </DialogTitle>


            <DialogContent dividers>

                {/* ==================================
                    STEP 1
                ================================== */}

                {
                    step === 1 && (

                        <>

                            <Alert
                                severity="info"
                                sx={{ mb: 3 }}
                            >

                                Enter your current password.
                                We will send a 6-digit
                                verification code to your
                                registered email address.

                            </Alert>


                            <TextField

                                fullWidth

                                type={
                                    show.current
                                        ? "text"
                                        : "password"
                                }

                                label="Current Password"

                                name="currentPassword"

                                value={
                                    form.currentPassword
                                }

                                onChange={
                                    handleChange
                                }

                                disabled={
                                    loading
                                }

                                autoComplete="current-password"

                                InputProps={{

                                    endAdornment:

                                        <InputAdornment position="end">

                                            <IconButton

                                                disabled={
                                                    loading
                                                }

                                                onClick={() =>

                                                    setShow(prev => ({

                                                        ...prev,

                                                        current:
                                                            !prev.current

                                                    }))

                                                }

                                            >

                                                {
                                                    show.current
                                                        ?
                                                        <VisibilityOff />
                                                        :
                                                        <Visibility />
                                                }

                                            </IconButton>

                                        </InputAdornment>

                                }}

                            />

                        </>

                    )
                }


                {/* ==================================
                    STEP 2
                ================================== */}

                {
                    step === 2 && (

                        <>

                            <Alert
                                severity="success"
                                sx={{ mb: 3 }}
                            >

                                A 6-digit verification code
                                has been sent to your
                                registered email address.

                                The code expires in
                                5 minutes.

                            </Alert>


                            <Grid
                                container
                                spacing={3}
                            >

                                {/* OTP */}

                                <Grid
                                    size={{ xs: 12 }}
                                >

                                    <TextField

                                        fullWidth

                                        label="Verification Code"

                                        name="otp"

                                        value={
                                            form.otp
                                        }

                                        onChange={
                                            handleChange
                                        }

                                        placeholder="Enter 6-digit OTP"

                                        disabled={
                                            loading
                                        }

                                        inputProps={{
                                            maxLength: 6,
                                            inputMode: "numeric"
                                        }}

                                    />

                                </Grid>


                                {/* NEW PASSWORD */}

                                <Grid
                                    size={{ xs: 12 }}
                                >

                                    <TextField

                                        fullWidth

                                        type={
                                            show.new
                                                ? "text"
                                                : "password"
                                        }

                                        label="New Password"

                                        name="newPassword"

                                        value={
                                            form.newPassword
                                        }

                                        onChange={
                                            handleChange
                                        }

                                        disabled={
                                            loading
                                        }

                                        autoComplete="new-password"

                                        InputProps={{

                                            endAdornment:

                                                <InputAdornment position="end">

                                                    <IconButton

                                                        disabled={
                                                            loading
                                                        }

                                                        onClick={() =>

                                                            setShow(prev => ({

                                                                ...prev,

                                                                new:
                                                                    !prev.new

                                                            }))

                                                        }

                                                    >

                                                        {
                                                            show.new
                                                                ?
                                                                <VisibilityOff />
                                                                :
                                                                <Visibility />
                                                        }

                                                    </IconButton>

                                                </InputAdornment>

                                        }}

                                    />

                                </Grid>


                                {/* CONFIRM PASSWORD */}

                                <Grid
                                    size={{ xs: 12 }}
                                >

                                    <TextField

                                        fullWidth

                                        type={
                                            show.confirm
                                                ? "text"
                                                : "password"
                                        }

                                        label="Confirm Password"

                                        name="confirmPassword"

                                        value={
                                            form.confirmPassword
                                        }

                                        onChange={
                                            handleChange
                                        }

                                        disabled={
                                            loading
                                        }

                                        autoComplete="new-password"

                                        InputProps={{

                                            endAdornment:

                                                <InputAdornment position="end">

                                                    <IconButton

                                                        disabled={
                                                            loading
                                                        }

                                                        onClick={() =>

                                                            setShow(prev => ({

                                                                ...prev,

                                                                confirm:
                                                                    !prev.confirm

                                                            }))

                                                        }

                                                    >

                                                        {
                                                            show.confirm
                                                                ?
                                                                <VisibilityOff />
                                                                :
                                                                <Visibility />
                                                        }

                                                    </IconButton>

                                                </InputAdornment>

                                        }}

                                    />

                                </Grid>

                            </Grid>


                            {/* RESEND */}

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    mt: 2
                                }}
                            >

                                <Button
                                    size="small"
                                    disabled={loading}
                                    onClick={
                                        handleResendOtp
                                    }
                                >

                                    Resend OTP

                                </Button>

                            </Box>

                        </>

                    )
                }

            </DialogContent>


            <DialogActions
                sx={{ p: 2 }}
            >

                <Button
                    onClick={onClose}
                    disabled={loading}
                >

                    Cancel

                </Button>


                {
                    step === 1
                        ? (

                            <Button

                                variant="contained"

                                disabled={
                                    loading ||
                                    !form.currentPassword
                                }

                                onClick={
                                    handleSendOtp
                                }

                                sx={{
                                    background: "#ff5b84",

                                    "&:hover": {
                                        background: "#ec4f79"
                                    }
                                }}

                            >

                                {
                                    loading
                                        ? (
                                            <>
                                                <CircularProgress
                                                    size={18}
                                                    sx={{
                                                        mr: 1
                                                    }}
                                                />

                                                Sending...
                                            </>
                                        )
                                        : "Send OTP"
                                }

                            </Button>

                        )
                        : (

                            <Button

                                variant="contained"

                                disabled={
                                    loading
                                }

                                onClick={
                                    handleChangePassword
                                }

                                sx={{
                                    background: "#ff5b84",

                                    "&:hover": {
                                        background: "#ec4f79"
                                    }
                                }}

                            >

                                {
                                    loading
                                        ? (
                                            <>
                                                <CircularProgress
                                                    size={18}
                                                    sx={{
                                                        mr: 1
                                                    }}
                                                />

                                                Updating...
                                            </>
                                        )
                                        : "Update Password"
                                }

                            </Button>

                        )
                }

            </DialogActions>

        </Dialog>

    );

}