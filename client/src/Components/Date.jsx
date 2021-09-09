import {useContext, useState} from "react"
import {Link} from "react-router-dom"
import React from "react"
import Header from "./Header";
import {userContext} from "./App"
function Date(props){
const styles = {
    eventDiv:{
        width: "40vw",
        background:"#f29263",
        fontSize:"3rem",
        textAlign: "center",
        textShadow:"0 1px 4px black"
    },
    journalDiv:{
        width: "40vw",
        background:"#274c6b",
        fontSize:"3rem",
        textAlign: "center",
        textShadow:"0 1px 4px black"
    },
    header:{
        cursor:"pointer"
    }
}

    return(
        <div>
        <Header
            userNameGreeting={useContext(userContext)}
        />

        <div style={styles.eventDiv}>
        <Link to="/scheduler/date/m-d-yy/events">
    
        <p style={styles.header}>Events</p>
        </Link>
        </div>

        <div style={styles.journalDiv}>
        <Link to="/scheduler/date/m-d-yy/journal">

        <p style={styles.header}>Journal</p>
        </Link>
        </div>

        </div>
    )
}
export default Date