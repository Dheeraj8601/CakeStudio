import {
    Box,
    Typography
} from "@mui/material";

import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import ProfileInformationCard
    from "./ProfileInformationCard";

import PasswordSecurityCard
    from "./PasswordSecurityCard";

import EmailPreferencesCard
    from "./EmailPreferencesCard";

import DeleteAccountCard
    from "./DeleteAccountCard";

import EditProfileDialog
    from "./EditProfileDialog";

import ChangePasswordDialog
    from "./ChangePasswordDialog";

import DeleteAccountDialog
    from "./DeleteAccountDialog";

import Service
    from "../../../services/Service";

import {
    useAuth
} from "../../../context/AuthContext";

import "./AccountSettings.css";


export default function AccountSettings() {

    const navigate =
        useNavigate();


    const {
        user: authUser,
        loading: authLoading,
        clearUser
    } = useAuth();


    const [
        profile,
        setProfile
    ] = useState(null);


    const [
        preferences,
        setPreferences
    ] = useState({

        orderUpdates: true,

        promotions: true,

        newArrivals: true,

        newsletter: false

    });


    const [
        openEditDialog,
        setOpenEditDialog
    ] = useState(false);


    const [
        openPasswordDialog,
        setOpenPasswordDialog
    ] = useState(false);


    const [
        openDeleteDialog,
        setOpenDeleteDialog
    ] = useState(false);


    // =========================================================
    // LOAD PROFILE
    // =========================================================

    useEffect(() => {

        if (authLoading) {
            return;
        }


        if (!authUser?.userId) {
            return;
        }


        loadProfile(
            authUser.userId
        );

    }, [
        authLoading,
        authUser?.userId
    ]);


    // =========================================================
    // GET PROFILE
    // =========================================================

    const loadProfile =
        async (userId = authUser?.userId) => {

            if (!userId) {
                return;
            }


            try {

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
                        user.firstName,

                    lastName:
                        user.lastName,

                    email:
                        user.email,

                    phoneNumber:
                        user.phoneNumber,

                    fullName:
                        `${user.firstName ?? ""} ${user.lastName ?? ""}`
                            .trim()

                });

            }
            catch (error) {

                console.error(
                    "Unable to load profile:",
                    error
                );

            }

        };


    // =========================================================
    // UPDATE PROFILE
    // =========================================================

    const handleProfileUpdate =
        async (updatedProfile) => {

            try {

                await Service.updateUser({

                    id:
                        updatedProfile.id,

                    firstName:
                        updatedProfile.firstName,

                    lastName:
                        updatedProfile.lastName,

                    email:
                        updatedProfile.email,

                    phoneNumber:
                        updatedProfile.phoneNumber

                });


                await loadProfile();


                setOpenEditDialog(
                    false
                );

            }
            catch (error) {

                console.error(
                    "Unable to update profile:",
                    error
                );

            }

        };


    // =========================================================
    // DELETE ACCOUNT
    // =========================================================

    const handleDeleteAccount =
        async () => {

            if (!authUser?.userId) {
                return;
            }


            try {

                await Service.deleteUser(
                    authUser.userId
                );


                // Clear React authentication state.
                clearUser();


                setOpenDeleteDialog(
                    false
                );


                navigate(
                    "/login",
                    {
                        replace: true
                    }
                );

            }
            catch (error) {

                console.error(
                    "Unable to delete account:",
                    error
                );

            }

        };


    // =========================================================
    // PASSWORD CHANGED
    // =========================================================

    const handlePasswordChanged =
        () => {

            clearUser();


            setOpenPasswordDialog(
                false
            );


            navigate(
                "/login",
                {
                    replace: true
                }
            );

        };


    // =========================================================
    // WAIT FOR AUTH
    // =========================================================

    if (authLoading) {

        return null;

    }


    // =========================================================
    // WAIT FOR PROFILE
    // =========================================================

    if (!profile) {

        return null;

    }


    // =========================================================
    // UI
    // =========================================================

    return (

        <Box>

            <Typography className="settings-title">

                Account Settings

            </Typography>


            <Typography className="settings-subtitle">

                Manage your account preferences and security.

            </Typography>


            <ProfileInformationCard

                profile={
                    profile
                }

                onEdit={() =>
                    setOpenEditDialog(
                        true
                    )
                }

            />


            <EditProfileDialog

                open={
                    openEditDialog
                }

                onClose={() =>
                    setOpenEditDialog(
                        false
                    )
                }

                profile={
                    profile
                }

                onSave={
                    handleProfileUpdate
                }

            />


            <PasswordSecurityCard

                onChangePassword={() =>
                    setOpenPasswordDialog(
                        true
                    )
                }

                onEnable2FA={() =>
                    console.log(
                        "Enable 2FA"
                    )
                }

                onViewLoginActivity={() =>
                    console.log(
                        "Login Activity"
                    )
                }

            />


            <ChangePasswordDialog

                open={
                    openPasswordDialog
                }

                onClose={() =>
                    setOpenPasswordDialog(
                        false
                    )
                }

                onPasswordChanged={
                    handlePasswordChanged
                }

            />


            <EmailPreferencesCard

                preferences={
                    preferences
                }

                setPreferences={
                    setPreferences
                }

            />


            <DeleteAccountCard

                onDelete={() =>
                    setOpenDeleteDialog(
                        true
                    )
                }

            />


            <DeleteAccountDialog

                open={
                    openDeleteDialog
                }

                onClose={() =>
                    setOpenDeleteDialog(
                        false
                    )
                }

                onDelete={
                    handleDeleteAccount
                }

            />

        </Box>

    );

}