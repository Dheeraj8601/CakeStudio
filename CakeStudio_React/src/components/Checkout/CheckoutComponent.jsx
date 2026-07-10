import { Box, Grid } from "@mui/material";
import Breadcrumb from "../common/Breadcrumb/Breadcrumb"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import ShippingForm from "../common/Checkout/ShippingForm";
// import PaymentMethods from "../common/Checkout/PaymentMethods";
// import OrderSummary from "../common/Checkout/OrderSummary";

import "./checkout.css";
import { useState, useEffect } from "react";
import ShippingForm from "./ShippingForm";
import PaymentMethods from "./PaymentMethods";
import OrderSummary from "./OrderSummary";
import SessionManage from "../../Session/SessionManage"
import ShippingAddressSection from "./ShippingAddressSection";
import Service from "../../services/Service";
import useCart from "../../hooks/useCart";
export default function CheckoutComponent() {
    const navigate = useNavigate();
    const [selectedAddressId, setSelectedAddressId] = useState(null);

    const { cart, clearCart } = useCart();

    const [addresses, setAddresses] = useState([]);

    const [shipping, setShipping] = useState({
        fullName: "",
        mobile: "",
        email: "",
        address: "",
        landmark: "",
        city: "",
        state: "",
        pincode: "",
        saveAddress: true
    });
    const [paymentMethod, setPaymentMethod] = useState("cod");

    useEffect(() => {

        if (SessionManage.getTokenId()) {

            loadAddresses();

        }

    }, []);

    const loadAddresses = async () => {

        const response =
            await Service.getMyAddresses();
        console.log(response, "19-5")
        setAddresses(response.data);

        const defaultAddress =
            response.data.find(x => x.isDefault);

        if (defaultAddress) {

            setSelectedAddressId(
                defaultAddress.addressId
            );

        }

    };

    const handleCheckout = async () => {

        try {

            let order;

            if (SessionManage.getTokenId()) {

                order = {
                    addressId: selectedAddressId,
                    paymentMethod
                };

            } else {
                order = {
                    guestAddress: {

                        fullName: shipping.fullName,

                        mobile: shipping.mobile,

                        email: shipping.email,

                        addressLine1: shipping.address,

                        addressLine2: shipping.landmark,

                        city: shipping.city,

                        state: shipping.state,

                        postalCode: shipping.pincode,

                        country: "India"

                    },
                    items: cart.map(x => ({
                        cakeId: x.productId,
                        quantity: x.quantity
                    })),
                    paymentMethod
                };

            }

            const response = await Service.checkout(order);

            toast.success("Order placed successfully.");

            clearCart()

            navigate(
                `/ordersuccess/${response.data.orderId}`
            );

        }
        catch (error) {

            console.error(error);

            toast.error("Unable to place order.");

        }

    };

    const handleCancel = async (orderId) => {

        try {

            await Service.cancelOrder(orderId);

            toast.success("Order cancelled successfully.");

            loadOrders();

        }
        catch (error) {

            toast.error(error.response?.data?.message);

        }

    };
    return (

        <Box className="checkout-page">

            <Breadcrumb
                items={[
                    {
                        label: "Home",
                        path: "/"
                    },
                    {
                        label: "Cart",
                        path: "/cart"
                    },
                    {
                        label: "Checkout"
                    }
                ]}
            />

            <Grid
                container
                spacing={4}
            >

                {/* Left */}

                <Grid
                    size={{
                        xs: 12,
                        md: 7
                    }}
                >
                    <ShippingAddressSection

                        addresses={addresses}

                        selectedAddressId={selectedAddressId}

                        setSelectedAddressId={setSelectedAddressId}

                        shipping={shipping}

                        setShipping={setShipping}

                        onReload={loadAddresses}

                    />

                    {/* <ShippingForm
                        shipping={shipping}
                        setShipping={setShipping}
                    /> */}

                    <PaymentMethods
                        paymentMethod={paymentMethod}
                        setPaymentMethod={setPaymentMethod}
                    />

                </Grid>

                {/* Right */}

                <Grid
                    size={{
                        xs: 12,
                        md: 5
                    }}
                >

                    <OrderSummary
                        paymentMethod={paymentMethod}
                        onCheckout={handleCheckout}
                    />

                </Grid>

            </Grid>

        </Box>

    );

}