import {
    Box,
    Grid
} from "@mui/material";

import {
    useEffect,
    useMemo,
    useState
} from "react";

import "./cart.css";

import Breadcrumb
    from "../common/Breadcrumb/Breadcrumb";

import CartTable
    from "../common/Cart/CartTable";

import CartSummary
    from "../common/Cart/CartSummary";

import useCart
    from "../../hooks/useCart";

import Service
    from "../../services/Service";

import {
    useAuth
} from "../../context/AuthContext";


export default function CartComponent() {

    const [
        cartItems,
        setCartItems
    ] = useState([]);


    const {
        cart,
        increaseQuantity,
        decreaseQuantity,
        removeItem
    } = useCart();


    const {
        user,
        loading: authLoading
    } = useAuth();


    const isLoggedIn =
        !!user;


    // =========================================================
    // LOAD CART PRODUCTS
    // =========================================================

    useEffect(() => {

        if (authLoading) {
            return;
        }

        loadCartItems();

    }, [
        cart,
        authLoading,
        isLoggedIn
    ]);


    const loadCartItems = async () => {

        try {

            if (cart.length === 0) {

                setCartItems([]);

                return;

            }


            const response =
                await Service.getCartItems(

                    cart.map(
                        item =>
                            item.productId
                    )

                );


            const items =
                response.data.map(
                    product => {

                        const cartItem =
                            cart.find(
                                x =>
                                    x.productId ===
                                    product.id
                            );


                        return {

                            ...product,

                            quantity:
                                cartItem?.quantity ?? 0,

                            cartItemId:
                                cartItem?.cartItemId

                        };

                    }
                );


            setCartItems(
                items
            );

        }
        catch (error) {

            console.error(
                "Unable to load cart items:",
                error
            );

        }

    };


    // =========================================================
    // SUBTOTAL
    // =========================================================

    const subtotal =
        useMemo(
            () => {

                if (!cartItems) {
                    return 0;
                }


                return cartItems.reduce(

                    (sum, item) =>
                        sum +
                        item.price *
                        item.quantity,

                    0

                );

            },
            [cartItems]
        );


    // =========================================================
    // INCREASE
    // =========================================================

    const handleIncrease =
        async (item) => {

            if (authLoading) {
                return;
            }


            await increaseQuantity(
                item
            );


            if (isLoggedIn) {

                await loadCartItems();

            }

        };


    // =========================================================
    // DECREASE
    // =========================================================

    const handleDecrease =
        async (item) => {

            if (authLoading) {
                return;
            }


            await decreaseQuantity(
                item
            );


            if (isLoggedIn) {

                await loadCartItems();

            }

        };


    // =========================================================
    // REMOVE
    // =========================================================

    const handleRemove =
        async (item) => {

            if (authLoading) {
                return;
            }


            await removeItem(
                item
            );


            if (isLoggedIn) {

                await loadCartItems();

            }

        };


    // =========================================================
    // UI
    // =========================================================

    return (

        <Box className="cart-page">

            <Breadcrumb
                items={[
                    {
                        label: "Home",
                        path: "/"
                    },
                    {
                        label: "Cart"
                    }
                ]}
            />


            <h1 className="cart-title">

                My Cart

            </h1>


            <Grid
                container
                spacing={4}
            >

                <Grid
                    size={{
                        xs: 12,
                        lg: 9
                    }}
                >

                    <CartTable
                        cartItems={cartItems}
                        onIncrease={handleIncrease}
                        onDecrease={handleDecrease}
                        onRemove={handleRemove}
                    />

                </Grid>


                <Grid
                    size={{
                        xs: 12,
                        lg: 3
                    }}
                >

                    <CartSummary
                        subtotal={subtotal}
                    />

                </Grid>

            </Grid>

        </Box>

    );

}