import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import CreatableSelect from 'react-select/creatable';
import useSelectData from "../hooks/useSelectData";


function EditGame({ game, games, onSetGames, players, onSetPlayers, onSetIsEditing }) {
    const [showError, setShowError] = useState(false)
    const [white, setWhite] = useState({ value: game.white_player.name, label: game.white_player.name})
    const [black, setBlack] = useState({ value: game.black_player.name, label: game.black_player.name})

    const options = [
        ...players.map((player) => ({ value: player.name, label: player.name}))
    ];

    function handleClose() {
        formik.resetForm()
        setShowError(false)
        setWhite(null)
        setBlack(null)
        onSetIsEditing(false)
    }

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
            pgn: game.pgn,
            white_player: game.white_player.name,
            black_player: game.black_player.name
        },
        validateOnChange: false,
        validationSchema: formSchema,
        onSubmit: (values, { resetForm }) => {
            fetch(`/games/${game.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values, null, 2)
            }).then((r) => {
                if (r.status == 200) {
                    r.json()
                    .then((data) => {
                        onSetGames(games.map(game => {
                            if (game.id === data.id) {
                                return data
                            } else return game
                        }))
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
    )
}

export default EditGame