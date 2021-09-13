import {useContext, useState} from "react"
import {Link} from "react-router-dom"
import React from "react"
import Header from "./Header";
import {userContext} from "./App"
import {dayContext} from "./Scheduler" //access date value for selected day
import { grey } from "@material-ui/core/colors";

function Date(props){
    
    
    let currDate;
    if(sessionStorage.getItem("day") != undefined){ //avoid returning undefined on refresh (state refreshes)
         currDate = sessionStorage.getItem("day")
        console.log(sessionStorage.getItem("day"))
    }else{ //after click date, i.e NOT after refreshing the /events route
     currDate = dayContext.day //Must be PARSED bc export/import is JSON. Avoids invariant violation
    }
    const styles = {
    
    header:{
        cursor:"pointer"
    }
}

    return(
        <div>
        
        <Header
            userNameGreeting={useContext(userContext)}
        />
        <div className="centered">
        <h1 className="card-div peach">{currDate}</h1>

        <div className="date-div">
        <Link style={{textDecoration: "none" }} to="/scheduler/date/m-d-yy/events">
    
        <p style={styles.header}>Events</p>
        </Link>
        </div>

        <div className="date-div">
        <Link style={{textDecoration: "none"}} to="/scheduler/date/m-d-yy/journal">

        <p style={styles.header}>Journal</p>
        </Link>
        </div>
</div>
        </div>
    )
}
export default Date