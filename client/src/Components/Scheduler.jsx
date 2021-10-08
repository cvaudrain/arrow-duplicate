import React, {useState, useEffect, useContext} from "react"
import {useHistory} from "react-router-dom"
import Calendar from "react-calendar"
import axios from "axios";
import { credentialContext } from "./App";
// import "react-calendar/dist/Calendar.css"

let dayContext; 
let eventDatesContext;
//Need a function that returns the Date component- have to go editing around in the imported Calendar child components
function Scheduler(props){
    const history = useHistory() //redirects to Date view onClickDay
 
    const [value, onChange] = useState(new Date());
    const styling={
        width: "80vw"
    }
 const [datesWithEv,setDatesWithEv] = useState([])
 const allDates=[]

 let eventDatesContext = React.createContext(datesWithEv)
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


//  function populateEvs(startDate,date,view){
//      console.log("populateEvs")
//      console.log(date)
     
//  }
 
    function formatDates(locale,date){ //whatever we return will be the <abbr> label value. if no return, no label.
        // console.log(locale.split(" "))
        // console.log(date.toString(" ").split(" ")
        allDates.push(date.toString(" ").split(" ").slice(0,4).join(" ") )
        return date.toString(" ").split(" ").slice(0,4).join(" ") 
        
    }
    function showEvs({startDate,date,view}){
        console.log(datesWithEv)
        console.log("date") //Args must be inside object to access in your function
       if(view=="month"){
        let formatDate=date.toString(" ").split(" ").slice(0,4).join(" ")
        console.log(formatDate)
        let val;
        // for(var j=0;j<datesWithEv.length;j++){
         datesWithEv.forEach((n,i)=>{ //n is an array of obhjects.
             console.log("ENTRY =")
             console.log(n)
             console.log(n[0].startDate)
            if(n[0].startDate == formatDate){ //each entry we created is an object with startDate, evTitle etc, inside an array with up to 3 event obj
                //console.log(n[0].startDate) //n[i] represents an array with up to 3 event objects, n[0], n[1] n[2]
                //console.log(formatDate)
                console.log("day with event found")
               
                 val = 
                 <div className="centered">
                 <div><p className="event-a">{n[0].evName}</p></div> 
                 {n.length>1 && <div><p className="event-b">{n[1].evName}</p></div>} 
                {n.length>2 && <div><p className="event-c">{n[2].evName}</p></div> }
                 </div>
                 
            }else{
                console.log("NONE")
                //console.log(n)
                //console.log(n.startDate)
                //console.log(formatDate)
                
            }
          
        })
        return val 
    // }
       } //closing for if view==month
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
                tileContent = {showEvs}
            />
        </div>
    );
}

export default Scheduler
export {dayContext}
export {eventDatesContext}
