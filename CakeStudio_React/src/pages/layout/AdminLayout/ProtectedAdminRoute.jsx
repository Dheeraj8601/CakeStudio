import {
    Navigate
} from "react-router-dom";

import {
    Box,
    CircularProgress
} from "@mui/material";

import {
    useAuth
} from "../../../context/AuthContext";


export default function ProtectedAdminRoute({
    children
}) {

    const {user,loading} = useAuth();

    if (loading) {

        return (

            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >

                <CircularProgress
                    size={32}
                />

            </Box>

        );

    }


    if (!user) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    if (
        user.role
            ?.trim()
            ?.toLowerCase()
        !== "admin"
    ) {

        return (
            <Navigate
                to="/403"
                replace
            />
        );

    }


    return children;

}