import React, { useState } from "react";

function Save({ game, saves, onSetSaves }) {
    let save = null

    for (let i = 0; i < saves.length; i++) {
        if (saves[i].game.id === game.id) {
            save = saves[i]
        }
    }

    function handleSave() {
        fetch('/saves', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({category: "save", game_id: game.id})
        })
        .then((r) => {
            if (r.status === 201) {
                r.json()
                .then((save) => {
                    onSetSaves([...saves, save])
                })
            }
        })
    }

    function handleRemove() {
        fetch(`/saves/${save.id}`, { method: 'DELETE' })
        .then((r) => {
            if (r.status === 204) {
                onSetSaves(saves.filter(s => s.id !== save.id))
            }
        }) 
    }

    return (
        <>
            {save ?
                <button onClick={handleRemove}><img id="saved" src="/saved.png" alt="saved icon" /></button>
                :
                <button onClick={handleSave}><img id="save" src="/save.png" alt="save icon" /></button>
            }
        </>
    )
}

export default Save