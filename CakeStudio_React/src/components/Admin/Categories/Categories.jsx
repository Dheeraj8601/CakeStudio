import { Box } from "@mui/material";
import { useEffect, useState } from "react";

import CategoryHeader from "./CategoryHeader";
import CategoryFilters from "./CategoryFilters";
import CategoryTable from "./CategoryTable";
import EmptyCategories from "./EmptyCategories";
import AddEditCategoryDialog from "./AddEditCategoryDialog";
import DeleteCategoryDialog from "./DeleteCategoryDialog";

import "./Categories.css";
import Service from "../../../services/Service";
import SessionManage from "../../../Session/SessionManage";

export default function Categories() {

    const [categories, setCategories] = useState([]);


    const [search, setSearch] = useState("");

    const [status, setStatus] = useState("All");

    const [selectedCategory, setSelectedCategory] = useState(null);

    const [openDialog, setOpenDialog] = useState(false);

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);



    useEffect(() => {
        loadCategories();
    }, [search, status]);

    const loadCategories = async () => {
        try {
            const params = {
                page: 1,
                pageSize: 10,
                search: search,
                isActive:
                    status === "All"
                        ? null
                        : status === "Active"
            };
            const response = await Service.getCategoriesWithFilters(params);

            const data = response.data.data.map(item => ({
                id: item.id,
                name: item.categoryName,
                description: item.description,
                image: item.imageUrl,
                status: item.isActive ? "Active" : "Inactive",
                createdOn: new Date(item.createdOn).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                })
            }));

            setCategories(data);
        }
        catch (error) {
            console.error(error);
        }
    };

    const handleAdd = () => {

        setSelectedCategory(null);

        setOpenDialog(true);

    };

    const handleEdit = (category) => {
        setSelectedCategory(category);

        setOpenDialog(true);

    };

    const handleDelete = (category) => {
        setSelectedCategory(category);
        setOpenDeleteDialog(true);
    };

    const SaveHandler = async (category) => {
        if (category.id !== null && category.id !== 0 && selectedCategory !== null) {
            const formdata = new FormData();
            formdata.append('Id', selectedCategory.id)
            formdata.append('CategoryName', category.name)
            formdata.append('Description', category.description)
            formdata.append('isActive', category.status === "Active" ? true : false)
            formdata.append('imageUrl', category.imageUrl)

            await Service.updateCategory(formdata);

        } else {
            const formdata = new FormData();
            formdata.append('CategoryName', category.name)
            formdata.append('Description', category.description)
            formdata.append('isActive', category.status === "Active" ? true : false)
            formdata.append('imageFile', category.image)

            await Service.createCategory(formdata);
        }
        await loadCategories()
    }

    return (

        <Box className="categories-page">

            <CategoryHeader

                onAdd={handleAdd}

            />

            <CategoryFilters

                search={search}

                setSearch={setSearch}

                status={status}

                setStatus={setStatus}

            />

            {

                categories.length === 0 ?

                    <EmptyCategories />

                    :

                    <CategoryTable

                        categories={categories}

                        onEdit={handleEdit}

                        onDelete={handleDelete}

                    />

            }

            <AddEditCategoryDialog

                open={openDialog}

                category={selectedCategory}

                onClose={() => setOpenDialog(false)}

                onSave={(category) => {

                    SaveHandler(category);

                }}

            />

            <DeleteCategoryDialog

                open={openDeleteDialog}

                category={selectedCategory}

                onClose={() => setOpenDeleteDialog(false)}

                onConfirm={async () => {
                    await Service.deleteCategory(selectedCategory.id);
                    setOpenDeleteDialog(false);
                    loadCategories();
                }}

            />

        </Box>

    );

}