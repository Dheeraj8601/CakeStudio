import {
    Checkbox,
    FormControlLabel
} from "@mui/material";

export default function CategoryFilter({

    categories,

    selectedCategories,

    onChange

}) {

    return (

        <>

            {

                categories.map(category => (

                    <FormControlLabel

                        key={category.id}

                        control={

                            <Checkbox

                                checked={selectedCategories.includes(category.id)}

                                onChange={() => onChange(category.id)}

                            />

                        }

                        label={category.name}

                    />

                ))

            }

        </>

    );

}