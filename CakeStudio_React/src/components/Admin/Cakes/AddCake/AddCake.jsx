import {
    Box,
    Breadcrumbs,
    Link,
    Typography
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import CakeForm from "./CakeForm";

import "./AddCake.css";

export default function AddCake() {

    const navigate = useNavigate();

    return (
        <Box className="add-cake-page">
            <Breadcrumbs className="cake-breadcrumb">

                <Link
                    underline="hover"
                    sx={{
                        cursor:"pointer",
                        color:"#ff5b84"
                    }}
                    onClick={() => navigate("/admin/cakes")}
                >
                    Cakes
                </Link>
                <Typography>
                    Add Cake
                </Typography>
            </Breadcrumbs>
            <CakeForm />
        </Box>
    );

}