import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    Grid,
    TextField,
    Typography
} from "@mui/material";

import {
    useEffect,
    useState
} from "react";

import { toast }
    from "react-toastify";

import "./AdminProfile.css";

import SessionManage
    from "../../../Session/SessionManage";

import Service
    from "../../../services/Service";

export default function AdminProfile() {

    const [
        profile,
        setProfile
    ] = useState({

        id: null,

        firstName: "",

        lastName: "",

        email: "",

        phoneNumber: "",

        role: ""

    });

    const [
        loading,
        setLoading
    ] = useState(true);

    // ==========================================
    // LOAD ADMIN PROFILE
    // ==========================================

    useEffect(() => {

        loadProfile();

    }, []);

    const loadProfile = async () => {

        try {

            setLoading(true);

            const userId =
                SessionManage.getUserId();

            if (!userId) {

                toast.error(
                    "Unable to identify logged-in user."
                );

                return;
            }

            const response =
                await Service.getUserById(
                    userId
                );

            const user =
                response.data;

            setProfile({

                id:
                    user.id,

                firstName:
                    user.firstName ?? "",

                lastName:
                    user.lastName ?? "",

                email:
                    user.email ?? "",

                phoneNumber:
                    user.phoneNumber ?? "",

                role:
                    user.role ?? ""

            });

        }
        catch (error) {

            console.error(
                "Unable to load profile:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Unable to load profile."
            );

        }
        finally {

            setLoading(false);
        }
    };

    // ==========================================
    // INPUT CHANGE
    // ==========================================

    const handleChange = (
        event
    ) => {

        const {
            name,
            value
        } = event.target;

        setProfile(
            previous => ({
                ...previous,

                [name]:
                    value
            })
        );
    };

    // ==========================================
    // SAVE PROFILE
    // ==========================================

    const handleSave = async () => {

        try {

            const data = {

                id:
                    profile.id,

                firstName:
                    profile.firstName,

                lastName:
                    profile.lastName,

                email:
                    profile.email,

                phoneNumber:
                    profile.phoneNumber

            };

            await Service.updateUser(
                data
            );

            toast.success(
                "Profile updated successfully."
            );

            await loadProfile();

        }
        catch (error) {

            console.error(
                "Unable to update profile:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Unable to update profile."
            );
        }
    };

    // ==========================================
    // DISPLAY VALUES
    // ==========================================

    const fullName =
        `${profile.firstName} ${profile.lastName}`
            .trim();

    const avatarLetter =
        profile.firstName
            ?.charAt(0)
            ?.toUpperCase()
        || "A";

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <Box
                sx={{
                    minHeight: "300px",

                    display: "flex",

                    justifyContent:
                        "center",

                    alignItems:
                        "center"
                }}
            >

                <CircularProgress />

            </Box>
        );
    }

    return (

        <Box
            className="admin-profile-page"
        >

            <Typography
                className="profile-title"
            >

                My Profile

            </Typography>

            <Typography
                className="profile-subtitle"
            >

                Manage your account information.

            </Typography>

            <Card
                className="profile-card"
            >

                <CardContent>

                    <Box
                        className="profile-header"
                    >

                        <Avatar
                            className="profile-avatar"
                        >

                            {avatarLetter}

                        </Avatar>

                        <Box>

                            <Typography
                                className="profile-name"
                            >

                                {fullName}

                            </Typography>

                            <Typography
                                className="profile-role"
                            >

                                {profile.role}

                            </Typography>

                        </Box>

                    </Box>

                    <Divider
                        sx={{
                            my: 4
                        }}
                    />

                    <Grid
                        container
                        spacing={3}
                    >

                        <Grid
                            size={{
                                xs: 12,
                                md: 6
                            }}
                        >

                            <TextField

                                fullWidth

                                label="First Name"

                                name="firstName"

                                value={
                                    profile.firstName
                                }

                                onChange={
                                    handleChange
                                }

                            />

                        </Grid>

                        <Grid
                            size={{
                                xs: 12,
                                md: 6
                            }}
                        >

                            <TextField

                                fullWidth

                                label="Last Name"

                                name="lastName"

                                value={
                                    profile.lastName
                                }

                                onChange={
                                    handleChange
                                }

                            />

                        </Grid>

                        <Grid
                            size={{
                                xs: 12,
                                md: 6
                            }}
                        >

                            <TextField

                                fullWidth

                                label="Email"

                                name="email"

                                value={
                                    profile.email
                                }

                                onChange={
                                    handleChange
                                }

                            />

                        </Grid>

                        <Grid
                            size={{
                                xs: 12,
                                md: 6
                            }}
                        >

                            <TextField

                                fullWidth

                                label="Phone"

                                name="phoneNumber"

                                value={
                                    profile.phoneNumber
                                }

                                onChange={
                                    handleChange
                                }

                            />

                        </Grid>

                        <Grid
                            size={{
                                xs: 12,
                                md: 6
                            }}
                        >

                            <TextField

                                fullWidth

                                label="Role"

                                value={
                                    profile.role
                                }

                                disabled

                            />

                        </Grid>

                    </Grid>

                    <Box
                        className="profile-actions"
                    >

                        <Button

                            variant="contained"

                            className="profile-save-btn"

                            onClick={
                                handleSave
                            }

                        >

                            Save Changes

                        </Button>

                    </Box>

                </CardContent>

            </Card>

        </Box>
    );
}