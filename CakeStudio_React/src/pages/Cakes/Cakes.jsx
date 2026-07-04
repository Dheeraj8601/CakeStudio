import { Box } from "@mui/material";
import CakeComponent from "../../components/Cakes/Cakes";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

export default function Cakes(props) {
    const params = useParams()
    const [search] = useSearchParams();
    const category = search.get("category");
    let navigate = useNavigate()
    return (
        <Box>
            <CakeComponent
                {...props}
                navigate={navigate}
                id={params.id}
                categoryParams = {Number(category)}
            />
        </Box>
    )
}