import { Box, Grid } from "@mui/material";
import SessionManage from "../../Session/SessionManage";


import { cakes } from "../Cakes/cakeData";

import "./cart.css";
import Breadcrumb from "../common/Breadcrumb/Breadcrumb";
import CartTable from "../common/Cart/CartTable";
import CartSummary from "../common/Cart/CartSummary";
import { useEffect, useMemo, useState } from "react";
import useCart from "../../hooks/useCart";
import Service from "../../services/Service"



export default function CartComponent() {
    const [cartItems, setCartItems] = useState([]);
    const { cart, increaseQuantity, decreaseQuantity, removeItem } = useCart();

    useEffect(() => {
        loadCartItems();
    }, [cart]);

    const loadCartItems = async () => {

        try {

            // Guest user

            if (cart.length === 0) {

                setCartItems([]);

                return;

            }

            const response = await Service.getCartItems(
                cart.map(item => item.productId)
            );

            const items = response.data.map(product => {

                const cartItem = cart.find(
                    x => x.productId === product.id
                );

                return {

                    ...product,

                    quantity: cartItem.quantity,
                    cartItemId: cartItem.cartItemId
                };

            });
            console.log(items, "item")
            setCartItems(items);

        }
        catch (error) {

            console.error(error);

        }

    };

    const subtotal = useMemo(() => {
        console.log(cartItems, "cart total")
        if (!cartItems) {
            return 0;
        }
        return cartItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

    }, [cartItems]);

    const handleIncrease = async (item) => {

        await increaseQuantity(item);

        if (SessionManage.getTokenId()) {

            await loadCartItems();

        }

    };

    const handleDecrease = async (item) => {

        await decreaseQuantity(item);

        if (SessionManage.getTokenId()) {

            await loadCartItems();

        }

    };

    const handleRemove = async (item) => {

        await removeItem(item);

        if (SessionManage.getTokenId()) {

            await loadCartItems();

        }

    };

    return (

        <Box className="cart-page">

            <Breadcrumb
                items={[
                    { label: "Home", path: "/" },
                    { label: "Cart" }
                ]}
            />

            <h1 className="cart-title">
                My Cart
            </h1>

            <Grid container spacing={4}>

                <Grid size={{ xs: 12, lg: 9 }}>

                    <CartTable
                        cartItems={cartItems}
                        onIncrease={handleIncrease}
                        onDecrease={handleDecrease}
                        onRemove={handleRemove}
                    />

                </Grid>

                <Grid size={{ xs: 12, lg: 3 }}>

                    <CartSummary
                        subtotal={subtotal}
                    />

                </Grid>

            </Grid>

        </Box>

    );

}