import { Box } from "@mui/material";

import AddressCard from "./AddressCard";
import EmptyAddresses from "./EmptyAddresses";

export default function AddressList({ addresses, onAddAddress, onEdit, onDelete, onSetDefault }) {

    if (!addresses || addresses.length === 0) {

        return <EmptyAddresses onAddAddress={onAddAddress} />;

    }

    return (

        <Box>

            {

                addresses.map(address => (

                    <AddressCard

                        key={address.addressId}
                        onDelete={onDelete}
                        address={address}
                        onEdit={onEdit}
                        onSetDefault={onSetDefault}
                    />

                ))

            }

        </Box>

    );

}