import {
    Box,
    Button,
    InputAdornment,
    MenuItem,
    TextField
} from "@mui/material";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

import "./ReviewsFilters.css";

export default function ReviewsFilters({

    search,
    setSearch,

    type,
    setType,

    status,
    setStatus

}) {

    const handleExport = () => {

        console.log("Export Reviews");

    };

    return (

        <Box className="reviews-filters">

            <TextField

                size="small"

                placeholder="Search by customer, email or order ID"

                value={search}

                onChange={(e) =>

                    setSearch(e.target.value)

                }

                className="review-search"

                InputProps={{

                    startAdornment:(

                        <InputAdornment position="start">

                            <SearchOutlinedIcon color="action"/>

                        </InputAdornment>

                    )

                }}

            />

            <TextField

                select

                size="small"

                value={status}

                onChange={(e)=>

                    setStatus(e.target.value)

                }

                className="review-filter"

            >

                <MenuItem value="All">

                    All Status

                </MenuItem>

                <MenuItem value="Published">

                    Published

                </MenuItem>

                <MenuItem value="New">

                    New

                </MenuItem>

                <MenuItem value="In Progress">

                    In Progress

                </MenuItem>

                <MenuItem value="Resolved">

                    Resolved

                </MenuItem>

            </TextField>

            <TextField

                size="small"

                type="date"

                className="review-date"

                InputProps={{

                    startAdornment:(

                        <InputAdornment position="start">

                            <CalendarTodayOutlinedIcon

                                fontSize="small"

                            />

                        </InputAdornment>

                    )

                }}

            />

            <Button

                variant="outlined"

                startIcon={<FileDownloadOutlinedIcon />}

                className="export-review-btn"

                onClick={handleExport}

            >

                Export

            </Button>

        </Box>

    );

}