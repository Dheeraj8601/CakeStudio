import { Box } from "@mui/material";
import { useEffect, useState } from "react";

import ReviewsHeader from "./ReviewsHeader";
import ReviewsFilters from "./ReviewsFilters";
import ReviewsTabs from "./ReviewsTabs";
import ReviewsTable from "./ReviewsTable";
import EmptyReviews from "./EmptyReviews";
import ReviewDetailsDialog from "./ReviewDetailsDialog";
import ReplyReviewDialog from "./ReplyReviewDialog";

import "./Reviews.css";
import Service from "../../../services/Service";

export default function Reviews() {

    const [reviews, setReviews] = useState([]);

    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(0);

    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [rating, setRating] = useState(null);
    const [search, setSearch] = useState("");

    const [type, setType] = useState("All");

    const [status, setStatus] = useState("All");

    const [tab, setTab] = useState("All");

    const [selectedReview, setSelectedReview] = useState(null);

    const [openDetails, setOpenDetails] = useState(false);

    const [openReply, setOpenReply] = useState(false);

    useEffect(() => {

        loadReviews();

    }, [search, page, rowsPerPage, rating]);

    const loadReviews = async () => {

        try {

            const response =
                await Service.getReviews({

                    search,

                    rating,

                    pageNumber: page + 1,

                    pageSize: rowsPerPage

                });

                const data = response.data.data
                console.log(data,"data ll")

            setReviews(data);

            setTotalRecords(response.data.totalRecords);

        }
        catch (error) {

            console.error(error);

        }

    };

    return (

        <Box className="reviews-page">

            <ReviewsHeader />

            <ReviewsFilters

                search={search}
                setSearch={setSearch}

                type={type}
                setType={setType}

                status={status}
                setStatus={setStatus}

            />

            {

                reviews.length === 0 ?

                    <EmptyReviews />

                    :

                    <ReviewsTable

                        reviews={reviews}

                        onView={(review) => {

                            setSelectedReview(review);

                            setOpenDetails(true);

                        }}

                        onReply={(review) => {

                            setSelectedReview(review);

                            setOpenReply(true);

                        }}

                    />

            }

            <ReviewDetailsDialog

                open={openDetails}

                review={selectedReview}

                onClose={() =>

                    setOpenDetails(false)

                }

            />

            <ReplyReviewDialog

                open={openReply}

                review={selectedReview}

                onClose={() =>

                    setOpenReply(false)

                }

            />

        </Box>

    );

}