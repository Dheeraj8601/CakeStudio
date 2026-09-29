import { Box } from "@mui/material";
import PaymentSuccessComponent from "../../components/OrderSuccess/PaymentSuccessComponent";
import { useNavigate, useParams } from "react-router-dom";

export default function PaymentSuccess(props) {
    const navigate = useNavigate()
    const {orderId} = useParams()
    return (
        <>
            <Box>
                <PaymentSuccessComponent
                    {...props}
                    navigate={navigate}
                    orderId={orderId}
                />
            </Box>
        </>
    )
}