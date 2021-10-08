import {useContext, useState,useEffect} from "react"
import {Link,useHistory} from "react-router-dom"
import React from "react"
import Header from "./Header";
import Calendar from "react-calendar"
import {credentialContext} from "./App"
import {dayContext} from "./Scheduler" //access date value for selected day

import axios from "axios";

//HUD Component queries DB for events on current date, and displays them if so. It also has a button to quickly navigate to a journal entry for the current date.
function Hud(props){
    let queryParams = useContext(credentialContext)
    console.log("CREDENTIALS")
    console.log(queryParams)
const [loadComplete,setLoadComplete] = useState(false)
const [fetchedEvents,setFetchedEvents] = useState([{title:"loading",content:"loading"},{title:"loading",content:"loading"},{title:"loading",content:"loading"}])
let history = useHistory()

useEffect(()=>{
    axios.post("/api/setdashboard",queryParams)
    .then((res)=>{
        console.log(res.data)
        if(res.data == "None"){
            setFetchedEvents([{evName:"No events scheduled today",evDescription:""}])
        }else{
            console.log(res.data)
            setFetchedEvents(res.data)
            setLoadComplete(true)
        }
    })
},[])
useEffect(()=>{
console.log("fetched event 0 =")
console.log(fetchedEvents[0])
},[loadComplete])
       
function quickJournal(){
    let value = new Date()
    let parsedDate = value.toString().split(" ")
    const fullDate = parsedDate.slice(0,4).join(" ")
    console.log("FULLDATE: " + fullDate)
    const weekday = parsedDate[0]
    parsedDate = [parsedDate[1],parsedDate[2],parsedDate[3]]
   
    parsedDate = parsedDate.join("-") 
   console.log("FULL Date")
    sessionStorage.setItem("day", parsedDate)
    sessionStorage.setItem("weekday",weekday)
    sessionStorage.setItem("fullDate",fullDate)
    console.log("from local storage")
console.log(sessionStorage.getItem("day"))
history.push("/scheduler/date/mm-dd-yyyy/journal")
}
console.log("Fetched Events")
console.log(fetchedEvents)
console.log(fetchedEvents[0])
    return(
        <div>
<div className="card-div theGoodShading steel-gradient">

   <div className="row">
  { loadComplete == true  && <div class="col">
     <p name={"evTitle1"} className="evTitle">{fetchedEvents[0].evName}</p>
    <p name={"evContent1"} className="evContent">{fetchedEvents[0].evDescription}</p>
    </div>}
    {fetchedEvents.length>1 && 
    <div className="col">
    <p className ="evTitle">{fetchedEvents[1].evName}</p>
    <p className="evContent">{fetchedEvents[1].evDescription}</p>
    </div>}
    {fetchedEvents.length>2 && 
    <div className="col">
    <p className ="evTitle">{fetchedEvents[2].evName}</p>
    <p className="evContent">{fetchedEvents[2].evDescription}</p>
    </div>}
                       
  <div className="col-3">
 
  <button onClick={quickJournal} className="save-btn">Journal</button>
  </div>     
   </div>
    
</div>
        </div>

    )
}
export default Hud

