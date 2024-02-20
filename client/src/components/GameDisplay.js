import React, { useState } from "react";
import EditGame from "./EditGame";

function GameDisplay({ game, games, onSetGames, players, onSetPlayers, user }) {
    const [isEditing, setIsEditing] = useState(false)

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
                    <button onClick={() => setIsEditing(true)}><img id="edit" src="/edit.png" alt="edit icon" /></button>               
                    : null
                }
                {canEdit ? 
                    <button onClick={handleDelete}><img id="delete" src="/delete.png" alt="delete icon" /></button>               
                    : null
                }
            </div>
            {isEditing? 
                <EditGame 
                    game={game} 
                    games={games}
                    onSetGames={onSetGames} 
                    players={players}
                    onSetPlayers={onSetPlayers}
                    user={user}  
                    onSetIsEditing={setIsEditing}               
                />
                :
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
                
            }

        </div>
    )
}

export default GameDisplay