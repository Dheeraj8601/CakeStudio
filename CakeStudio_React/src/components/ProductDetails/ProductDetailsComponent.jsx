import { Grid, Box } from "@mui/material";
import ProductGallery from "../common/ProductDetails/ProductGallery";
import ProductInfo from "../common/ProductDetails/ProductInfo";
import Breadcrumb from "../../components/common/Breadcrumb/Breadcrumb"
import "./ProductDetailsComponent.css"
import { useEffect, useState } from "react";
import Service from "../../services/Service";


export default function ProductDetailsComponent(props) {
    const [product, setProduct] = useState({
        id: 0,
        name: "",
        price: 0,
        rating: 0,
        reviewCount: 0,
        description: "",
        flavour: "",
        weight: "",
        delivery: "",
        images: []
    });


    useEffect(() => {
        loadProduct(props.id)
    }, [props.id])

    const loadProduct = async (id) => {
        try {
            const res = await Service.getCakeDetails(id);
            console.log(res.data, "product")
            const data = res.data;
            setProduct(prev => {
                return {
                    ...prev,
                    id: data.id,
                    name: data.name,
                    price: data.price,
                    rating: data.rating,
                    reviewCount: data.reviewCount,
                    description: data.description,
                    flavour: data.flavour,
                    weight: data.weight,
                    delivery: data.delivery,
                    images: data.images
                }
            })
        } catch (err) {

        }
    }

    return (

        <Box
            sx={{
                maxWidth: "1400px",
                mx: "auto",
                px: { xs: 2, md: 4 },
                py: 3
            }}
        >

            <Breadcrumb
                items={[
                    { label: "Home", path: "/" },
                    { label: "Cakes", path: "/cakes" },
                    { label: product.name }
                ]}
            />

            <Box className="product-details-container">

                <Grid
                    container
                    spacing={6}
                    alignitems="flex-start"
                >

                    {/* Left */}

                    <Grid
                        size={{
                            xs: 12,
                            md: 6
                        }}
                    >

                        <ProductGallery
                            images={product.images}
                        />

                    </Grid>

                    {/* Right */}

                    <Grid
                        size={{
                            xs: 12,
                            md: 6
                        }}
                    >

                        <ProductInfo
                            product={product}
                        />

                    </Grid>

                </Grid>

            </Box>

        </Box>

    );

}