import React, { useState } from "react";
import { useHistory } from "react-router-dom";

function SignUp({ onLogin }) {
    const history = useHistory()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    function handleSubmit(e) {
        e.preventDefault();
        setError("");

        fetch("/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
            .then((r) => {
                if (r.ok) {
                    r.json()
                    .then((user) => {
                        onLogin(user)
                        history.push("/")
                    })
                } else {
                    r.json()
                    .then((err) => setError(err.error))
                }
            })

        setUsername("")
        setPassword("")
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input 
                    type="text"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Sign Up</button>
            </form>    
            <div>
                <p>{error}</p>
            </div>         
        </>

    )
}

export default SignUp