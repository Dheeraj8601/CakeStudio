import { Box } from "@mui/material";
import { useEffect, useState } from "react";

import UserHeader from "./UserHeader";
import UserFilters from "./UserFilters";
import UsersTable from "./UsersTable";
import EmptyUsers from "./EmptyUsers";
import DeleteUserDialog from "./DeleteUserDialog";

import "./Users.css";
import Service from "../../../services/Service";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");
    const [selectedUser, setSelectedUser] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    useEffect(() => {
        loadUsers();
    }, [search, status]);

    const loadUsers = async () => {
        try {
            const params = {
                page: 1,
                pageSize: 10,
                search: search,
                isActive: status
            };

            const response = await Service.getUsers(params);

            const data = response.data.data.map(item => ({
                id: item.id,
                fullName: `${item.firstName} ${item.lastName}`,
                email: item.email,
                mobile: item.phoneNumber,
                joinedOn: new Date(item.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }),
                status: item.isActive
            }));
            console.log(data, response.data.data)
            setUsers(data);
        }
        catch (error) {
            console.error(error);
        }
    };

    const handleStatusChange = async (userId) => {
        try {
            await Service.toggleUserStatus(userId);

            loadUsers();
        }
        catch (error) {
            console.error(error);
        }
    };

    const handleDelete = (user) => {

        setSelectedUser(user);

        setOpenDeleteDialog(true);

    };

    return (

        <Box className="users-page">

            <UserHeader />

            <UserFilters

                search={search}
                setSearch={setSearch}

                status={status}
                setStatus={setStatus}

            />

            {

                users.length === 0 ?

                    <EmptyUsers />

                    :

                    <UsersTable

                        users={users}

                        onDelete={handleDelete}

                        onStatusChange={handleStatusChange}

                    />

            }

            <DeleteUserDialog

                open={openDeleteDialog}

                user={selectedUser}

                onClose={() =>

                    setOpenDeleteDialog(false)

                }

                onConfirm={async () => {
                    try {
                        await Service.deleteUser(selectedUser.id);

                        setOpenDeleteDialog(false);

                        loadUsers();
                    }
                    catch (error) {
                        console.error(error);
                    }
                }}

            />

        </Box>

    );

}