import React, { useState } from "react";

import Players from "./Players";
import Games from "./Games";
import useDocumentTitle from "../hooks/useDocumentTitle";

function Home({ user, players, onSetPlayers, games, onSetGames, saves, onSetSaves }) {
    const [activePlayerID, setActivePlayerID] = useState('all');

    const filteredGames = games.filter((game) => {
        if (activePlayerID === 'all') {
            return true;
        } else return (game.white_player_id === activePlayerID || game.black_player_id === activePlayerID);
    })

    useDocumentTitle('Home');

    return (
        <div>
            <h1>Home</h1>
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
    );
}

export default Home;