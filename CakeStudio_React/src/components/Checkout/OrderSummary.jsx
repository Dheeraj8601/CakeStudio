import {
    Box,
    Card,
    CardContent,
    Divider,
    Typography
} from "@mui/material";
import "./checkout.css"
import PrimaryButton from "../../components/common/CustomFields/PrimaryButton/PrimaryButton";
import OrderItem from "./OrderItem";
import PriceDetails from "./PriceDetails";
import useCart from "../../hooks/useCart"
import { cakes } from "../Cakes/cakeData";
import { useEffect, useState } from "react";
import Service from "../../services/Service";

const OrderSummary = ({ paymentMethod, onCheckout }) => {

    const { cart } = useCart();
    const [cartItems, setCartItems] = useState([]);
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
            setCartItems(items);

        }
        catch (error) {

            console.error(error);

        }

    };

    return (

        <Card className="order-summary-card">

            <CardContent>

                <Typography className="summary-title">
                    Order Summary
                </Typography>

                <Box className="summary-items">

                    {cartItems.map(item => (

                        <OrderItem
                            key={item.id}
                            item={item}
                        />

                    ))}

                </Box>

                <Divider className="summary-divider" />

                <PriceDetails
                    cartItems={cartItems}
                />

                <PrimaryButton
                    fullWidth
                    className="checkout-btn"
                    onClick={onCheckout}
                >
                    {paymentMethod === "cod"
                        ? "Place Order"
                        : "Proceed to Payment"}
                </PrimaryButton>

            </CardContent>

        </Card>

    );

};

export default OrderSummary;