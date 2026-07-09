import {
    Box,
    Typography
} from "@mui/material";

import { useEffect, useState } from "react";

import ProfileInformationCard from "./ProfileInformationCard";
import PasswordSecurityCard from "./PasswordSecurityCard";
import EmailPreferencesCard from "./EmailPreferencesCard";
import DeleteAccountCard from "./DeleteAccountCard";

import "./AccountSettings.css";

import EditProfileDialog from "./EditProfileDialog";
import ChangePasswordDialog from "./ChangePasswordDialog";
import DeleteAccountDialog from "./DeleteAccountDialog";

import Service from "../../../services/Service";
import SessionManage from "../../../Session/SessionManage";
import { useNavigate } from "react-router-dom";

export default function AccountSettings() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);

    const [preferences, setPreferences] = useState({

        orderUpdates: true,

        promotions: true,

        newArrivals: true,

        newsletter: false

    });

    const [openEditDialog, setOpenEditDialog] = useState(false);

    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    useEffect(() => {

        loadProfile();

    }, []);

    const loadProfile = async () => {

        try {

            const response = await Service.getUserById(
                SessionManage.getUserId()
            );

            const user = response.data;
            console.log("user", user)
            setProfile({

                id: user.id,

                firstName: user.firstName,

                lastName: user.lastName,

                email: user.email,

                phoneNumber: user.phoneNumber,

                fullName: `${user.firstName} ${user.lastName}`

            });

        }
        catch (error) {

            console.error(error);

        }

    };

    const handleProfileUpdate = async (updatedProfile) => {

        try {

            await Service.updateUser({

                id: updatedProfile.id,

                firstName: updatedProfile.firstName,

                lastName: updatedProfile.lastName,

                email: updatedProfile.email,

                phoneNumber: updatedProfile.phoneNumber

            });

            await loadProfile();

            setOpenEditDialog(false);

        }
        catch (error) {

            console.error(error);

        }

    };

    const handlePasswordChange = async (data) => {

        try {

            const res = await Service.changePassword(data);

            if (res.status === 200) {

                SessionManage.clearSession();

                setOpenPasswordDialog(false);

                navigate("/login", {
                    replace: true
                });

            }

        }
        catch (error) {

            console.error(error);

        }

    };

    const handleDeleteAccount = async () => {

        try {

            await Service.deleteUser(
                SessionManage.getUserId()
            );

            SessionManage.clearSession();

            setOpenDeleteDialog(false);

            navigate("/login", {
                replace: true
            });

        }
        catch (error) {

            console.error(error);

        }

    };

    if (!profile) {

        return null;

    }

    return (

        <Box>

            <Typography className="settings-title">

                Account Settings

            </Typography>

            <Typography className="settings-subtitle">

                Manage your account preferences and security.

            </Typography>

            <ProfileInformationCard

                profile={profile}

                onEdit={() =>

                    setOpenEditDialog(true)

                }

            />

            <EditProfileDialog

                open={openEditDialog}

                onClose={() =>

                    setOpenEditDialog(false)

                }

                profile={profile}

                onSave={handleProfileUpdate}

            />

            <PasswordSecurityCard

                onChangePassword={() =>

                    setOpenPasswordDialog(true)

                }

                onEnable2FA={() =>

                    console.log("Enable 2FA")

                }

                onViewLoginActivity={() =>

                    console.log("Login Activity")

                }

            />

            <ChangePasswordDialog

                open={openPasswordDialog}

                onClose={() =>

                    setOpenPasswordDialog(false)

                }

                onSave={handlePasswordChange}

            />

            <EmailPreferencesCard

                preferences={preferences}

                setPreferences={setPreferences}

            />

            <DeleteAccountCard

                onDelete={() =>

                    setOpenDeleteDialog(true)

                }

            />

            <DeleteAccountDialog

                open={openDeleteDialog}

                onClose={() =>

                    setOpenDeleteDialog(false)

                }

                onDelete={handleDeleteAccount}

            />

        </Box>

    );

}