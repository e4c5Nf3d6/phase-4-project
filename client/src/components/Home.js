import React, { useState, useEffect } from "react";
import Players from "./Players";

function Home({ user }) {
    const [players, setPlayers] = useState([])

    useEffect(() => {
        fetch("/players", { method: 'GET' })
        .then((r) => {
            if (r.ok) {
                r.json()
                .then((players) => setPlayers(players))
            }
        })
    }, [])

    const sortedPlayers = [...players].sort(function (a, b) {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
    });

    return (
        <div>
            <h1>Home Page</h1>
            <Players user={user} players={sortedPlayers} onSetPlayers={setPlayers} />
        </div>
    )
}

export default Home