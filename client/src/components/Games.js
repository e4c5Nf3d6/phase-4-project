import React from "react";

import GameDisplay from "./GameDisplay";

function Games({ games }) {

    return (
        <div>
            <h2>Games</h2>
            {games.map(function(game) {
                return (
                    <GameDisplay key={game.id} game={game}/>
                )
            })}
        </div>
    )
}

export default Games