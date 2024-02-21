import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import Select from "react-select";

const options = [
    {value: "study", label: "To Study"},
    {value: "favorites", label: "Favorites"},
]

function Save({ saves, onSetSaves, onSetDisplay, game, category, onSetCategory }) {
        
    // function handleSave(e) {
    //     e.preventDefault()
    //     fetch('/saves', {
    //         method: 'POST',
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify({category: category.value, game_id: game.id})
    //     })
    //     .then((r) => {
    //         if (r.status === 201) {
    //             r.json()
    //             .then((save) => {
    //                 onSetSaves([...saves, save])
    //                 onSetDisplay('game')
    //             })
    //         }
    //     })
    // }

    function handleSelect(category) {
        console.log(category)
        formik.setFieldValue('category', category["value"]);
        onSetCategory(category)
        console.log(formik.values)
    }

    function handleClose() {
        onSetCategory({value: 'all'})
        onSetDisplay('game')
        formik.resetForm()
    }

    const formSchema = yup.object().shape({
        category: yup.string()
    });

    const formik = useFormik({
        initialValues: {
            game_id: game.id,
            category: 'all' 
        },
        validationSchema: formSchema,
        onSubmit: (values, { resetForm }) => {
            fetch("/saves", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values, null, 2)
            }).then((r) => {
                if (r.status == 201) {
                    r.json()
                    .then((save) => {
                        onSetSaves([...saves, save])
                        resetForm()
                        onSetDisplay('game')
                    })
                }
            })
        }
    })


    return (
        <div className="add">
            <form onSubmit={formik.handleSubmit}>
                <Select
                    options={options}
                    value={category}
                    placeholder='Choose a category'
                    onChange={(category) => handleSelect(category)}
                />   
                <button className="submit-button" type="submit">Save</button>
                <button onClick={handleClose}>Close</button>                     
            </form>
        </div>

    )
}

export default Save