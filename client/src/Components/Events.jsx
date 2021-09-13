import {useContext, useState} from "react"
import React from "react"
import Header from "./Header";
import {userContext} from "./App"
import {dayContext} from "./Scheduler" //access date value for selected day


function Events(props){
    let currDate;
    if(sessionStorage.getItem("day") != undefined){ //avoid returning undefined on refresh (state refreshes)
         currDate = sessionStorage.getItem("day")
        console.log(sessionStorage.getItem("day"))
    }else{ //after click date from context, i.e NOT after refreshing the /events route, requiring sessionStorage
     currDate = dayContext.day //Must be PARSED bc export/import is JSON. Avoids invariant violation
    }
   
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