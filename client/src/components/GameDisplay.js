import React, { useState } from "react";
import EditGame from "./EditGame";

function GameDisplay({ game, games, onSetGames, players, onSetPlayers, user }) {
    const [display, setDisplay] = useState('game')

    let canEdit = false
    if (user) {
        if (user.id == game.user_id) {
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
                    <button onClick={() => setDisplay('game')}>Close</button>
                </div>
                : null
            }
        </div>
    )
}

export default GameDisplay