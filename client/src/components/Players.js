import React, { useState } from "react";

import AddPlayer from "./AddPlayer";

function Players({ user, players, onSetPlayers }) {
    const [query, setQuery] = useState('')

    const filteredPlayers = players.filter(player => player.name.toLowerCase().includes(query.toLowerCase()))

    return (
        <div className="players">
            <h2>Players</h2>
            <input 
                type="text"
                id="query"
                name="query"
                placeholder="Search for a player"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            {user ? <AddPlayer players={players} onSetPlayers={onSetPlayers} /> : null}
            {filteredPlayers.map(function(player) {
                return (
                    <p key={player.id}>{player.name}</p>
                )
            })}
        </div>
    )
}

export default Players