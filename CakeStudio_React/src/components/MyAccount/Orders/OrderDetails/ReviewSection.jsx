import {
    Card,
    CardContent,
    Typography,
    Divider
} from "@mui/material";

import ReviewItem from "./ReviewItem";

export default function ReviewSection({

    items

}) {

    return (

        <Card>

            <CardContent>

                <Typography
                    variant="h6"
                    fontWeight={700}
                    mb={2}
                >

                    Rate Your Cakes

                </Typography>

                {

                    items.map(item => (

                        <div key={item.cakeId}>

                            <ReviewItem
                                item={item}
                            />

                            <Divider sx={{ my: 2 }} />

                        </div>

                    ))

                }

            </CardContent>

        </Card>

    );

}