import {
    Avatar,
    Box,
    Button,
    Rating,
    TextField,
    Typography
} from "@mui/material";

import { useEffect, useState } from "react";

import { toast } from "react-toastify";

import Service from "../../../../services/Service";

export default function ReviewItem({

    item

}) {

    const [rating, setRating] = useState(5);
    const [reviewId, setReviewId] = useState();
    const [comment, setComment] = useState("");

    useEffect(() => {

        loadReview();

    }, []);

    const loadReview = async () => {

        try {

            const res =
                await Service.getReviewByOrderItem(
                    item.orderItemId
                );

            if (res.data) {

                setReviewId(res.data.reviewId);

                setRating(res.data.rating);

                setComment(res.data.comment);

            }

        }
        catch (err) {

            if (err.response?.status !== 204) {

                console.error(err);

            }

        }

    };

    const handleSubmit = async () => {

        if (reviewId) {

            await Service.updateReview({

                reviewId,

                rating,

                comment

            });

            toast.success("Review updated.");

        }
        else {

            await Service.createReview({

                orderItemId: item.orderItemId,

                cakeId: item.cakeId,

                rating,

                comment

            });

            toast.success("Review submitted.");

        }

    };

    return (

        <Box
            display="flex"
            gap={3}
            alignItems="flex-start"
        >

            <Avatar

                src={item.imageUrl}

                sx={{
                    width: 70,
                    height: 70
                }}

            />

            <Box flex={1}>

                <Typography
                    fontWeight={600}
                >

                    {item.cakeName}

                </Typography>

                <Rating

                    value={rating}

                    onChange={(_, value) =>

                        setRating(value)

                    }

                />

                <TextField

                    multiline

                    rows={3}

                    fullWidth

                    value={comment}

                    onChange={(e) =>

                        setComment(e.target.value)

                    }

                    placeholder="Share your experience..."

                    sx={{ mt: 2 }}

                />

                <Button
                    sx={{ mt: 2 }}
                    variant="contained"
                    onClick={handleSubmit}
                >
                    {reviewId ? "Update Review" : "Submit Review"}
                </Button>

            </Box>

        </Box>

    );

}