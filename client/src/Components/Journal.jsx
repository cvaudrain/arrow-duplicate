import {useContext, useState} from "react"
import React from "react"
import Header from "./Header";
import {userContext} from "./App"
import {dayContext} from "./Scheduler" //access date value for selected day

function Journal(props){
const currDate = JSON.parse(dayContext)
    return(
        <div>
        <Header
            userNameGreeting={useContext(userContext)}
        />

        <div>
        <p>Journal Entry Page for {currDate}</p>
        <ul>
        <p>Want to Log Your Power Level?</p>
        <p>On a scale of 1-10....</p>
        <li>Mood</li><input placeholder="Your general vibes today..." type="number"></input>
        <li>Motivation</li><input placeholder="Your executiv function at work..." type="number"></input>
        <li>Sleep Quality</li><input placeholder="How'd you sleep last night?" type="number"></input>

        </ul>
        </div>
        
        </div>
    )
}

export default Journal;