import { useNavigate, useParams } from "react-router-dom";
import { Box } from "@mui/material";
import ForgotPassword from "../../components/common/Auth/ForgotPassword/ForgotPassword";

export default function ForgotPasswordPage(props) {
    const navigate = useNavigate();
    const params = useParams()
    return (
        <Box>
            <ForgotPassword
                {...props}
                // navigate={navigate}
                // id={params.id}
            />
        </Box>
    )
}