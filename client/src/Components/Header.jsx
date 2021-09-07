import React from "react"
import {BrowserRouter, Link} from "react-router-dom"

function Header(props){
    
    return (
    <header>
<p className="indigo">{props.headerText}</p> <h3 className="greeting">Hello, {props.userNameGreeting}</h3>
<Link to="/calendar">
<button onClick={props.toCalendar} className="calendar-button align-r" >Calendar</button>
</Link>
<Link to="/authenticate">
<button onClick={props.logout} className="logout-button align-r" >Logout</button>
</Link>
    </header>
    )
}

export default Header