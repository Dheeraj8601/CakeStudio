import { Box } from "@mui/material";
import PaymentCancelComponent from "../../components/OrderSuccess/PaymentCancelComponent";
import { useNavigate, useParams } from "react-router-dom";

export default function PaymentCancel(props) {
    const navigate = useNavigate()
    const {orderId} = useParams()
    return (
        <>
            <Box>
                <PaymentCancelComponent
                    {...props}
                    navigate={navigate}
                    orderId={orderId}
                />
            </Box>
        </>
    )
}