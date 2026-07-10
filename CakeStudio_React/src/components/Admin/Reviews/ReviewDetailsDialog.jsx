import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    Paper,
    Typography
} from "@mui/material";

import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";

import dayjs from "dayjs";

import RatingStars from "./RatingStars";
import ReviewStatusChip from "./ReviewStatusChip";

import "./ReviewDetailsDialog.css";

export default function ReviewDetailsDialog({

    open,

    review,

    onClose

}) {

    if (!review) return null;

    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >

            <DialogTitle className="review-dialog-title">

                Review Details

            </DialogTitle>

            <DialogContent>

                <Grid
                    container
                    spacing={3}
                >

                    <Grid size={{ xs: 12, md: 6 }}>

                        <Paper className="review-card">

                            <Box className="review-row">

                                <PersonOutlineOutlinedIcon />

                                <Box>

                                    <Typography className="info-label">

                                        Customer

                                    </Typography>

                                    <Typography className="info-value">

                                        {review.customerName}

                                    </Typography>

                                </Box>

                            </Box>

                        </Paper>

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <Paper className="review-card">

                            <Box className="review-row">

                                <EmailOutlinedIcon />

                                <Box>

                                    <Typography className="info-label">

                                        Email

                                    </Typography>

                                    <Typography className="info-value">

                                        {review.email}

                                    </Typography>

                                </Box>

                            </Box>

                        </Paper>

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <Paper className="review-card">

                            <Box className="review-row">

                                <ReceiptLongOutlinedIcon />

                                <Box>

                                    <Typography className="info-label">

                                        Order ID

                                    </Typography>

                                    <Typography className="info-value">

                                        #{review.orderId}

                                    </Typography>

                                </Box>

                            </Box>

                        </Paper>

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <Paper className="review-card">

                            <Box className="review-row">

                                <CalendarTodayOutlinedIcon />

                                <Box>

                                    <Typography className="info-label">

                                        Submitted On

                                    </Typography>

                                    <Typography className="info-value">

                                        {dayjs(review.createdAt).format("DD MMM YYYY")}

                                    </Typography>

                                </Box>

                            </Box>

                        </Paper>

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <Paper className="review-card">

                            <Typography className="info-label">

                                Rating

                            </Typography>

                            <RatingStars
                                rating={review.rating}
                            />

                        </Paper>

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <Paper className="review-card">

                            <Typography className="info-label">

                                Status

                            </Typography>

                            <ReviewStatusChip
                                status={review.status}
                            />

                        </Paper>

                    </Grid>

                </Grid>

                <Divider className="section-divider" />

                <Box className="message-card">

                    <Box className="message-header">

                        <ChatBubbleOutlineOutlinedIcon />

                        <Typography>

                            Customer Review

                        </Typography>

                    </Box>

                    <Typography className="review-message-full">

                        {review.comment}

                    </Typography>

                </Box>

                {

                    review.status === "Replied" &&

                    <>

                        <Divider className="section-divider" />

                        <Box className="message-card reply-card">

                            <Box className="message-header">

                                <ReplyOutlinedIcon />

                                <Typography>

                                    Admin Reply

                                </Typography>

                            </Box>

                            <Typography className="review-message-full">

                                {review.reply}

                            </Typography>

                        </Box>

                    </>

                }

            </DialogContent>

            <DialogActions
                sx={{
                    px: 3,
                    pb: 3
                }}
            >

                <Button

                    variant="contained"

                    className="close-review-btn"

                    onClick={onClose}

                >

                    Close

                </Button>

            </DialogActions>

        </Dialog>

    );

}