import {
    Box,
    Breadcrumbs,
    Link,
    Typography
} from "@mui/material";

import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import CakeForm from "../AddCake/CakeForm";

import "./EditCake.css";
import Service from "../../../../services/Service";

export default function EditCake(props) {


    const navigate = useNavigate();

    const [cake, setCake] = useState(null);

    useEffect(() => {
        loadCake();
    }, [props.id]);

    const loadCake = async () => {
        try {
            const response = await Service.getCakeById(props.id);

            const item = response.data;
            //console.log(item,"item ed")

            setCake({
                id: item.id,
                name: item.name,
                description: item.description,
                category: item.category,
                price: item.price,
                stockQuantity: item.stockQuantity,
                isEggless: item.isEggless,
                image: null,
                isAvailable: item.isAvailable,
                imageUrl:item.imageUrl
            });
        }
        catch (error) {
            console.error(error);
        }
    };

    return (

        <Box className="edit-cake-page">

            <Breadcrumbs>

                <Link

                    underline="hover"

                    sx={{

                        cursor: "pointer",

                        color: "#ff5b84"

                    }}

                    onClick={() => navigate("/admin/cakes")}

                >

                    Cakes

                </Link>

                <Typography>

                    Edit Cake

                </Typography>

            </Breadcrumbs>

            <CakeForm

                initialValues={cake}

                isEdit={true}

            />

        </Box>

    );

}