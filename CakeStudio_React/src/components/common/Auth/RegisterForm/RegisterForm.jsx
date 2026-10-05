import { useState } from "react";
import {
    Box,
    Checkbox,
    FormControlLabel,
    Typography,
    Link
} from "@mui/material";

import CustomTextField from "../../CustomFields/CustomTextField/CustomTextField";
import CustomPasswordField from "../../CustomFields/CustomPasswordField/CustomPasswordField";
import PrimaryButton from "../../CustomFields/PrimaryButton/PrimaryButton";
import "./RegisterForm.css";
import Service from "../../../../services/Service";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RegisterForm = () => {
    const navigate = useNavigate()
    const initialValueForm = {
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeTerms: false
    }
    const [form, setForm] = useState(initialValueForm);

    const [errors, setErrors] = useState({
        confirmPassword: "",
    });

    const handleChange = (e) => {

        const { name, value, checked, type } = e.target;

        setForm({
            ...form,
            [name]: type === "checkbox"
                ? checked
                : value
        });
    };

    const handleRegister = async (e) => {

        e.preventDefault();

        const newErrors = {
            confirmPassword: "",
        };

        if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        }

        setErrors(newErrors);

        if (newErrors.confirmPassword) {
            return;
        }


        var fullname = splitName(form.fullName)
        const request = {
            FirstName: fullname.firstName,
            LastName: fullname.lastName,
            Email: form.email,
            Password: form.password
        }

        try {
            const res = await Service.register("Auth/register", request);


            if (res.data.success) {
                toast.success("Registration successful!");
                navigate('/login')
            }
        }
        catch (err) {

            if (err.response) {
                if (err.response.status === 400) {
                    //alert(err.response.data.message);
                    toast.info(err.response.data.message)
                    setForm(initialValueForm)
                }
                else {
                    toast.error("Something went wrong");
                }

            } else {
                toast.warning("Unable to connect to server");
            }

        }

    };

    function splitName(fullName) {
        const parts = fullName.trim().split(/\s+/);

        return {
            firstName: parts[0] || "",
            lastName: parts.length > 1 ? parts.slice(1).join(" ") : ""
        };
    }


    return (

        <form
            className="register-form"
            onSubmit={handleRegister}
        >

            <CustomTextField
                label="Full Name"
                placeholder="Enter your full name"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
            />

            <CustomTextField
                label="Email Address"
                placeholder="Enter your email"
                name="email"
                value={form.email}
                onChange={handleChange}
            />

            <CustomPasswordField
                label="Password"
                placeholder="Create a password"
                name="password"
                value={form.password}
                onChange={handleChange}
            />

            <CustomPasswordField
                label="Confirm Password"
                placeholder="Confirm your password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
            />

            <Box className="register-options">

                <FormControlLabel
                    control={
                        <Checkbox
                            name="agreeTerms"
                            checked={form.agreeTerms}
                            onChange={handleChange}
                            size="small"
                        />
                    }
                    label={
                        <Typography fontSize={14}>
                            I agree to the{" "}
                            <Link href="/terms">
                                Terms of Use
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy">
                                Privacy Policy
                            </Link>
                        </Typography>
                    }
                />

            </Box>

            <PrimaryButton type="submit">
                Register
            </PrimaryButton>

            <Typography className="login-text">

                Already have an account?{" "}

                <Link
                    href="/login"
                    underline="hover"
                    className="login-link"
                >
                    Login here
                </Link>

            </Typography>

        </form>

    );

};

export default RegisterForm;