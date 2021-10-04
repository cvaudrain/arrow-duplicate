import React, {useState, useEffect, useContext} from "react"
import {useHistory} from "react-router-dom"
import Calendar from "react-calendar"
import axios from "axios";
import { credentialContext } from "./App";
// import "react-calendar/dist/Calendar.css"

let dayContext; 
//Need a function that returns the Date component- have to go editing around in the imported Calendar child components
function Scheduler(props){
    const history = useHistory() //redirects to Date view onClickDay
 
    const [value, onChange] = useState(new Date());
    const styling={
        width: "80vw"
    }
 const [datesWithEv,setDatesWithEv] = useState([])
 const allDates=[]

 let credentials = useContext(credentialContext)
 console.log("userObj is")
 console.log(credentials)
 useEffect(()=>{
    axios.post("/scheduler/findevents",credentials)
    .then((res)=>{
        console.log("Fetched events:")
        console.log(res.data)
        console.log(res.data.length > 0)
        setDatesWithEv(res.data)
    })
    .catch((err)=>console.log(err))
 },[])
 


    function formatDates(locale,date){
        // console.log(locale.split(" "))
        // console.log(date.toString(" ").split(" ")
        allDates.push(date.toString(" ").split(" ").slice(0,4).join(" ") )
        // console.log(allDates)
    }

    function clickDay(value,event){
        
        console.log(value)
        console.log("selected day value returned:")
        console.log(value.toString().split(" "))
        let parsedDate = value.toString().split(" ")
        console.log(parsedDate)
        const fullDate = parsedDate.slice(0,4).join(" ")
        const weekday = parsedDate[0]
        parsedDate = [parsedDate[1],parsedDate[2],parsedDate[3]]
       
        console.log(parsedDate)
        parsedDate = parsedDate.join("-") 
        console.log(parsedDate) //parsed date hyphenated will be used to determine url for event/journal per day
        console.log(weekday)
        dayContext = {
            day: parsedDate,
            weekday: weekday,
            fullDate:fullDate
        } //obj format to import/export properly
       console.log("FULL Date")
        console.log(dayContext.fullDate)
        sessionStorage.setItem("day", parsedDate)
        sessionStorage.setItem("weekday",weekday)
        sessionStorage.setItem("fullDate",fullDate)
        console.log("from local storage")
console.log(sessionStorage.getItem("day"))
        history.push("/scheduler/date") //nav to date view 
    
    }
    return(
        <div className="calendar-container">
        
            <Calendar 
                value={value}
                onChange={onChange}
                onClickDay={clickDay}
               formatLongDate={formatDates}
               selectRange={false}
                
            />
        </div>
    );
}

export default Scheduler
export {dayContext}