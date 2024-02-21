import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

function AddPlayer({ players, onSetPlayers }) {
    const [isEditing, setIsEditing] = useState(false);
    const [showError, setShowError] = useState(false);

    function handleClose() {
        setShowError(false);
        formik.resetForm();
        setIsEditing(false);
    }

    const formSchema = yup.object().shape({
        name: yup.string()
            .required("Please enter a name")
    });

    const formik = useFormik({
        initialValues: {
            name: ""
        },
        validationSchema: formSchema,
        onSubmit: (values, { resetForm }) => {
            fetch("/players", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values, null, 2)
            }).then((r) => {
                if (r.status === 201) {
                    r.json()
                    .then((player) => {
                        onSetPlayers([...players, player]);
                        handleClose();
                    });
                } else if (r.status === 422) {
                    setShowError(true);
                    resetForm();
                }
            });
        }
    });

    return (
        <div>
            {isEditing ? 
                <div className="add">
                    <h3>Add a Player</h3>
                    {showError ? <p style={{ color: "red" }}>There is already a player by that name</p> : null}
                    <form onSubmit={formik.handleSubmit}>
                        <input 
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Player's name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                        />
                        {formik.errors.name ? <p style={{ color: "red" }}>{formik.errors.name}</p> : null}
                        <button type="submit">Submit</button>
                    </form>
                    <button type="reset" onClick={handleClose}>Close</button>
                </div> 
                :
                <button onClick={() => setIsEditing(!isEditing)}>Add Player</button>
            }
        </div>
    );
}

export default AddPlayer;