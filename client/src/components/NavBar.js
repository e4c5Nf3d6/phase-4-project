import React from "react";
import { NavLink } from "react-router-dom";

function NavBar({ user, onSetUser }) {
    function handleLogout() {
        fetch("/logout", { method: "DELETE"})
        .then((r) => {
            if (r.ok) {
                onSetUser(null)
            }
        })
    }

    return (
        <div>
            <NavLink to='/' exact>
                Home
            </NavLink>
            {user ?
                <>
                    <h2>Hello, {user.username}</h2>
                    <button onClick={handleLogout}>Logout</button>
                </>
                :
                <>
                    <NavLink to='/login'>
                        Login
                    </NavLink>
                    <NavLink to='/signup'>
                        Sign Up
                    </NavLink>
                </>
            }
        </div>
    )
}

export default NavBar