import {
    Avatar,
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Rating,
    Typography
} from "@mui/material";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import { useEffect, useState } from "react";

import dayjs from "dayjs";

import Service from "../../../services/Service";

export default function ReviewsDialog({

    open,

    onClose,

    cakeId

}) {

    const [reviews, setReviews] = useState([]);

    useEffect(() => {

        if (open) {

            loadReviews();

        }

    }, [open, cakeId]);

    const loadReviews = async () => {

        try {

            const res =
                await Service.getCakeReviews(cakeId);

            setReviews(res.data.slice(0, 5));

        }
        catch (err) {

            console.error(err);

        }

    };

    return (

        <Dialog

            open={open}

            onClose={onClose}

            fullWidth

            maxWidth="sm"

            PaperProps={{
                sx: {
                    borderRadius: "22px",
                    overflow: "hidden"
                }
            }}

        >

            <DialogTitle
                sx={{
                    background: "#fff6f8",
                    borderBottom: "1px solid #f8d9e3",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 2.5
                }}
            >

                <Typography
                    sx={{
                        fontSize: 24,
                        fontWeight: 700,
                        color: "#2f2f2f"
                    }}
                >

                    Customer Reviews

                </Typography>

                <IconButton
                    onClick={onClose}
                >

                    <CloseOutlinedIcon />

                </IconButton>

            </DialogTitle>

            <DialogContent
                sx={{
                    p: 3,
                    background: "#fff",
                    maxHeight: 550
                }}
            >

                {

                    reviews.length === 0 &&

                    <Box
                        py={8}
                        textAlign="center"
                    >

                        <Typography
                            sx={{
                                color: "#888",
                                fontSize: 17
                            }}
                        >

                            No reviews yet.

                        </Typography>

                    </Box>

                }

                {

                    reviews.map(review => (

                        <Paper

                            key={review.reviewId}

                            elevation={0}

                            sx={{

                                mb: 2,

                                p: 2.5,

                                border: "1px solid #f5dce3",

                                borderRadius: "16px",

                                background: "#fffafb"

                            }}

                        >

                            <Box

                                display="flex"

                                justifyContent="space-between"

                                alignItems="center"

                            >

                                <Box

                                    display="flex"

                                    alignItems="center"

                                    gap={2}

                                >

                                    <Avatar

                                        sx={{

                                            bgcolor: "#ff5b84",

                                            width: 48,

                                            height: 48,

                                            fontWeight: 700

                                        }}

                                    >

                                        {

                                            review.userName

                                                ?.charAt(0)

                                                ?.toUpperCase()

                                        }

                                    </Avatar>

                                    <Box>

                                        <Typography

                                            fontWeight={700}

                                            fontSize={16}

                                        >

                                            {review.userName}

                                        </Typography>

                                        <Typography

                                            sx={{

                                                color: "#888",

                                                fontSize: 13

                                            }}

                                        >

                                            {

                                                dayjs(review.createdAt)

                                                    .format(

                                                        "DD MMM YYYY"

                                                    )

                                            }

                                        </Typography>

                                    </Box>

                                </Box>

                                <Box

                                    sx={{

                                        background: "#fff2f6",

                                        px: 1.5,

                                        py: .6,

                                        borderRadius: "20px"

                                    }}

                                >

                                    <Rating

                                        readOnly

                                        size="small"

                                        value={review.rating}

                                    />

                                </Box>

                            </Box>

                            {

                                review.comment &&

                                <Typography

                                    sx={{

                                        mt: 2,

                                        color: "#555",

                                        lineHeight: 1.7,

                                        fontSize: 15

                                    }}

                                >

                                    {review.comment}

                                </Typography>

                            }

                            {

                                review.status === "Replied" &&

                                <Box
                                    sx={{
                                        mt: 3,
                                        p: 2.5,
                                        border: "1px solid #d8efe4",
                                        borderRadius: "14px",
                                        background: "#f8fffb"
                                    }}
                                >

                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                            mb: 1.5
                                        }}
                                    >

                                        <ReplyOutlinedIcon
                                            sx={{
                                                color: "#27ae60"
                                            }}
                                        />

                                        <Typography
                                            sx={{
                                                fontWeight: 700,
                                                color: "#27ae60",
                                                fontSize: 16
                                            }}
                                        >

                                            CakeStudio Response

                                        </Typography>

                                    </Box>

                                    <Typography
                                        sx={{
                                            color: "#555",
                                            lineHeight: 1.8,
                                            fontSize: 15
                                        }}
                                    >

                                        {review.reply}

                                    </Typography>

                                    {

                                        review.reviewCommentedDate &&

                                        <Typography
                                            sx={{
                                                mt: 2,
                                                fontSize: 13,
                                                color: "#888",
                                                fontStyle: "italic"
                                            }}
                                        >

                                            Replied on{" "}
                                            {
                                                dayjs(review.reviewCommentedDate)
                                                    .format("DD MMM YYYY • hh:mm A")
                                            }

                                        </Typography>

                                    }

                                </Box>

                            }

                        </Paper>

                    ))

                }

            </DialogContent>

        </Dialog>

    );

}