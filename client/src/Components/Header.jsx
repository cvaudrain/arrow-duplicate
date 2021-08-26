import React from "react"
import {BrowserRouter, Link} from "react-router-dom"

function Header(props){
    
    return (
    <header>
<h2 className="indigo">{props.headerText}</h2> <h3 className="greeting">Hello, {props.userNameGreeting}</h3>
<Link to="/authenticate">
<button onClick={props.logout} className="logout-button align-r" >Logout</button>
</Link>
    </header>
    )
}

export default Header