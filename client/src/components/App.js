import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";

import SignUp from "./SignUp";
import NavBar from "./NavBar";
import Login from "./Login";
import Home from "./Home";

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch("/check_session")
        .then((r) => {
            if (r.ok) {
                r.json()
                .then((user) => setUser(user))
            }
        })
    }, [])

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
                    <Route path='/'>
                        <Home user={user} />
                    </Route>
                </Switch>        
            </>
        </main>
    );
}

export default App;
