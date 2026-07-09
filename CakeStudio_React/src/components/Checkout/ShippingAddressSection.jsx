import SessionManage from "../../Session/SessionManage";
import AddressSelector from "./AddressSelector";


import ShippingForm from "./ShippingForm";

export default function ShippingAddressSection({

    addresses,

    selectedAddressId,

    setSelectedAddressId,

    shipping,

    setShipping,

    onReload

}) {

    if(!SessionManage.getTokenId()){

        return (

            <ShippingForm

                shipping={shipping}

                setShipping={setShipping}

            />

        );

    }

    return (

        <AddressSelector

            addresses={addresses}

            selectedAddressId={selectedAddressId}

            setSelectedAddressId={setSelectedAddressId}

            onReload={onReload}

        />

    );

}