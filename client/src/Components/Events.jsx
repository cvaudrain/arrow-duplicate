import {useContext, useState} from "react"
import React from "react"
import Header from "./Header";
import {userContext} from "./App"
import {dayContext} from "./Scheduler" //access date value for selected day


function Events(props){
const currDate = JSON.parse(dayContext)
    return(
        <div>
        <Header
            userNameGreeting={useContext(userContext)}
        />
            <p>Events Page for {currDate}</p>
        </div>
    )
}

export default Events;