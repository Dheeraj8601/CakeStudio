import AddressSelector
    from "./AddressSelector";

import ShippingForm
    from "./ShippingForm";

import {
    useAuth
} from "../../context/AuthContext";


export default function ShippingAddressSection({

    addresses,

    selectedAddressId,

    setSelectedAddressId,

    shipping,

    setShipping,

    onReload,

    errors = {}

}) {

    const {
        user,
        loading: authLoading
    } = useAuth();


    // =========================================================
    // WAIT FOR AUTH CHECK
    // =========================================================

    if (authLoading) {

        return null;

    }


    // =========================================================
    // GUEST CUSTOMER
    // =========================================================

    if (!user) {

        return (

            <ShippingForm
                shipping={shipping}
                setShipping={setShipping}
                errors={errors}
            />

        );

    }


    // =========================================================
    // LOGGED-IN CUSTOMER
    // =========================================================

    return (

        <AddressSelector

            addresses={addresses}

            selectedAddressId={
                selectedAddressId
            }

            setSelectedAddressId={
                setSelectedAddressId
            }

            onReload={
                onReload
            }

        />

    );

}