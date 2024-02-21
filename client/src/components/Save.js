import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import Select from "react-select";

const options = [
    {value: "study", label: "To Study"},
    {value: "favorites", label: "Favorites"},
]

function Save({ saves, onSetSaves, onSetDisplay, game, category, onSetCategory }) {

        
    function handleSave(e) {
        e.preventDefault()
        fetch('/saves', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({category: category.value, game_id: game.id})
        })
        .then((r) => {
            if (r.status === 201) {
                r.json()
                .then((save) => {
                    onSetSaves([...saves, save])
                    onSetDisplay('game')
                })
            }
        })
    }

    return (
        <div className="add">
            <form onSubmit={handleSave}>
                <Select
                    options={options}
                    value={category}
                    placeholder='Choose a category'
                    onChange={(selected) => onSetCategory(selected)}
                />   
                <button className="submit-button" type="submit">Save</button>
                <button onClick={() => onSetDisplay('game')}>Close</button>                     
            </form>
        </div>

    )
}

export default Save