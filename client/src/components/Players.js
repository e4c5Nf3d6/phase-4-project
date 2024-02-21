import React, { useState } from "react";

import AddPlayer from "./AddPlayer";

function Players({ user, players, onSetPlayers, activePlayerID, onSetActivePlayerID }) {
    const [query, setQuery] = useState('');

    const filteredPlayers = players.filter(player => player.name.toLowerCase().includes(query.toLowerCase()));

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
            <p 
                className={activePlayerID === 'all' ? "active-option" : "clickable"}
                onClick={() => onSetActivePlayerID('all')}
            ><strong>All Players</strong></p>
            {filteredPlayers.map(function(player) {
                return (
                    <p 
                        className={player.id === activePlayerID ? "active-option" : "clickable"}
                        key={player.id}
                        onClick={() => onSetActivePlayerID(player.id)}
                    >{player.name}</p>
                );
            })}
        </div>
    );
}

export default Players;