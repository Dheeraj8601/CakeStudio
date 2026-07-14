import {
    createContext,
    useEffect,
    useMemo,
    useState
} from "react";
import SessionManage from "../Session/SessionManage";
import Service from "../services/Service";

export const CartContext = createContext();

const isLoggedIn = () => {
    return !!SessionManage.getTokenId();
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {

        if (isLoggedIn()) {
            return [];
        }

        const stored = localStorage.getItem("cart");

        return stored ? JSON.parse(stored) : [];
    });


    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {

        if (isLoggedIn()) {

            try {

                const response = await Service.getMyCart();

                setCart(response.data);

            }
            catch (error) {

                console.error(error);

            }

            return;
        }

    };

    useEffect(() => {

        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );

    }, [cart]);

    const addToCart = async (productId, quantity = 1) => {

        if (isLoggedIn()) {

            await Service.addToCart({
                cakeId: productId,
                quantity
            });
            loadCart();
            return;
        }

        setCart(prev => {

            const existing = prev.find(
                x => x.productId === productId
            );

            if (existing) {

                return prev.map(item =>
                    item.productId === productId
                        ? {
                            ...item,
                            quantity: item.quantity + quantity
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

    const increaseQuantity = async (cartItem) => {
        if (isLoggedIn()) {
            await Service.updateCartQuantity({

                cartItemId: cartItem.cartItemId,

                quantity: cartItem.quantity + 1

            });
            loadCart();
            return;
        }
        console.log(cartItem)
        setCart(prev =>
            prev.map(item =>
                item.productId === cartItem.productId
                    ? {
                        ...item,
                        quantity: item.quantity + 1
                    }
                    : item
            )
        );

    };

    const decreaseQuantity = async (cartItem) => {

        if (isLoggedIn()) {

            if (cartItem.quantity === 1) {

                await Service.removeCartItem(
                    cartItem.cartItemId
                );
                loadCart();
                return;
            }

            await Service.updateCartQuantity({

                cartItemId: cartItem.cartItemId,

                quantity: cartItem.quantity - 1

            });

            return;
        }

        setCart(prev =>
            prev
                .map(item =>
                    item.productId === cartItem.productId
                        ? {
                            ...item,
                            quantity: item.quantity - 1
                        }
                        : item
                )
                .filter(item => item.quantity > 0)
        );

    };

    const removeItem = async (cartItem) => {

        if (isLoggedIn()) {

            await Service.removeCartItem(
                cartItem.cartItemId
            );
            loadCart();
            return;
        }

        setCart(prev =>
            prev.filter(
                item => item.productId !== cartItem.productId
            )
        );

    };

    const clearCart = () => {

        setCart([]);

    };

    const cartCount = useMemo(() => {

        return cart.reduce(
            (sum, item) => sum + item.quantity,
            0
        );

    }, [cart]);

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

        <CartContext.Provider value={value}>

            {children}

        </CartContext.Provider>

    );

};