import { Grid } from "@mui/material";
import CakeCard from "../CakeCard/CakeCard";
import "./CakeGrid.css";
import Service from "../../../services/Service";
import { useEffect, useState } from "react";

const CakeGrid = ({
    cakes,
    view
}) => {
    const [wishlistCakeIds, setWishlistCakeIds] = useState([])

    useEffect(() => {
        loadWishlistIds();
    }, [])
    const loadWishlistIds = async () => {
        try {
            const res = await Service.getWishlistCakeIds();
            setWishlistCakeIds(res.data)
        } catch (err) {
            console.error(err?.response)
        }
    }

    return (

        <Grid
            container
            spacing={10}
            className="cake-grid"
        >

            {cakes.map((cake) => (

                <Grid
                    key={cake.id}
                // size={{
                //     xs: 12,
                //     sm: view === "grid" ? 6 : 12,
                //     md: view === "grid" ? 4 : 12
                // }}
                >

                    <CakeCard
                        id={cake.id}
                        image={cake.imageUrl}
                        name={cake.name}
                        rating={cake.rating}
                        reviews={cake.totalReviews}
                        price={cake.price}
                        favourite={wishlistCakeIds.includes(cake.id)}
                        width="100%"
                        imageHeight={220}
                        onLoad = {() => loadWishlistIds()}
                    />

                </Grid>

            ))}

        </Grid>

    );

};

export default CakeGrid;