import React, { useState } from "react";
import Players from "./Players";
import Games from "./Games";

function Home({ user, players, onSetPlayers, games, onSetGames, saves, onSetSaves }) {
    const [activePlayerID, setActivePlayerID] = useState('all')

    const filteredGames = games.filter((game) => {
        if (activePlayerID === 'all') {
            return true
        } else return (game.white_player_id === activePlayerID || game.black_player_id === activePlayerID)
    })

    return (
        <div>
            <h1>Home Page</h1>
            <div className="main-content">
                <Players 
                    user={user} 
                    players={players} 
                    onSetPlayers={onSetPlayers} 
                    activePlayerID={activePlayerID}
                    onSetActivePlayerID={setActivePlayerID}
                />
                <Games 
                    user={user} 
                    games={filteredGames} 
                    onSetGames={onSetGames} 
                    players={players}
                    onSetPlayers={onSetPlayers}
                    saves={saves}
                    onSetSaves={onSetSaves}
                />
            </div>
        </div>
    )
}

export default Home