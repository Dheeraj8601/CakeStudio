import {
    useNavigate,
    useSearchParams
} from "react-router-dom";

const PaymentCancelComponent = () => {

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const orderId =
        searchParams.get("orderId");

    const styles = {
        page: {
            minHeight: "75vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "40px 20px",
            backgroundColor: "#f8f9fa"
        },

        card: {
            width: "100%",
            maxWidth: "520px",
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            padding: "40px",
            textAlign: "center",
            boxShadow:
                "0 8px 30px rgba(0, 0, 0, 0.08)"
        },

        icon: {
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            backgroundColor: "#fdecec",
            color: "#dc3545",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "0 auto 24px",
            fontSize: "38px",
            fontWeight: "500"
        },

        title: {
            fontSize: "28px",
            fontWeight: "700",
            color: "#212529",
            marginBottom: "12px"
        },

        description: {
            fontSize: "15px",
            lineHeight: "1.7",
            color: "#6c757d",
            marginBottom: "24px"
        },

        orderBox: {
            backgroundColor: "#f8f9fa",
            borderRadius: "10px",
            padding: "14px 16px",
            marginBottom: "20px"
        },

        orderLabel: {
            display: "block",
            fontSize: "12px",
            color: "#6c757d",
            marginBottom: "4px"
        },

        orderNumber: {
            fontSize: "16px",
            fontWeight: "600",
            color: "#212529"
        },

        infoBox: {
            padding: "15px",
            border: "1px solid #e9ecef",
            borderRadius: "10px",
            textAlign: "left",
            marginBottom: "24px",
            backgroundColor: "#ffffff"
        },

        infoTitle: {
            fontSize: "14px",
            fontWeight: "600",
            color: "#343a40",
            marginBottom: "5px"
        },

        infoText: {
            fontSize: "13px",
            lineHeight: "1.6",
            color: "#6c757d",
            margin: 0
        },

        retryButton: {
            width: "100%",
            border: "none",
            borderRadius: "8px",
            padding: "12px 20px",
            backgroundColor: "#0d6efd",
            color: "#ffffff",
            fontSize: "15px",
            fontWeight: "600",
            cursor: "pointer"
        },

        shoppingButton: {
            border: "none",
            backgroundColor: "transparent",
            color: "#6c757d",
            fontSize: "14px",
            cursor: "pointer",
            marginTop: "18px",
            padding: "6px 12px"
        }
    };

    return (
        <div style={styles.page}>

            <div style={styles.card}>

                {/* Cancel Icon */}

                <div style={styles.icon}>
                    ×
                </div>

                {/* Title */}

                <h2 style={styles.title}>
                    Payment Cancelled
                </h2>

                {/* Description */}

                <p style={styles.description}>
                    Your payment was not completed.
                    Your cart is still available, so
                    you can return to checkout and
                    try again.
                </p>

                {/* Order Reference */}

                {orderId && (
                    <div style={styles.orderBox}>

                        <span style={styles.orderLabel}>
                            Order Reference
                        </span>

                        <span style={styles.orderNumber}>
                            #{orderId}
                        </span>

                    </div>
                )}

                {/* Information */}

                <div style={styles.infoBox}>

                    <div style={styles.infoTitle}>
                        No payment was completed
                    </div>

                    <p style={styles.infoText}>
                        Your cart has not been cleared.
                        You can safely return to checkout
                        and try the payment again.
                    </p>

                </div>

                {/* Try Again */}

                <button
                    type="button"
                    style={styles.retryButton}
                    // onClick={() =>
                    //     navigate("/checkout")
                    // }
                    onClick={() => {

    if (orderId) {

        navigate(
            `/checkout?retryOrderId=${orderId}`
        );

        return;
    }

    navigate("/checkout");
}}
                >
                    Try Payment Again
                </button>

                {/* Continue Shopping */}

                <button
                    type="button"
                    style={styles.shoppingButton}
                    onClick={() =>
                        navigate("/")
                    }
                >
                    Continue Shopping
                </button>

            </div>

        </div>
    );
};

export default PaymentCancelComponent;