import {
    Box,
    Checkbox,
    FormControlLabel,
    Link,
    Typography
} from "@mui/material";

import {
    Link as RouterLink,
    useNavigate
} from "react-router-dom";

import {
    useState
} from "react";

import {
    toast
} from "react-toastify";

import SessionManage
    from "../../../../Session/SessionManage";

import CustomTextField
    from "../../CustomFields/CustomTextField/CustomTextField";

import CustomPasswordField
    from "../../CustomFields/CustomPasswordField/CustomPasswordField";

import PrimaryButton
    from "../../CustomFields/PrimaryButton/PrimaryButton";

import Service
    from "../../../../services/Service";

import "./LoginForm.css";


const LoginForm = () => {

    const navigate =
        useNavigate();


    const [form, setForm] =
        useState({

            email: "",

            password: ""

        });


    const [loading, setLoading] =
        useState(false);


    // =========================================================
    // INPUT CHANGE
    // =========================================================

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


    // =========================================================
    // LOGIN
    // =========================================================

    const handleLogin = async (e) => {

        e.preventDefault();


        if (!form.email.trim()) {

            toast.error(
                "Email is required."
            );

            return;

        }


        if (!form.password) {

            toast.error(
                "Password is required."
            );

            return;

        }


        const request = {

            Email:
                form.email.trim(),

            Password:
                form.password

        };


        try {

            setLoading(true);


            const response =
                await Service.login(
                    "Auth/login",
                    request
                );


            const data =
                response.data;


            if (!data?.accessToken) {

                toast.error(
                    "Invalid login response."
                );

                return;

            }


            // =============================================
            // STORE SESSION
            // =============================================

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
                "Login successful."
            );


            // =============================================
            // ROLE REDIRECT
            // =============================================

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
                "Login failed:",
                error
            );


            toast.error(

                error.response?.data?.message ||

                error.response?.data?.Message ||

                "Invalid email or password."

            );

        }
        finally {

            setLoading(false);

        }

    };


    return (

        <Box
            component="form"
            className="login-form"
            onSubmit={handleLogin}
            noValidate
        >

            {/* =============================================
                EMAIL
            ============================================== */}

            <Box className="login-field">

                <CustomTextField
                    label="Email Address"
                    placeholder="Enter your email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                />

            </Box>


            {/* =============================================
                PASSWORD
            ============================================== */}

            <Box className="login-field">

                <CustomPasswordField
                    label="Password"
                    placeholder="Enter your password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                />

            </Box>


            {/* =============================================
                LOGIN OPTIONS
            ============================================== */}

            <Box className="login-options">

                <FormControlLabel
                    className="remember-me"
                    control={

                        <Checkbox
                            name="rememberMe"
                            size="small"
                        />

                    }
                    label="Remember me"
                />


                <Link
                    component={RouterLink}
                    to="/forgot-password"
                    underline="none"
                    className="forgot-password-link"
                >

                    Forgot password?

                </Link>

            </Box>


            {/* =============================================
                LOGIN
            ============================================== */}

            <Box className="login-submit">

                <PrimaryButton
                    type="submit"
                    disabled={loading}
                >

                    {
                        loading
                            ? "Logging in..."
                            : "Login"
                    }

                </PrimaryButton>

            </Box>


            {/* =============================================
                REGISTER
            ============================================== */}

            <Typography className="register-text">

                Don't have an account?{" "}

                <Link
                    component={RouterLink}
                    to="/register"
                    underline="none"
                    className="register-link"
                >

                    Create account

                </Link>

            </Typography>

        </Box>

    );

};


export default LoginForm;