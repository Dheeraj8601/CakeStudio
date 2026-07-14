import {
    Box
} from "@mui/material";

import { useEffect, useState } from "react";

import WishlistHeader from "./WishlistHeader";
import WishlistList from "./WishlistList";

import "./Wishlist.css";

import Service from "../../../services/Service";

export default function Wishlist() {

    const [wishlist, setWishlist] = useState([]);

    const [page] = useState(1);

    const [pageSize] = useState(20);

    const [sortBy, setSortBy] = useState("recent");

    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {

        loadWishlist();

    }, [sortBy]);

    const loadWishlist = async () => {

        try {

            const response = await Service.getWishlist({

                page,

                pageSize,

                sortBy

            });
            
            setWishlist(response.data.data);

            setTotalItems(response.data.totalRecords);

        }
        catch (error) {

            console.error(error);

        }

    };

    return (

        <Box>

            <WishlistHeader

                totalItems={totalItems}

                sortBy={sortBy}

                onSortChange={setSortBy}
                onReload = {() => loadWishlist()}

            />

            <WishlistList

                wishlist={wishlist}

                onReload={loadWishlist}

            />

        </Box>

    );

}