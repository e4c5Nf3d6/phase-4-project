import React, { useState, useEffect } from "react";
import Players from "./Players";
import Games from "./Games";

function Home({ user, players, onSetPlayers, games, onSetGames, saves, onSetSaves }) {

    return (
        <div>
            <h1>Home Page</h1>
            <div className="main-content">
                <Players 
                    user={user} 
                    players={players} 
                    onSetPlayers={onSetPlayers} 
                />
                <Games 
                    user={user} 
                    games={games} 
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