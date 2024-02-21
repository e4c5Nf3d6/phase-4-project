import React, {useState} from "react";
import GameDisplay from "./GameDisplay";
import useDocumentTitle from "../hooks/useDocumentTitle";

function SavedGames({ user, games, onSetGames, saves, onSetSaves, players, onSetPlayers}) {
    useDocumentTitle('Saved Games')

    const [visible, setVisible] = useState('all')

    const savesToShow = saves.filter((save) => {
        if (visible === 'all') {
            return true
        } else {
            console.log(save)
            console.log(save.category.includes(visible))
            return save.category.includes(visible)   
        } 
    })

    const gamesToShow = savesToShow.map((save) => {
        for (let i = 0; i < games.length; i++) {
            if (games[i].id ===  save.game.id) {
                return games[i]
            }
        }
    })

    return (
        <div>
            <h1>Saved Games</h1>
            <div className="options">
                <button 
                    className={(visible === 'all') ? 'active' : null}
                    onClick={() => setVisible('all')}
                >All</button>
                <button
                    className={(visible === 'study') ? 'active' : null}
                    onClick={() => setVisible('study')}                
                >To Study</button>
                <button
                    className={(visible === 'favorites') ? 'active' : null}
                    onClick={() => setVisible('favorites')}    
                >Favorites</button>
                <button
                    className={(visible === 'myGames') ? 'active' : null}
                    onClick={() => setVisible('myGames')}  
                >My Games</button>                
            </div>
            {visible === 'myGames' ?
                <div className="games-container">
                    {user.games.map(function(game) {
                        return (
                            <GameDisplay 
                                key={game.id} 
                                game={game} 
                                games={games}
                                onSetGames={onSetGames} 
                                players={players}
                                onSetPlayers={onSetPlayers}
                                user={user} 
                                saves={saves}
                                onSetSaves={onSetSaves}
                            />
                        )
                    })}  
                </div>              
                :
                <div className="games-container">
                    {gamesToShow.map(function(game) {
                        return (
                            <GameDisplay 
                                key={game.id} 
                                game={game} 
                                games={games}
                                onSetGames={onSetGames} 
                                players={players}
                                onSetPlayers={onSetPlayers}
                                user={user} 
                                saves={saves}
                                onSetSaves={onSetSaves}
                            />
                        )
                    })}
                </div>
            }
        </div>

    )
}

export default SavedGames