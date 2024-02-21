import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";

import SignUp from "./SignUp";
import NavBar from "./NavBar";
import Login from "./Login";
import Home from "./Home";
import SavedGames from "./SavedGames";

function App() {
    const [user, setUser] = useState(null);
    const [players, setPlayers] = useState([]);
    const [games, setGames] = useState([]);
    const [saves, setSaves] = useState([]);

    useEffect(() => {
        fetch("/check_session")
        .then((r) => {
            if (r.ok) {
                r.json()
                .then((user) => setUser(user));
            }
        });
    }, []);

    useEffect(() => {
        if (user) {
            fetch(`user/${user.id}/saved`)
            .then ((r) => {
                if (r.ok) {
                    r.json()
                    .then((saves) => setSaves(saves));
                }
            });            
        } else {
            setSaves([]);
        }
    }, [user]);

    useEffect(() => {
        fetch("/players", { method: 'GET' })
        .then((r) => {
            if (r.ok) {
                r.json()
                .then((players) => setPlayers(players));
            }
        });
    }, []);

    const sortedPlayers = [...players].sort(function (a, b) {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return -1;
        }
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
          return 1;
        }
        return 0;
    });

    useEffect(() => {
        fetch("/games", { method: 'GET' })
        .then((r) => {
            if (r.ok) {
                r.json()
                .then((games) => setGames(games));
            }
        });
    }, []);

    const sortedGames = [...games].sort(function (a, b) {
        if (a.id < b.id) {
          return 1;
        }
        if (a.id > b.id) {
          return -1;
        }
        return 0;
    });

    return (
        <main>
            <>
                <NavBar user={user} onSetUser={setUser} />
                <Switch>
                    <Route path='/signup'>
                        <SignUp onLogin={setUser} />
                    </Route>
                    <Route path='/login'>
                        <Login onLogin={setUser} />
                    </Route>
                    <Route path='/saved'>
                        <SavedGames 
                            user={user}
                            games={games}
                            onSetGames={setGames}
                            saves={saves}
                            onSetSaves={setSaves}
                            players={players}
                            onSetPlayers={setPlayers}
                        />
                    </Route>
                    <Route path='/'>
                        <Home 
                            user={user} 
                            players={sortedPlayers} 
                            onSetPlayers={setPlayers} 
                            games={sortedGames}
                            onSetGames={setGames}
                            saves={saves}
                            onSetSaves={setSaves}
                        />
                    </Route>
                </Switch>        
            </>
        </main>
    );
}

export default App;
