import React, { useState, useEffect } from "react";
import Players from "./Players";
import Games from "./Games";

function Home({ user, players, onSetPlayers, games }) {

    return (
        <div>
            <h1>Home Page</h1>
            <Players user={user} players={players} onSetPlayers={onSetPlayers} />
            <Games games={games} />
        </div>
    )
}

export default Home