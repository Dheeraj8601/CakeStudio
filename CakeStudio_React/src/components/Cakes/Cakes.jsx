import { Box, Grid } from "@mui/material";

import Breadcrumb from "../common/Breadcrumb/Breadcrumb";
import CakeToolbar from "../common/CakeToolbar/CakeToolbar";
import FilterSidebar from "../common/FilterSidebar/FilterSidebar";
import CakeGrid from "../common/CakeGrid/CakeGrid";
import PaginationComponent from "../common/Pagination/PaginationComponent";

import useCakeFilters from "../../hooks/useCakeFilters";
import useCakeCatalog from "../../hooks/useCakeCatalog"
import { cakes} from "./cakeData";
export default function CakeComponent(props) {

    const cake = useCakeCatalog(props.categoryParams);
    console.log(cake,"111")
    return (

        <Box sx={{ px: 4, py: 3 }}>

            <Breadcrumb
                items={[
                    { label: "Home", path: "/" },
                    { label: "Cakes" }
                ]}
            />

            <Grid container spacing={4}>

                {/* Left Sidebar */}

                <Grid size={{ xs: 12, md: 3 }}>

                    <FilterSidebar

                        selectedCategories={cake.selectedCategories}

                        selectedRatings={cake.selectedRatings}

                        priceRange={cake.priceRange}

                        onCategoryChange={cake.handleCategoryChange}

                        onRatingChange={cake.handleRatingChange}

                        onPriceChange={(e, value) =>
                            cake.setPriceRange(value)
                        }

                        onApply={() => { }}

                        onClear={cake.handleClear}

                    />

                </Grid>

                {/* Right Side */}

                <Grid size={{ xs: 12, md: 9 }}>

                    <CakeToolbar

                        title="All Cakes"

                        totalItems={cake.totalRecords}

                        sortBy={cake.sortBy}

                        showCount={cake.pageSize}

                        view={cake.view}

                        onSortChange={(e) =>
                            cake.setSortBy(e.target.value)
                        }

                        onShowCountChange={(e) =>
                            cake.setPageSize(Number(e.target.value))
                        }

                        onViewChange={(e, value) =>
                            value && cake.setView(value)
                        }

                    />

                    <CakeGrid

                        cakes={cake.cakes}

                        view={cake.view}
                    />

                    <PaginationComponent

                        page={cake.page}

                        totalPages={cake.totalPages}

                        totalItems={cake.totalRecords}

                        currentItems={cake.cakes.length}

                        onPageChange={(e, value) =>
                            cake.setPage(value)
                        }

                    />

                </Grid>

            </Grid>

        </Box>

    );

}