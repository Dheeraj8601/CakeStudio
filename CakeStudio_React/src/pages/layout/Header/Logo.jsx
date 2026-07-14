import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

import logo2 from "../../../assets/images/logo/logo_2.png";

const Logo = () => {

    const navigate = useNavigate();

    return (

        <Box
            component="img"
            src={logo2}
            alt="CakeStudio"
            sx={{
                height: 42,
                cursor: "pointer"
            }}
            onClick={() => navigate("/")}
        />

    );

};

export default Logo;