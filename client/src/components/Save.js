import React from "react";

function Save({ game, saves, onSetSaves, onSetDisplay }) {
    let save = null

    for (let i = 0; i < saves.length; i++) {
        if (saves[i].game.id === game.id) {
            save = saves[i]
        }
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
                <button onClick={() => onSetDisplay('save')}><img id="save" src="/save.png" alt="save icon" /></button>
            }
        </>
    )
}

export default Save