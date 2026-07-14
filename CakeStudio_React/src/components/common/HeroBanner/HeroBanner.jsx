import { Box, Button, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import "./HeroBanner.css";
import heroImage from "../../../assets/images/logo/hero_img.png"
import h1 from "../../../assets/images/logo/h1.png"
import h2 from "../../../assets/images/logo/h2.png"
import h3 from "../../../assets/images/logo/h4.png"
import { useNavigate } from "react-router-dom";

const HeroBanner = ({ banner }) => {
    const navigate = useNavigate()
    return (
        <Box className="hero-banner">

            <Box className="hero-content">

                <Typography className="hero-title">
                    {banner.title}
                    <br />
                    <span>{banner.highlight}</span>
                </Typography>

                <Typography
                    className="hero-description"
                >
                    {banner.description}
                </Typography>

                <Button
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    className="hero-btn"
                    onClick={() => navigate("/cakes")}
                >
                    {banner.buttonText}
                </Button>

            </Box>

            <Box
                component="img"
                src={h3}
                alt="Cake"
                className="hero-image"
            />

        </Box>
    );
};

export default HeroBanner;