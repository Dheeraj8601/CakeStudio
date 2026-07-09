import {
    Box,
    Button,
    Card,
    CardContent,
    Radio,
    Typography
} from "@mui/material";

import AddLocationAltOutlinedIcon from "@mui/icons-material/AddLocationAltOutlined";

import { useState } from "react";

import AddressForm from "../MyAccount/Addresses/AddressForm";
import Service from "../../services/Service";

export default function AddressSelector({

    addresses,

    selectedAddressId,

    setSelectedAddressId,

    onReload

}) {

    const [showForm, setShowForm] = useState(false);

    const initialAddress = {

        addressLine1: "",

        addressLine2: "",

        city: "",

        state: "",

        postalCode: "",

        country: "India",

        isDefault: false

    };

    const [address, setAddress] =
        useState(initialAddress);

    const handleSave = async () => {

        try {

            await Service.createAddress(address);

            setAddress(initialAddress);

            setShowForm(false);

            await onReload();

        }
        catch (error) {

            console.error(error);

        }

    };

    return (

        <>

            <Typography
                variant="h6"
                fontWeight={700}
                sx={{ mb: 3 }}
            >

                Select Delivery Address

            </Typography>

            {

                addresses.map(item => (

                    <Card

                        key={item.addressId}

                        sx={{
                            mb: 2,
                            border:
                                selectedAddressId === item.addressId
                                    ? "2px solid #ff5b84"
                                    : "1px solid #e5e5e5",
                            cursor: "pointer"
                        }}

                        onClick={() =>
                            setSelectedAddressId(item.addressId)
                        }

                    >

                        <CardContent>

                            <Box
                                display="flex"
                                alignItems="flex-start"
                            >

                                <Radio

                                    checked={
                                        selectedAddressId ===
                                        item.addressId
                                    }

                                    onChange={() =>
                                        setSelectedAddressId(
                                            item.addressId
                                        )
                                    }

                                />

                                <Box>

                                    {

                                        item.isDefault &&

                                        <Typography
                                            sx={{
                                                color: "#ff5b84",
                                                fontWeight: 600
                                            }}
                                        >

                                            Default Address

                                        </Typography>

                                    }

                                    <Typography
                                        fontWeight={600}
                                    >

                                        {item.addressLine1}

                                    </Typography>

                                    {

                                        item.addressLine2 &&

                                        <Typography>

                                            {item.addressLine2}

                                        </Typography>

                                    }

                                    <Typography>

                                        {item.city},

                                        {" "}

                                        {item.state}

                                    </Typography>

                                    <Typography>

                                        {item.postalCode}

                                    </Typography>

                                    <Typography>

                                        {item.country}

                                    </Typography>

                                </Box>

                            </Box>

                        </CardContent>

                    </Card>

                ))

            }

            {

                !showForm &&

                <Button

                    variant="outlined"

                    startIcon={
                        <AddLocationAltOutlinedIcon />
                    }

                    sx={{ mt: 2 }}

                    onClick={() =>
                        setShowForm(true)
                    }

                >

                    Add New Address

                </Button>

            }

            {

                showForm &&

                <>

                    <Box sx={{ mt: 4 }}>

                        <AddressForm

                            address={address}

                            onChange={setAddress}

                        />

                    </Box>

                    <Box
                        display="flex"
                        gap={2}
                        mt={3}
                    >

                        <Button

                            variant="contained"

                            onClick={handleSave}

                        >

                            Save Address

                        </Button>

                        <Button

                            variant="outlined"

                            onClick={() => {

                                setShowForm(false);

                                setAddress(
                                    initialAddress
                                );

                            }}

                        >

                            Cancel

                        </Button>

                    </Box>

                </>

            }

        </>

    );

}