import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography
} from "@mui/material";

import SendOutlinedIcon from "@mui/icons-material/SendOutlined";

import { useEffect, useState } from "react";

import "./ReplyReviewDialog.css";
import Service from "../../../services/Service";
import { toast } from "react-toastify";

export default function ReplyReviewDialog({

    open,

    review,

    onClose

}) {

    const [reply, setReply] = useState("");

    useEffect(() => {

        if (open) {

            setReply("");

        }

    }, [open]);

    const handleSend = async () => {

        try {

            await Service.replyReview({

                reviewId: review.reviewId,

                reply

            });

            toast.success(
                "Reply sent successfully."
            );

            onClose();

        }
        catch (err) {

            toast.error(
                "Unable to send reply."
            );

        }

    };

    if (!review) return null;

    return (

        <Dialog

            open={open}

            onClose={onClose}

            fullWidth

            maxWidth="sm"

        >

            <DialogTitle>

                Reply to Customer

            </DialogTitle>

            <DialogContent>

                <Box className="reply-dialog">

                    <Box className="reply-customer-card">

                        <Typography className="reply-customer-name">

                            {review.customerName}

                        </Typography>

                        <Typography className="reply-customer-email">

                            {review.email}

                        </Typography>
                    </Box>

                    <Box className="reply-message-card">

                        <Typography className="reply-label">

                            Customer Message

                        </Typography>

                        <Typography className="customer-message">

                            {review.comment}

                        </Typography>

                    </Box>

                    {review.status === 'Replied' ?
                        <Box className="reply-message-card2">

                            <Typography className="reply-label">

                                Admin Reply

                            </Typography>

                            <Typography className="customer-message">

                                {review.reply}

                            </Typography>

                        </Box>
                        :
                        ''
                    }

                    {review.status !== 'Replied' ? <TextField

                        fullWidth

                        multiline

                        rows={5}

                        label="Your Reply"

                        placeholder="Write your response to the customer..."

                        value={reply}

                        onChange={(e) =>

                            setReply(e.target.value)

                        }

                    />
                        :
                        ''
                    }

                </Box>

            </DialogContent>

            <DialogActions>

                <Button

                    onClick={onClose}

                >

                    Cancel

                </Button>

                {review.status !== 'Replied' ? <Button

                    variant="contained"

                    className="send-reply-btn"

                    startIcon={<SendOutlinedIcon />}

                    disabled={!reply.trim()}

                    onClick={handleSend}

                >

                    Send Reply

                </Button>
                    :
                    ''
                }

            </DialogActions>

        </Dialog>

    );

}