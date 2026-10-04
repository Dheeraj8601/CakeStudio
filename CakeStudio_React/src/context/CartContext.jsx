import {
    createContext,
    useEffect,
    useMemo,
    useState
} from "react";

import Service from "../services/Service";
import { useAuth } from "./AuthContext";


export const CartContext = createContext();


export const CartProvider = ({ children }) => {

    const {
        user,
        loading: authLoading
    } = useAuth();


    const isLoggedIn = !!user;


    // =========================================================
    // CART STATE
    // Initially load guest cart from localStorage.
    // Authentication may still be loading at this point.
    // =========================================================

    const [cart, setCart] = useState(() => {

        const stored =
            localStorage.getItem("cart");

        return stored
            ? JSON.parse(stored)
            : [];

    });


    // =========================================================
    // LOAD LOGGED-IN USER CART
    // =========================================================

    const loadCart = async () => {

        if (!isLoggedIn) {
            return;
        }


        try {

            const response =
                await Service.getMyCart();

            setCart(response.data);

        }
        catch (error) {

            console.error(
                "Failed to load cart:",
                error
            );

        }

    };


    // =========================================================
    // LOAD CART AFTER AUTH CHECK FINISHES
    // =========================================================

    useEffect(() => {

        if (authLoading) {
            return;
        }


        if (isLoggedIn) {

            loadCart();

        }

    }, [
        authLoading,
        isLoggedIn
    ]);


    // =========================================================
    // SAVE ONLY GUEST CART TO LOCAL STORAGE
    // =========================================================

    useEffect(() => {

        if (authLoading) {
            return;
        }


        if (!isLoggedIn) {

            localStorage.setItem(
                "cart",
                JSON.stringify(cart)
            );

        }

    }, [
        cart,
        isLoggedIn,
        authLoading
    ]);


    // =========================================================
    // ADD TO CART
    // =========================================================

    const addToCart = async (
        productId,
        quantity = 1
    ) => {

        if (isLoggedIn) {

            await Service.addToCart({
                cakeId: productId,
                quantity
            });


            await loadCart();

            return;
        }


        setCart(prev => {

            const existing =
                prev.find(
                    x =>
                        x.productId ===
                        productId
                );


            if (existing) {

                return prev.map(item =>

                    item.productId === productId

                        ? {
                            ...item,
                            quantity:
                                item.quantity +
                                quantity
                        }

                        : item

                );

            }


            return [
                ...prev,
                {
                    productId,
                    quantity
                }
            ];

        });

    };


    // =========================================================
    // INCREASE QUANTITY
    // =========================================================

    const increaseQuantity =
        async (cartItem) => {

            if (isLoggedIn) {

                await Service.updateCartQuantity({

                    cartItemId:
                        cartItem.cartItemId,

                    quantity:
                        cartItem.quantity + 1

                });


                await loadCart();

                return;

            }


            setCart(prev =>

                prev.map(item =>

                    item.productId ===
                    cartItem.productId

                        ? {
                            ...item,
                            quantity:
                                item.quantity + 1
                        }

                        : item

                )

            );

        };


    // =========================================================
    // DECREASE QUANTITY
    // =========================================================

    const decreaseQuantity =
        async (cartItem) => {

            if (isLoggedIn) {

                if (cartItem.quantity === 1) {

                    await Service.removeCartItem(
                        cartItem.cartItemId
                    );


                    await loadCart();

                    return;

                }


                await Service.updateCartQuantity({

                    cartItemId:
                        cartItem.cartItemId,

                    quantity:
                        cartItem.quantity - 1

                });


                await loadCart();

                return;

            }


            setCart(prev =>

                prev
                    .map(item =>

                        item.productId ===
                        cartItem.productId

                            ? {
                                ...item,
                                quantity:
                                    item.quantity - 1
                            }

                            : item

                    )
                    .filter(
                        item =>
                            item.quantity > 0
                    )

            );

        };


    // =========================================================
    // REMOVE ITEM
    // =========================================================

    const removeItem =
        async (cartItem) => {

            if (isLoggedIn) {

                await Service.removeCartItem(
                    cartItem.cartItemId
                );


                await loadCart();

                return;

            }


            setCart(prev =>

                prev.filter(
                    item =>
                        item.productId !==
                        cartItem.productId
                )

            );

        };


    // =========================================================
    // CLEAR CART
    // =========================================================

    const clearCart = () => {

        setCart([]);

    };


    // =========================================================
    // CART COUNT
    // =========================================================

    const cartCount = useMemo(() => {

        return cart.reduce(
            (sum, item) =>
                sum + item.quantity,
            0
        );

    }, [cart]);


    // =========================================================
    // CONTEXT VALUE
    // =========================================================

    const value = {

        cart,

        cartCount,

        addToCart,

        increaseQuantity,

        decreaseQuantity,

        removeItem,

        clearCart,

        loadCart

    };


    return (

        <CartContext.Provider
            value={value}
        >

            {children}

        </CartContext.Provider>

    );

};