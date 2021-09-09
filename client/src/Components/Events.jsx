import {useContext, useState} from "react"
import React from "react"
import Header from "./Header";
import {userContext} from "./App"
function Events(props){

    return(
        <div>
        <Header
            userNameGreeting={useContext(userContext)}
        />
            <p>Events Page</p>
        </div>
    )
}

export default Events;