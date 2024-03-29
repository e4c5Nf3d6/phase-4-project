import React from "react";

import GameDisplay from "./GameDisplay";
import AddGame from "./AddGame";

function Games({ user, games, onSetGames, players, onSetPlayers, saves, onSetSaves }) {

    return (
        <div className="game-display">
            <h2>Games</h2>
            {user ? 
                <AddGame 
                    games={games} 
                    onSetGames={onSetGames} 
                    players={players} 
                    onSetPlayers={onSetPlayers} 
                /> : null}
            {games.map(function(game) {
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
    );
}

export default Games;