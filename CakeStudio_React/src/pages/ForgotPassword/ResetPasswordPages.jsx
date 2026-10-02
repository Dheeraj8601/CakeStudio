import { useNavigate, useParams } from "react-router-dom";
import { Box } from "@mui/material";
import ResetPassword from "../../components/common/Auth/ForgotPassword/ResetPassword";


export default function ResetPasswordPage(props) {
    const navigate = useNavigate();
    const params = useParams()
    return (
        <Box>
            <ResetPassword
                {...props}
                // navigate={navigate}
                // id={params.id}
            />
        </Box>
    )
}