import {
    Box,
    Button,
    FormControl,
    MenuItem,
    Select,
    Typography
} from "@mui/material";

import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";

import "./WishlistHeader.css";

export default function WishlistHeader({

    totalItems,

    sortBy,

    onSortChange

}) {

    return (

        <Box className="wishlist-header">

            <Box>

                <Typography className="wishlist-title">

                    My Wishlist

                    <FavoriteBorderOutlinedIcon
                        className="wishlist-heart"
                    />

                </Typography>

                <Typography className="wishlist-subtitle">

                    Your favorite cakes, saved for later.

                </Typography>

            </Box>

            {/* <Button

                variant="outlined"

                startIcon={<ShareOutlinedIcon />}

                className="share-btn"

            >

                Share Wishlist

            </Button> */}

            <Box className="wishlist-toolbar">

                <Typography className="wishlist-count">

                    {totalItems} {totalItems === 1 ? "Item" : "Items"}

                </Typography>

                <Box className="sort-section">

                    <Typography>

                        Sort By :

                    </Typography>

                    <FormControl size="small">

                        <Select

                            value={sortBy}

                            onChange={(e) =>
                                onSortChange(e.target.value)
                            }

                        >

                            <MenuItem value="recent">

                                Recently Added

                            </MenuItem>

                            <MenuItem value="priceLow">

                                Price : Low to High

                            </MenuItem>

                            <MenuItem value="priceHigh">

                                Price : High to Low

                            </MenuItem>

                            <MenuItem value="rating">

                                Highest Rated

                            </MenuItem>

                        </Select>

                    </FormControl>

                </Box>

            </Box>

        </Box>

    );

}