import {
    Box,
    Button,
    Typography
} from "@mui/material";

import AddLocationAltOutlinedIcon from "@mui/icons-material/AddLocationAltOutlined";

import { useEffect, useState } from "react";

import AddressList from "./AddressList";
import AddEditAddressDialog from "./AddEditAddressDialog";
import DeleteAddressDialog from "./DeleteAddressDialog";

import "./Addresses.css";

import Service from "../../../services/Service";

export default function Addresses() {

    const [addresses, setAddresses] = useState([]);

    const [openDialog, setOpenDialog] = useState(false);

    const [selectedAddress, setSelectedAddress] = useState(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    useEffect(() => {

        loadAddresses();

    }, []);

    const loadAddresses = async () => {

        try {

            const response = await Service.getMyAddresses();

            setAddresses(response.data);

        }
        catch (error) {

            console.error(error);

        }

    };

    const handleEdit = (address) => {

        setSelectedAddress(address);

        setOpenDialog(true);

    };

    const handleDeleteClick = (address) => {

        setSelectedAddress(address);

        setDeleteDialogOpen(true);

    };

    const handleSave = async (address) => {
        console.log(address, "address")
        try {

            if (address.addressId) {

                await Service.updateAddress(address);

            }
            else {

                await Service.createAddress(address);

            }

            setOpenDialog(false);

            setSelectedAddress(null);

            loadAddresses();

        }
        catch (error) {

            console.error(error);

        }

    };

    const handleDelete = async (id) => {

        try {

            await Service.deleteAddress(id);

            setDeleteDialogOpen(false);

            setSelectedAddress(null);

            loadAddresses();

        }
        catch (error) {

            console.error(error);

        }

    };

    const handleSetDefault = async (id) => {
        try {

            await Service.setDefaultAddress(id);

            loadAddresses();

        }
        catch (error) {

            console.error(error);

        }

    };

    return (

        <Box>

            <Box className="address-header">

                <Box>

                    <Typography className="address-title">

                        My Addresses

                    </Typography>

                    <Typography className="address-subtitle">

                        Manage your delivery addresses.

                    </Typography>

                </Box>

                <Button

                    variant="contained"

                    startIcon={<AddLocationAltOutlinedIcon />}

                    className="add-address-btn"

                    onClick={() => {

                        setSelectedAddress(null);

                        setOpenDialog(true);

                    }}

                >

                    Add New Address

                </Button>

            </Box>

            <AddressList

                addresses={addresses}

                onAddAddress={() => {

                    setSelectedAddress(null);

                    setOpenDialog(true);

                }}

                onEdit={handleEdit}

                onDelete={handleDeleteClick}

                onSetDefault={handleSetDefault}

            />

            <AddEditAddressDialog

                open={openDialog}

                address={selectedAddress}

                onClose={() => {

                    setOpenDialog(false);

                    setSelectedAddress(null);

                }}

                onSave={handleSave}

            />

            <DeleteAddressDialog

                open={deleteDialogOpen}

                address={selectedAddress}

                onClose={() => {

                    setDeleteDialogOpen(false);

                    setSelectedAddress(null);

                }}

                onDelete={() =>

                    handleDelete(selectedAddress.addressId)

                }

            />

        </Box>

    );

}