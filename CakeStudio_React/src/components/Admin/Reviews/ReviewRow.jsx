import {
    Box,
    IconButton,
    TableCell,
    TableRow,
    Tooltip,
    Typography
} from "@mui/material";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";

import RatingStars from "./RatingStars";
import ReviewTypeChip from "./ReviewTypeChip";
import ReviewStatusChip from "./ReviewStatusChip";

import "./ReviewRow.css";
import dayjs from "dayjs";

export default function ReviewRow({

    review,

    onView,

    onReply

}) {

    return (

        <TableRow hover>

            <TableCell>

                <Box className="review-customer">

                    <Typography className="review-customer-name">

                        {review.customerName}

                    </Typography>

                    <Typography className="review-customer-email">

                        {review.email}

                    </Typography>

                    <Typography className="review-customer-mobile">

                        {review.mobile}

                    </Typography>

                </Box>

            </TableCell>

            {/* <TableCell align="center">

                <ReviewTypeChip

                    type={review.type}

                />

            </TableCell> */}

            <TableCell align="center">

                {review.orderId}

            </TableCell>

            <TableCell align="center">

                <RatingStars

                    rating={review.rating}

                />

            </TableCell>

            <TableCell>

                <Typography className="review-message">

                    {review.comment}

                </Typography>

            </TableCell>

            <TableCell align="center">

                <ReviewStatusChip

                    status={review.status}

                />

            </TableCell>

            <TableCell align="center">

                {dayjs(review.createdAt).format("DD MMMM YYYY")}

            </TableCell>

            <TableCell align="center">

                <Box className="review-actions">

                    <Tooltip title="View Details">

                        <IconButton

                            className="view-review-btn"

                            onClick={() => onView(review)}

                        >

                            <VisibilityOutlinedIcon />

                        </IconButton>

                    </Tooltip>

                    <Tooltip title="Reply">

                        <IconButton

                            className="reply-review-btn"

                            onClick={() => onReply(review)}

                        >

                            <ReplyOutlinedIcon />

                        </IconButton>

                    </Tooltip>

                </Box>

            </TableCell>

        </TableRow>

    );

}