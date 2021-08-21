import React from "react"

function Header(props){
    return (
    <header>
<h1>{props.headerText}</h1> <h3>   Hello, {props.userNameGreeting}</h3>
    </header>
    )
}

export default Header