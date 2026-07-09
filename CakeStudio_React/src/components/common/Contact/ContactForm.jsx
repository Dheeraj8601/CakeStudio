import { useState } from "react";
import { Box, Grid, Typography, MenuItem } from "@mui/material";

import CustomTextField from "../CustomFields/CustomTextField/CustomTextField";
import PrimaryButton from "../CustomFields/PrimaryButton/PrimaryButton";

import SendOutlinedIcon from "@mui/icons-material/SendOutlined";

import "./ContactForm.css";
import Service from "../../../services/Service";
import { toast } from "react-toastify";

const ContactForm = () => {

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
    });

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value
        }));

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await Service.sendContactMessage(form);

            toast.success("Message sent successfully.");

            setForm({
                fullName: "",
                email: "",
                phone: "",
                subject: "",
                message: ""
            });

        }
        catch (error) {

            console.error(error);

            toast.error("Unable to send message.");

        }

    };

    return (

        <Box className="contact-form">

            <Typography className="contact-form-title">

                Send Us a Message

            </Typography>

            <Typography className="contact-form-subtitle">

                Fill out the form below and we'll get back to you as soon as possible.

            </Typography>

            <Box
                component="form"
                onSubmit={handleSubmit}
            >

                <Grid container spacing={2}>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <CustomTextField
                            label="Your Name"
                            placeholder="Enter your full name"
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <CustomTextField
                            label="Your Email"
                            placeholder="Enter your email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <CustomTextField
                            label="Phone Number"
                            placeholder="Enter your phone number"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <CustomTextField
                            select
                            label="Subject"
                            name="subject"
                            value={form.subject}
                            onChange={handleChange}
                        >

                            <MenuItem value="order">
                                Order Inquiry
                            </MenuItem>

                            <MenuItem value="custom">
                                Custom Cake
                            </MenuItem>

                            <MenuItem value="delivery">
                                Delivery Support
                            </MenuItem>

                            <MenuItem value="feedback">
                                Feedback
                            </MenuItem>

                            <MenuItem value="other">
                                Other
                            </MenuItem>

                        </CustomTextField>

                    </Grid>

                    <Grid size={12}>

                        <CustomTextField

                            //multiline

                            rows={5}

                            label="Message"

                            placeholder="Write your message here..."

                            name="message"

                            value={form.message}

                            onChange={handleChange}

                        />

                    </Grid>

                </Grid>

                <Box className="contact-form-button">

                    <PrimaryButton
                        type="submit"
                        startIcon={<SendOutlinedIcon />}
                    >

                        Send Message

                    </PrimaryButton>

                </Box>

            </Box>

        </Box>

    );

};

export default ContactForm;