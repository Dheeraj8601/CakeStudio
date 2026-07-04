import {
    Box
} from "@mui/material";

import { useState, useEffect } from "react";

import CakeHeader from "./CakeHeader";
import CakeTable from "./CakeTable";
import DeleteCakeDialog from "./DeleteCakeDialog";
import Service from "../../../services/Service"
import "./Cakes.css";
import CakeFilters from "./CakeFilters";

export default function Cakes() {

    const [cakes, setCakes] = useState([]);
    const [selectedCake, setSelectedCake] = useState(null);
    const [categories, setCategories] = useState([]);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [search, setSearch] = useState("");

    const [category, setCategory] = useState("");

    const [minPrice, setMinPrice] = useState("");

    const [maxPrice, setMaxPrice] = useState("");

    const [page, setPage] = useState(0);

    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [totalRecords, setTotalRecords] = useState(0);
    useEffect(() => {

        loadCategories();

    }, []);
    useEffect(() => {
        loadCakes();
    }, [page, rowsPerPage, search, category, minPrice, maxPrice]);
    useEffect(() => {

        setPage(0);

    }, [search, category, minPrice, maxPrice]);
    const handleDelete = (cake) => {

        setSelectedCake(cake);

        setOpenDeleteDialog(true);

    };
    const loadCategories = async () => {

        try {

            const response = await Service.getAllCategories();

            setCategories(response.data);

        }

        catch (error) {

            console.error(error);

        }

    };
    const loadCakes = async () => {

        try {

            const params = {

                page: page + 1,

                pageSize: rowsPerPage,

                search,

                category,

                minPrice: minPrice || null,

                maxPrice: maxPrice || null

            };

            const response = await Service.getCakes(params);

            setTotalRecords(

                response.data.totalRecords

            );

            const data = response.data.data.map(item => ({

                id: item.cakeId,

                name: item.name,

                image: item.imageUrl,

                price: item.price,

                category: item.category,

                stockQuantity: item.stockQuantity

            }));

            setCakes(data);

        }

        catch (error) {

            console.error(error);

        }

    };

    return (

        <Box className="cakes-page">

            <CakeHeader />

            <CakeFilters

                search={search}
                setSearch={setSearch}

                category={category}
                setCategory={setCategory}

                minPrice={minPrice}
                setMinPrice={setMinPrice}

                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}

                categories={categories}

            />

            <CakeTable

                cakes={cakes}

                totalRecords={totalRecords}

                page={page}

                rowsPerPage={rowsPerPage}

                setPage={setPage}

                setRowsPerPage={setRowsPerPage}

                onDelete={handleDelete}

            />

            <DeleteCakeDialog

                open={openDeleteDialog}

                cake={selectedCake}

                onClose={() => setOpenDeleteDialog(false)}

                onConfirm={async () => {
                    try {
                        await Service.deleteCake(selectedCake.id);

                        setOpenDeleteDialog(false);

                        loadCakes();
                    }
                    catch (error) {
                        console.error(error);
                    }
                }}

            />

        </Box>

    );

}