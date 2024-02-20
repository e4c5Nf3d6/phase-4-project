import React from "react";
import { NavLink } from "react-router-dom";

const linkStyles = {
    display: "inline-block",
    textAlign: "center",
    width: "100px",
    padding: "12px",
    margin: "6px 6px 6px",
    background: "white",
    textDecoration: "none",
    color: "black",
};

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
        <div className="navbar">
            <br></br>
            <div className="links">
                <NavLink 
                    to='/' 
                    exact
                    style={linkStyles}
                    activeStyle={{
                        background: "#E2D8D2"
                    }}
                >
                    Home
                </NavLink>
                {user ?
                    null
                    :
                    <>
                        <NavLink 
                            to='/login'
                            style={linkStyles}
                            activeStyle={{
                                background: "#E2D8D2"
                            }}
                        >
                            Login
                        </NavLink>
                        <NavLink 
                            to='/signup'
                            style={linkStyles}
                            activeStyle={{
                                background: "#E2D8D2"
                            }}
                        >
                            Sign Up
                        </NavLink>
                    </>
                }
            </div>
            {user ?
                <div className="profile">
                    <button className="logout" onClick={handleLogout}>Logout</button>
                    <h2 className="greeting">Hello, {user.username}</h2>
                </div>
                :
                null
            }
        </div>
    )
}

export default NavBar