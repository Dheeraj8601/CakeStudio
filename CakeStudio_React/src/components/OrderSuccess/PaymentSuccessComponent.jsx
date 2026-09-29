import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Service from "../../services/Service";
import useCart from "../../hooks/useCart";

const PaymentSuccessComponent = () => {

    const [searchParams] = useSearchParams();

    const navigate = useNavigate();

    const { clearCart, loadCart } = useCart();

    const [message, setMessage] =
        useState("Verifying your payment...");

    useEffect(() => {

        const verifyPayment = async () => {

            const orderId =
                searchParams.get("orderId");

            const sessionId =
                searchParams.get("session_id");

            if (!orderId || !sessionId) {

                setMessage(
                    "Invalid payment confirmation."
                );

                return;
            }

            try {

                const response =
                    await Service.verifyPayment(
                        Number(orderId),
                        sessionId
                    );

                if (!response.data.isPaid) {

                    setMessage(
                        "Payment verification is still pending."
                    );

                    return;
                }

                clearCart();

                await loadCart();

                navigate(
                    `/ordersuccess/${orderId}`,
                    {
                        replace: true
                    }
                );

            }
            catch (error) {

                console.error(error);

                setMessage(
                    "Unable to verify payment."
                );
            }
        };

        verifyPayment();

    }, []);

    return (
        <div className="container py-5 text-center">

            <h3>
                Payment Confirmation
            </h3>

            <p>
                {message}
            </p>

        </div>
    );
};

export default PaymentSuccessComponent;