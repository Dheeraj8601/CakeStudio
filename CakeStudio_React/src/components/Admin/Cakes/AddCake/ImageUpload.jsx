import {
    Box,
    Button,
    Typography
} from "@mui/material";

import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";

import { useRef } from "react";

import ImagePreview from "./ImagePreview";

import "./ImageUpload.css";

export default function ImageUpload({

    image,

    onImageChange

}) {
    const inputRef = useRef();

    const handleFile = (file) => {

        if (!file) return;

        if (!file.type.startsWith("image/")) {

            alert("Please select a valid image.");

            return;

        }

        if (file.size > 5 * 1024 * 1024) {

            alert("Image size should be less than 5 MB.");

            return;

        }

        onImageChange(file);

    };

    const handleChange = (event) => {

        handleFile(event.target.files[0]);

    };

    const handleDrop = (event) => {

        event.preventDefault();

        handleFile(event.dataTransfer.files[0]);

    };

    return (

        <>

            {

                image ?

                (

                    <ImagePreview

                        image={image}

                        onRemove={() => onImageChange(null)}

                    />

                )

                :

                (

                    <Box

                        className="upload-box"

                        onDragOver={(e) => e.preventDefault()}

                        onDrop={handleDrop}

                    >

                        <CloudUploadOutlinedIcon className="upload-icon" />

                        <Box className="upload-content">

                            <Typography>

                                Drag & drop an image here, or

                                <span

                                    className="browse-link"

                                    onClick={() => inputRef.current.click()}

                                >

                                    {" "}click to browse

                                </span>

                            </Typography>

                            <Typography className="upload-note">

                                PNG, JPG, JPEG up to 5MB

                            </Typography>

                        </Box>

                        <Button

                            variant="outlined"

                            className="browse-btn"

                            onClick={() => inputRef.current.click()}

                        >

                            Browse Files

                        </Button>

                        <input

                            hidden

                            type="file"

                            accept="image/*"

                            ref={inputRef}

                            onChange={handleChange}

                        />

                    </Box>

                )

            }

        </>

    );

}