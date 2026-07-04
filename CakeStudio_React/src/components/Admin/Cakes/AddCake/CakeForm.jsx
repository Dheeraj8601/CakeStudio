import {
    Box,
    Card,
    CardContent,
    Checkbox,
    FormControlLabel,
    Grid,
    MenuItem,
    TextField,
    Typography
} from "@mui/material";

import BakeryDiningOutlinedIcon from "@mui/icons-material/BakeryDiningOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

import { useEffect, useState } from "react";

import ImageUpload from "./ImageUpload";

import "./CakeForm.css";
import FormActions from "./FormActions";
import Service from "../../../../services/Service";
import { useNavigate } from "react-router-dom";

export default function CakeForm({
    initialValues = [],
    isEdit = false
}) {
    const emptyCake = {
        name: "",
        description: "",
        category: "",
        price: "",
        stockQuantity: "",
        isEggless: false,
        image: null,
        imageUrl : null
    };
  const navigate = useNavigate()
    const [cake, setCake] = useState(emptyCake);

    useEffect(() => {

        if (
            initialValues &&
            Object.keys(initialValues).length > 0
        ) {
            setCake(initialValues);
        }

    }, [initialValues]);

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const response = await Service.getAllCategories();

            setCategories(response.data);
        }
        catch (error) {
            console.error(error);
        }
    };

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setCake({
            ...cake,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleImageChange = (file) => {

        setCake({

            ...cake,

            image: file

        });

    };

    const handleSubmit = async () => {
        try {

            const formData = new FormData();

            formData.append("Name", cake.name);
            formData.append("Description", cake.description ?? "");
            formData.append("CategoryId", cake.category);
            formData.append("Price", Number(cake.price));
            formData.append("StockQuantity", Number(cake.stockQuantity));
            formData.append("IsEggless", cake.isEggless);

            if (isEdit) {

                formData.append("Id", initialValues.id);
                formData.append("IsAvailable", cake.isAvailable);

                if (cake.image instanceof File) {
                    // New image uploaded
                    formData.append("ImageFile", cake.image);
                }
                else {
                    // Keep existing image
                    formData.append("ImageUrl", cake.ImageUrl);
                }

                const res = await Service.updateCake(formData);

                console.log("Cake updated successfully.",res);
            }
            else {

                // Image is mandatory while creating
                formData.append("ImageFile", cake.image);

                const res =  await Service.createCake(formData);

                console.log("Cake created successfully.",res);
                navigate(`/admin/cakes`)
            }

        }
        catch (error) {
            console.error(error);
        }
    };

    return (

        <Card className="cake-form-card">

            <CardContent>

                <Box className="cake-form-header">

                    <Box className="cake-form-icon">

                        <BakeryDiningOutlinedIcon />

                    </Box>

                    <Box>

                        <Typography className="cake-form-title">

                            {

                                isEdit

                                    ?

                                    "Edit Cake"

                                    :

                                    "Add New Cake"

                            }

                        </Typography>

                        <Typography className="cake-form-subtitle">

                            {

                                isEdit

                                    ?

                                    "Update the cake information."

                                    :

                                    "Fill in the details to add a new cake."

                            }

                        </Typography>
                    </Box>

                </Box>

                <Grid
                    container
                    spacing={3}
                    sx={{ mt: 1 }}
                >

                    <Grid size={{ xs: 12, md: 6 }}>

                        <TextField

                            fullWidth

                            label="Cake Name"

                            name="name"

                            value={cake.name}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <TextField

                            fullWidth

                            label="Price (₹)"

                            name="price"

                            type="number"

                            value={cake.price}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid size={12}>

                        <TextField

                            fullWidth

                            multiline

                            rows={5}

                            label="Description"

                            name="description"

                            value={cake.description}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid size={12}>
                        <TextField
                            select
                            fullWidth
                            label="Category"
                            name="category"
                            value={cake.category}
                            onChange={handleChange}
                        >
                            {
                                categories.map(category => (
                                    <MenuItem
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.categoryName}
                                    </MenuItem>
                                ))
                            }
                        </TextField>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <TextField

                            fullWidth

                            label="Stock Quantity"

                            name="stockQuantity"

                            type="number"

                            value={cake.stockQuantity}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid
                        size={{ xs: 12, md: 6 }}
                        display="flex"
                        alignItems="center"
                    >

                        <FormControlLabel

                            control={

                                <Checkbox

                                    name="isEggless"

                                    checked={cake.isEggless}

                                    onChange={handleChange}

                                />

                            }

                            label="Eggless Cake"

                        />

                    </Grid>

                    <Grid size={12}>

                        <ImageUpload

                            image={cake.image}

                            onImageChange={handleImageChange}

                        />

                    </Grid>



                    <Grid size={12}>

                        {/* <Button

                            variant="contained"

                            startIcon={<SaveOutlinedIcon />}

                            className="save-cake-btn"

                            onClick={handleSubmit}

                        >

                            Save Cake

                        </Button> */}

                        <FormActions

                            submitText={

                                isEdit

                                    ?

                                    "Update Cake"

                                    :

                                    "Save Cake"

                            }

                            onSubmit={handleSubmit}

                        />

                    </Grid>

                </Grid>

            </CardContent>

        </Card>

    );

}