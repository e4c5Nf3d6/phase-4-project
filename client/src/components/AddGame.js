import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import CreatableSelect from 'react-select/creatable';
import useSelectData from "../hooks/useSelectData";


function AddGame({ games, onSetGames, players, onSetPlayers }) {
    const [isEditing, setIsEditing] = useState(false)
    const [showError, setShowError] = useState(false)
    const [white, setWhite] = useState(null)
    const [black, setBlack] = useState(null)

    const options = [
        ...players.map((player) => ({ value: player.name, label: player.name}))
    ];

    function handleClose() {
        formik.resetForm()
        setShowError(false)
        setWhite(null)
        setBlack(null)
        setIsEditing(false)
    }

    // function handleSelect(color, player) {
    //     if (player == null) {
    //         formik.setFieldValue(color, '');   
    //     } else {
    //         formik.setFieldValue(color, player["value"]);
    //     }

    //     if (color == "white_player") {
    //         setWhite(player)
    //     } else if (color == "black_player") {
    //         setBlack(player)
    //     }
    // }

    // function handleCreate(color, newPlayer) {
    //     fetch("/players", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify({name: newPlayer}, null, 2)
    //     }).then((r) => {
    //         if (r.status == 201) {
    //             r.json()
    //             .then((player) => {
    //                 onSetPlayers([...players, player])
                    
    //                 if (color == "white_player") {
    //                     setWhite({ value: player.name, label: player.name })
    //                 } else if (color == "black_player") {
    //                     setBlack({ value: player.name, label: player.name })
    //                 }
    //             })
    //         }
    //     })
    // }

    const formSchema = yup.object().shape({
        pgn: yup.string()
            .required("Please enter the PGN for the game"),
        white_player: yup.string()
            .required("Please choose the player with the white pieces"),
        black_player: yup.string()
            .required("Please choose the player with the white pieces"),
    });

    const formik = useFormik({
        initialValues: {
            pgn: "",
            white_player: "",
            black_player: ""
        },
        validateOnChange: false,
        validationSchema: formSchema,
        onSubmit: (values, { resetForm }) => {
            fetch("/games", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values, null, 2)
            }).then((r) => {
                if (r.status == 201) {
                    r.json()
                    .then((game) => {
                        onSetGames([...games, game])
                        handleClose()
                    })
                } else if (r.status == 422) {
                    setShowError(true)
                    resetForm()
                }
            })
        }
    })

    const { handleSelect, handleCreate } = useSelectData(formik, setWhite, setBlack, players, onSetPlayers)

    return (
        <div>
            {isEditing ? 
                <div className="add">
                    <h3>Add a Game</h3>
                    {showError ? <p style={{ color: "red" }}>Failed PGN Validation</p> : null}
                    <form onSubmit={formik.handleSubmit}>
                        <input 
                            type="text"
                            id="pgn"
                            name="pgn"
                            placeholder="Game PGN"
                            value={formik.values.pgn}
                            onChange={formik.handleChange}
                        />
                        {formik.errors.pgn ? <p style={{ color: "red" }}> {formik.errors.pgn}</p> : null}
                        <div className="select">
                            <CreatableSelect
                                isClearable
                                onChange={(player) => handleSelect('white_player', player)}
                                options={options}
                                placeholder="Choose the player with the white pieces"
                                value={white}
                                onCreateOption={(newPlayer) => handleCreate('white_player', newPlayer)}
                                menuPortalTarget={document.body} 
                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                            />
                            {formik.errors.white_player ? <p style={{ color: "red" }}> {formik.errors.white_player}</p> : null}
                        </div>
                        <div className="select">
                            <CreatableSelect
                                isClearable
                                onChange={(player) => handleSelect('black_player', player)}
                                options={options}
                                placeholder="Choose the player with the black pieces"
                                value={black}
                                onCreateOption={(newPlayer) => handleCreate('black_player', newPlayer)}
                                menuPortalTarget={document.body} 
                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                            />
                            {formik.errors.black_player ? <p style={{ color: "red" }}> {formik.errors.black_player}</p> : null}
                        </div>
                        <button type="submit">Submit</button>
                    </form>
                    <button type="reset" onClick={handleClose}>Close</button>
                </div> 
                :
                <button onClick={() => setIsEditing(!isEditing)}>Add Game</button>
            }
        </div>
    )
}

export default AddGame