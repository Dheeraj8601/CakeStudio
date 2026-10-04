import {
    Box,
    Grid
} from "@mui/material";

import {
    useNavigate,
    useSearchParams
} from "react-router-dom";

import {
    toast
} from "react-toastify";

import {
    useEffect,
    useState
} from "react";

import "./checkout.css";

import Breadcrumb
    from "../common/Breadcrumb/Breadcrumb";

import PaymentMethods
    from "./PaymentMethods";

import OrderSummary
    from "./OrderSummary";

import ShippingAddressSection
    from "./ShippingAddressSection";

import Service
    from "../../services/Service";

import useCart
    from "../../hooks/useCart";

import {
    useAuth
} from "../../context/AuthContext";


export default function CheckoutComponent() {

    const navigate =
        useNavigate();


    const [
        searchParams
    ] = useSearchParams();


    const retryOrderId =
        searchParams.get(
            "retryOrderId"
        );


    const {
        cart,
        clearCart
    } = useCart();


    const {
        user,
        loading: authLoading
    } = useAuth();


    const isLoggedIn =
        !!user;


    const [
        selectedAddressId,
        setSelectedAddressId
    ] = useState(null);


    const [
        addresses,
        setAddresses
    ] = useState([]);


    const [
        shipping,
        setShipping
    ] = useState({

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


    const [
        errors,
        setErrors
    ] = useState({});


    const [
        paymentMethod,
        setPaymentMethod
    ] = useState("cod");


    const [
        processing,
        setProcessing
    ] = useState(false);


    // =========================================================
    // LOAD ADDRESSES
    // =========================================================

    useEffect(() => {

        if (authLoading) {
            return;
        }


        if (isLoggedIn) {

            loadAddresses();

        }
        else {

            setAddresses([]);

            setSelectedAddressId(
                null
            );

        }

    }, [
        authLoading,
        isLoggedIn
    ]);


    // =========================================================
    // RETRY PAYMENT MODE
    // =========================================================

    useEffect(() => {

        if (retryOrderId) {

            setPaymentMethod(
                "card"
            );

        }

    }, [retryOrderId]);


    // =========================================================
    // LOAD SAVED ADDRESSES
    // =========================================================

    const loadAddresses =
        async () => {

            try {

                const response =
                    await Service.getMyAddresses();


                setAddresses(
                    response.data
                );


                const defaultAddress =
                    response.data.find(
                        x =>
                            x.isDefault
                    );


                if (defaultAddress) {

                    setSelectedAddressId(
                        defaultAddress.addressId
                    );

                }

            }
            catch (error) {

                console.error(
                    "Unable to load addresses:",
                    error
                );

            }

        };


    // =========================================================
    // VALIDATE SHIPPING
    // =========================================================

    const validateShipping = () => {

        // -----------------------------------------------------
        // AUTH STATE IS STILL LOADING
        // -----------------------------------------------------

        if (authLoading) {

            return false;

        }


        // -----------------------------------------------------
        // LOGGED-IN CUSTOMER
        // -----------------------------------------------------

        if (isLoggedIn) {

            if (!selectedAddressId) {

                toast.error(
                    "Please select a delivery address."
                );

                return false;

            }


            return true;

        }


        // -----------------------------------------------------
        // GUEST CHECKOUT
        // -----------------------------------------------------

        const newErrors = {};


        if (
            !shipping.fullName?.trim()
        ) {

            newErrors.fullName =
                "Full name is required";

        }


        if (
            !shipping.mobile?.trim()
        ) {

            newErrors.mobile =
                "Mobile number is required";

        }
        else if (
            !/^[6-9]\d{9}$/.test(
                shipping.mobile.trim()
            )
        ) {

            newErrors.mobile =
                "Enter a valid 10-digit mobile number";

        }


        if (
            shipping.email?.trim()
            &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                shipping.email.trim()
            )
        ) {

            newErrors.email =
                "Enter a valid email address";

        }


        if (
            !shipping.address?.trim()
        ) {

            newErrors.address =
                "Address is required";

        }


        if (
            !shipping.city?.trim()
        ) {

            newErrors.city =
                "City is required";

        }


        if (
            !shipping.state?.trim()
        ) {

            newErrors.state =
                "State is required";

        }


        if (
            !shipping.pincode?.trim()
        ) {

            newErrors.pincode =
                "Pincode is required";

        }
        else if (
            !/^\d{6}$/.test(
                shipping.pincode.trim()
            )
        ) {

            newErrors.pincode =
                "Enter a valid 6-digit pincode";

        }


        setErrors(
            newErrors
        );


        return (
            Object.keys(
                newErrors
            ).length === 0
        );

    };


    // =========================================================
    // START STRIPE PAYMENT
    // =========================================================

    const startStripePayment =
        async (orderId) => {

            const paymentResponse =
                await Service.createPaymentSession(
                    orderId
                );


            const checkoutUrl =
                paymentResponse.data.checkoutUrl;


            if (!checkoutUrl) {

                throw new Error(
                    "Unable to start payment."
                );

            }


            window.location.href =
                checkoutUrl;

        };


    // =========================================================
    // CHECKOUT
    // =========================================================

    const handleCheckout =
        async () => {

            if (
                processing ||
                authLoading
            ) {

                return;

            }


            try {

                setProcessing(
                    true
                );


                // =============================================
                // RETRY EXISTING STRIPE ORDER
                // =============================================

                if (retryOrderId) {

                    const parsedOrderId =
                        Number(
                            retryOrderId
                        );


                    if (
                        !Number.isInteger(
                            parsedOrderId
                        )
                        ||
                        parsedOrderId <= 0
                    ) {

                        toast.error(
                            "Invalid order reference."
                        );

                        return;

                    }


                    await startStripePayment(
                        parsedOrderId
                    );


                    return;

                }


                // =============================================
                // NORMAL CHECKOUT
                // =============================================

                if (
                    !validateShipping()
                ) {

                    return;

                }


                let order;


                // =============================================
                // LOGGED-IN CUSTOMER
                // =============================================

                if (isLoggedIn) {

                    order = {

                        addressId:
                            selectedAddressId,

                        paymentMethod

                    };

                }


                // =============================================
                // GUEST CUSTOMER
                // =============================================

                else {

                    order = {

                        guestAddress: {

                            fullName:
                                shipping.fullName,

                            mobile:
                                shipping.mobile,

                            email:
                                shipping.email,

                            addressLine1:
                                shipping.address,

                            addressLine2:
                                shipping.landmark,

                            city:
                                shipping.city,

                            state:
                                shipping.state,

                            postalCode:
                                shipping.pincode,

                            country:
                                "India"

                        },


                        items:
                            cart.map(
                                x => ({

                                    cakeId:
                                        x.productId,

                                    quantity:
                                        x.quantity

                                })
                            ),


                        paymentMethod

                    };

                }


                // =============================================
                // CREATE ORDER
                // =============================================

                const response =
                    await Service.checkout(
                        order
                    );


                const orderId =
                    response.data.orderId;


                // =============================================
                // CASH ON DELIVERY
                // =============================================

                if (
                    paymentMethod ===
                    "cod"
                ) {

                    toast.success(
                        "Order placed successfully."
                    );


                    clearCart();


                    navigate(
                        `/ordersuccess/${orderId}`
                    );


                    return;

                }


                // =============================================
                // STRIPE CARD PAYMENT
                // =============================================

                if (
                    paymentMethod ===
                    "card"
                ) {

                    await startStripePayment(
                        orderId
                    );


                    return;

                }

            }
            catch (error) {

                console.error(
                    "Checkout failed:",
                    error
                );


                toast.error(

                    error.response
                        ?.data
                        ?.message

                    ||

                    error.response
                        ?.data
                        ?.Message

                    ||

                    error.message

                    ||

                    "Unable to process checkout."

                );

            }
            finally {

                setProcessing(
                    false
                );

            }

        };


    // =========================================================
    // UI
    // =========================================================

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
                        label:
                            retryOrderId
                                ? "Retry Payment"
                                : "Checkout"
                    }
                ]}

            />


            {/* ============================================= */}
            {/* RETRY PAYMENT INFORMATION */}
            {/* ============================================= */}

            {
                retryOrderId && (

                    <div
                        style={{
                            backgroundColor:
                                "#fff8e1",

                            border:
                                "1px solid #ffe082",

                            borderRadius:
                                "8px",

                            padding:
                                "14px 18px",

                            marginBottom:
                                "24px"
                        }}
                    >

                        <div
                            style={{
                                fontWeight:
                                    "600",

                                marginBottom:
                                    "4px"
                            }}
                        >

                            Retry Payment

                        </div>


                        <div
                            style={{
                                fontSize:
                                    "14px",

                                color:
                                    "#6c757d"
                            }}
                        >

                            You are retrying payment for Order #

                            {retryOrderId}.

                            A new order will not be created.

                        </div>

                    </div>

                )
            }


            <Grid
                container
                spacing={4}
            >

                {/* LEFT */}

                <Grid
                    size={{
                        xs: 12,
                        md: 7
                    }}
                >

                    <ShippingAddressSection

                        addresses={
                            addresses
                        }

                        selectedAddressId={
                            selectedAddressId
                        }

                        setSelectedAddressId={
                            setSelectedAddressId
                        }

                        shipping={
                            shipping
                        }

                        setShipping={
                            setShipping
                        }

                        errors={
                            errors
                        }

                        onReload={
                            loadAddresses
                        }

                    />


                    <PaymentMethods

                        paymentMethod={
                            paymentMethod
                        }

                        setPaymentMethod={
                            setPaymentMethod
                        }

                    />

                </Grid>


                {/* RIGHT */}

                <Grid
                    size={{
                        xs: 12,
                        md: 5
                    }}
                >

                    <OrderSummary

                        paymentMethod={
                            paymentMethod
                        }

                        onCheckout={
                            handleCheckout
                        }

                        processing={
                            processing ||
                            authLoading
                        }

                    />

                </Grid>

            </Grid>

        </Box>

    );

}