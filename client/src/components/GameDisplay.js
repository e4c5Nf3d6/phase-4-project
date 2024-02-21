import React, { useState } from "react";
import EditGame from "./EditGame";
import Save from "./Save";
import Select from "react-select";

const options = [
    {value: "study", label: "To Study"},
    {value: "favorites", label: "Favorites"},
]

function GameDisplay({ game, games, onSetGames, players, onSetPlayers, user, saves, onSetSaves }) {
    const [display, setDisplay] = useState('game')
    const [category, setCategory] = useState({value: 'all'})

    let canEdit = false
    if (user) {
        if (user.id === game.user_id) {
            canEdit = true
        }
    }

    function handleDelete() {
        fetch(`/games/${game.id}`, { method: 'DELETE' })
        .then((r) => {
            if (r.status == 204) {
                onSetGames(games.filter(g => g.id !== game.id))
            }
        })
    }
    
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
                    setDisplay('game')
                })
            }
        })
    }

    return (
        <div className="game">
            <div className="game-title">
                <h3>{game.white_player.name} - {game.black_player.name}</h3>
                {canEdit ? 
                    <button onClick={() => {display === 'editing' ? setDisplay('game') : setDisplay('editing')}}><img id="edit" src="/edit.png" alt="edit icon" /></button>               
                    : null
                }
                {canEdit ? 
                    <button onClick={() => setDisplay('delete')}><img id="delete" src="/delete.png" alt="delete icon" /></button>               
                    : null
                }
                {user ?
                    <Save 
                        game={game} 
                        saves={saves} 
                        onSetSaves={onSetSaves} 
                        onSetDisplay={setDisplay}
                    />
                    : null
                }
            </div>
            {display === 'game' ? 
                <ct-pgn-viewer 
                    move-list-moveListStyle='twocolumn'
                    board-boardStyle='brown'
                    board-resizable='true'
                    board-allowdrawing='true'
                    board-size='400px'
                    board-highlight-move-square-colour='false'
                    board-disable-sound='true'
                >
                    {game.pgn}
                </ct-pgn-viewer> 
                : null              
            }
            {display === 'editing' ? 
                <EditGame 
                    game={game} 
                    games={games}
                    onSetGames={onSetGames} 
                    players={players}
                    onSetPlayers={onSetPlayers}
                    user={user}  
                    onSetDisplay={setDisplay}               
                />
                : null               
            }
            {display === 'delete' ?
                <div className="warning">
                    <h3>Delete Game?</h3>
                    <p>This action cannot be undone.</p>
                    <button className="confirm-button" onClick={handleDelete}>Delete</button>
                    <button onClick={() => {
                        setDisplay('game')
                        setCategory({value: 'all'})
                        }}>Close</button>
                </div>
                : null
            }
            {display === 'save' ?
                <div className="add">
                    <form onSubmit={handleSave}>
                        <Select
                            options={options}
                            value={category}
                            placeholder='Choose a category'
                            onChange={(selected) => setCategory(selected)}
                        />   
                        <button className="submit-button" type="submit">Save</button>
                        <button onClick={() => setDisplay('game')}>Close</button>                     
                    </form>

                </div>
                : null
            }
        </div>
    )
}

export default GameDisplay