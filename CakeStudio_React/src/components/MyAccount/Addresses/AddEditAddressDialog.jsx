import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from "@mui/material";

import { useEffect, useState } from "react";

import AddressForm from "./AddressForm";

const initialAddress = {

    addressLine1: "",

    addressLine2: "",

    city: "",

    state: "",

    postalCode: "",

    country: "India",

    isDefault: false

};

export default function AddEditAddressDialog({

    open,

    onClose,

    address,

    onSave

}) {

    const [formData, setFormData] = useState(initialAddress);

    useEffect(() => {

        if (address) {

            setFormData(address);

        }

        else {

            setFormData(initialAddress);

        }

    }, [address, open]);

    const handleSave = async () => {

        if (onSave) {

            await onSave(formData);

        }

    };

    return (

        <Dialog

            open={open}

            onClose={onClose}

            fullWidth

            maxWidth="md"

        >

            <DialogTitle>

                {

                    address

                        ? "Edit Address"

                        : "Add New Address"

                }

            </DialogTitle>

            <DialogContent dividers>

                <AddressForm

                    address={formData}

                    onChange={setFormData}

                />

            </DialogContent>

            <DialogActions sx={{ p: 2 }}>

                <Button

                    onClick={onClose}

                >

                    Cancel

                </Button>

                <Button

                    variant="contained"

                    onClick={handleSave}

                >

                    {

                        address

                            ? "Update Address"

                            : "Save Address"

                    }

                </Button>

            </DialogActions>

        </Dialog>

    );

}