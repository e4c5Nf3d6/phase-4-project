import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import Select from "react-select";

const options = [
    {value: "study", label: "To Study"},
    {value: "favorites", label: "Favorites"},
];

function Save({ save, saves, onSetSaves, display, onSetDisplay, game }) {
    const [category, setCategory] = useState({value: 'all', label: 'Choose a Category'});
    
    useEffect(() => {
        if (display === 'editing save') {
            switch(save.category) {
                case 'study':
                    setCategory({value: "study", label: "To Study"});
                    break;
                case 'favorites':
                    setCategory({value: "favorites", label: "Favorites"});
                    break;
                default:
                    break;
            }
        }
    }, [display]);

    let initialValues = {
        game_id: game.id,
        category: 'all',
        comment: '' 
    }

    if (display === 'editing save') {
        initialValues = {
            game_id: game.id,
            category: save.category,
            comment: save.comment        
        }
    }

    function handleSelect(category) {
        formik.setFieldValue('category', category["value"]);
        setCategory(category);
    }

    function handleClose() {
        setCategory({value: 'all'});
        onSetDisplay('game');
        formik.resetForm();
    }

    const formSchema = yup.object().shape({
        category: yup.string(),
        comment: yup.string()
    });

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: formSchema,
        onSubmit: (values, { resetForm }) => {
            if (display === 'editing save') {
                fetch(`/saves/${save.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(values, null, 2)
                }).then((r) => {
                    if (r.status === 200) {
                        r.json()
                        .then((data) => {
                            onSetSaves(saves.map(save => {
                                if (save.id === data.id) {
                                    return data;
                                } else return save;
                            }));
                            handleClose();
                        });
                    }
                });
            } else {
                fetch("/saves", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(values, null, 2)
                }).then((r) => {
                    if (r.status === 201) {
                        r.json()
                        .then((save) => {
                            onSetSaves([...saves, save]);
                            resetForm();
                            setCategory({value: 'all', label: 'Choose a Category'});
                            onSetDisplay('game');
                        });
                    }
                });
            }
        }
    });

    return (
        <div className="add">
            <form onSubmit={formik.handleSubmit}>
                <div className={(display === 'editing save') ? "select-edit" : 'select'}>
                    {(display === 'editing save') ? <label htmlFor="category">Category:</label> : null}
                    <Select
                        id="category"
                        name="category"
                        options={options}
                        value={category}
                        onChange={(category) => handleSelect(category)}
                    />                
                </div>
                <div className={(display === 'editing save') ? "select-edit" : 'select'}>
                    {(display === 'editing save') ? <label htmlFor="comment">Comment:</label> : null}
                    <input
                        type="text"
                        id="comment"
                        name="comment"
                        placeholder="Add a Comment"
                        value={formik.values.comment}
                        onChange={formik.handleChange}   
                    />                
                </div>
                <button className="submit-button" type="submit">Save</button>
                <button onClick={handleClose}>Close</button>                     
            </form>
        </div>
    );
}

export default Save;