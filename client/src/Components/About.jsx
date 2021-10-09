import React, {useState, useEffect, useContext} from "react"
import {useHistory} from "react-router-dom"
import Calendar from "react-calendar"
import axios from "axios";
import { credentialContext } from "./App";

export default function About(props){
let history = useHistory()
    function scrollTop(){
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }
    return(
       
        <div className="mclaren">

            <div className="title-card title-card-short cloud-gradient theGoodShading top-space-sm blue">
        <div className="centered">
        <h3 className="">About The App</h3>
        </div>
        </div>
        <div className="about-card indigo-gradient theGoodShading top-space-sm">
        <div className="centered">
        <p style={{fontSize:"1.2rem",padding:"15px"}}>Here you'll find an assortment of cohesive apps designed to assist with productivity and self-reflection.<br/> There are currently several core features designed to give you a personalized and (hopefully) fun experience. </p>
        </div>
        </div>

        {/*  */}
        <div className="title-card title-card-short cloud-gradient theGoodShading top-space-sm blue">
        <div className="centered">
        <h3 className="">Current Features:</h3>
        </div>
        </div>
        <div onClick={()=>history.push("/")} className="pointer title-card title-card-short peach-gradient theGoodShading top-space-sm blue">
        <div className="centered">
        <h4 className="">The Dashboard</h4>
        </div>
        </div>
        <div className="about-card indigo-gradient theGoodShading top-space-sm">
        <div className="centered">
        <img onClick={()=>history.push("/")} src="/dashboard.png" height="auto" width="90%" className="theGoodShading rounded pointer"></img>
        <p style={{fontSize:"1.1rem",padding:"15px"}}>Your homepage where you can see the day at a glance. Take notes, view the events of the day and quickly log a journal entry from here </p>
        </div>
        </div>
        {/*  */}
        <div onClick={()=>history.push("/journal/reader")} className="pointer title-card title-card-short peach-gradient theGoodShading top-space-sm blue">
        <div className="centered">
        <h4 className="">Journal</h4>
        </div>
        </div>
        <div className="about-card indigo-gradient theGoodShading top-space-sm">
        <div className="centered">
        <img onClick={()=>history.push("/journal/reader")} src="/journal.png" height="auto" width="90%" className="theGoodShading rounded pointer"></img>
        <p style={{fontSize:"1.1rem",padding:"15px"}}>A tool to write out your thoughts and optionally track your state of mind each day. Record values for your sense of calm, focus, mood and motivation on a sliding scale. These personal, subjective measures are primarily for self-reflection, though to add a bit of a fun twist, these values also contribute to your rolling 'stats' and 'power level', in an RPG/video game style. </p>
        </div>
        
        </div>

        <div onClick={()=>history.push("/scheduler")} className="pointer title-card title-card-short peach-gradient theGoodShading top-space-sm blue">
        <div className="centered">
        <h4 className="">Scheduler</h4>
        </div>
        </div>
        <div className="about-card indigo-gradient theGoodShading top-space-sm">
        <div className="centered">
        <img onClick={()=>history.push("/scheduler")} src="/scheduler.png" height="auto" width="90%" className="theGoodShading rounded pointer"></img>
        <p style={{fontSize:"1.1rem",padding:"15px"}}>A scheduler based on the <a href="https://www.npmjs.com/package/react-calendar"> React Calendar </a> to view your monthly schedule at large, developed further to set daily events hour-by-hour. Current daily events are also visible on the dashboard. </p>
        </div>
        </div>

        <div onClick={()=>history.push("/settings")} className="pointer title-card title-card-short peach-gradient theGoodShading top-space-sm blue">
        <div className="centered">
        <h4 className="">Your Profile</h4>
        </div>
        </div>
        <div className="about-card indigo-gradient theGoodShading top-space-sm">
        <div className="centered">
        <img onClick={()=>history.push("/settings")} src="/profile.png" height="auto" width="90%" className="theGoodShading rounded pointer"></img>
        <p style={{fontSize:"1.1rem",padding:"15px"}}>Your profile is a place where you can view your accumulated "stats", "rank", set a profile picture, and change account settings. Stats are just for some stylized fun, and are increased over time the more you journal. </p>
        </div>
        </div>
        <div className="title-card cloud-gradient theGoodShading top-space-sm blue title-card-short">
        <div className="centered">
        <h4 className="">Coming Soon...</h4>
        </div>
        </div>
        <div className="about-card indigo-gradient theGoodShading top-space-sm">
        <div className="centered">
        <p style={{fontSize:"1.1rem",padding:"15px"}}><strong>Disclaimer</strong>: <br/>There's just one developer behind this project and he can't say for certain when these features will be dropping in. But you can expect to see the following making their way here before too long: </p>
        <ul style={{listStyle:"none"}}>
        <li>
        <p style={{fontSize:"1.1rem",padding:"15px"}}><strong>Quests</strong>: <br/>Lean even harder into RPG fun by turning mundane tasks into quests to net points.</p>
        </li>
        <li>
        <p style={{fontSize:"1.1rem",padding:"15px"}}><strong>Uploads</strong>: <br/>Customize your profile further with local images from your device.</p>
        </li>
        <li>
        <p style={{fontSize:"1.1rem",padding:"15px"}}><strong>Reminders</strong>: <br/>Get email/SMS reminders for upcoming events if you so choose.</p>
        </li>
        <li>
        <p style={{fontSize:"1.1rem",padding:"15px"}}><strong>Dark Mode</strong>: <br/>Obviously.</p>
        </li>
</ul>
        </div>
        </div>
        <div className="top-space-sm">

            </div>
        <div className="centered">
        <button className="to-register-btn" onClick={scrollTop}>Scroll Top</button>
        </div>
            <div className="top-space">

            </div>
     

            </div>
           

        //    <p style={{fontSize:"1.2rem"}}>Dashboard</p>
        // <p style={{fontSize:"1rem"}}>Get a look at the events set for the day, take notes, and quickly log a journal entry.</p>
        // <p style={{fontSize:"1.2rem"}}>Scheduler </p>
        // <p style={{fontSize:"1rem"}}>Plan and organize your month with with React Calendar, and set events hour-by-hour with the event scheduler</p>
        // <p style={{fontSize:"1.2rem"}}>Journal </p>
        // <p style={{fontSize:"1rem"}}>A journal and optional mood tracker you can use to self-reflect and see your  </p>
    )
}