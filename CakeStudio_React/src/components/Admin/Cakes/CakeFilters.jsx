import {
    Box,
    Button,
    InputAdornment,
    MenuItem,
    TextField
} from "@mui/material";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";

import "./CakeFilters.css";

export default function CakeFilters({

    search,
    setSearch,

    category,
    setCategory,

    minPrice,
    setMinPrice,

    maxPrice,
    setMaxPrice,

    categories

}) {

    const handleReset = () => {

        setSearch("");

        setCategory("");

        setMinPrice("");

        setMaxPrice("");

    };

    return (

        <Box className="cake-filters">

            <TextField

                placeholder="Search cakes..."

                size="small"

                value={search}

                onChange={(e) =>

                    setSearch(e.target.value)

                }

                className="cake-search"

                InputProps={{

                    startAdornment: (

                        <InputAdornment position="start">

                            <SearchOutlinedIcon />

                        </InputAdornment>

                    )

                }}

            />

            <TextField

                select

                size="small"

                value={category}

                onChange={(e) =>

                    setCategory(e.target.value)

                }

                className="cake-filter"

            >

                <MenuItem value="">

                    All Categories

                </MenuItem>

                {

                    categories?.map(category => (

                        <MenuItem

                            key={category.id}

                            value={category.categoryName}

                        >

                            {category.categoryName}

                        </MenuItem>

                    ))

                }

            </TextField>

            <TextField

                size="small"

                type="number"

                label="Min Price"

                value={minPrice}

                onChange={(e) =>

                    setMinPrice(e.target.value)

                }

                className="cake-price"

            />

            <TextField

                size="small"

                type="number"

                label="Max Price"

                value={maxPrice}

                onChange={(e) =>

                    setMaxPrice(e.target.value)

                }

                className="cake-price"

            />

            <Button

                variant="outlined"

                startIcon={<RestartAltOutlinedIcon />}

                className="cake-reset-btn"

                onClick={handleReset}

            >

                Reset

            </Button>

        </Box>

    );

}