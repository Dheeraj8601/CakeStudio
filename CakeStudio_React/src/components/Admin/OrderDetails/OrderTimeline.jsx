import {
    Card,
    CardContent,
    Divider,
    Step,
    StepLabel,
    Stepper,
    Typography
} from "@mui/material";

import "./OrderTimeline.css";

export default function OrderTimeline({ order }) {

    const steps = [

        "Placed",

        "Confirmed",

        "Processing",

        "Out for Delivery",

        "Delivered"

    ];

    const activeStep = steps.indexOf(order.orderStatus);

    return (

        <Card className="timeline-card">

            <CardContent>

                <Typography className="timeline-title">

                    Order Timeline

                </Typography>

                <Divider sx={{ mb: 4 }} />

                <Stepper

                    activeStep={activeStep}

                    orientation="vertical"

                >

                    {

                        steps.map(step => (

                            <Step

                                key={step}

                            >

                                <StepLabel>

                                    <Typography className="timeline-step">

                                        {step}

                                    </Typography>

                                </StepLabel>

                            </Step>

                        ))

                    }

                </Stepper>

            </CardContent>

        </Card>

    );

}