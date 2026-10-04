import ProtectedAdminRoute from "./ProtectedAdminRoute"



import { Box } from "@mui/material";
import { useState } from "react";

import AdminHeader from "./AdminHeader/AdminHeader";
import AdminSidebar from "./AdminSidebar/AdminSidebar";
import AdminContent from "./AdminContent/AdminContent";
import AdminFooter from "./AdminFooter/AdminFooter";

import "./AdminLayout.css";

export default function AdminLayout() {

    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {

        setSidebarOpen(prev => !prev);

    };

    return (
        <>
            <ProtectedAdminRoute>
            <Box className="admin-layout">

                <AdminSidebar

                    open={sidebarOpen}

                />

                <Box className="admin-main">

                    <AdminHeader

                        onMenuClick={toggleSidebar}

                    />

                    <AdminContent />
                    <Box className = "admin-content">
                        <AdminFooter />
                    </Box>

                    

                </Box>

            </Box>
            </ProtectedAdminRoute>
        </>
    );

}