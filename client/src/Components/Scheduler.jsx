import React, {useState, useEffect, useContext} from "react"
import {useHistory} from "react-router-dom"
import Calendar from "react-calendar"
// import "react-calendar/dist/Calendar.css"
let dayContext; 
//Need a function that returns the Date component- have to go editing around in the imported Calendar child components
function Scheduler(){
    const history = useHistory() //redirects to Date view onClickDay
 
    const [value, onChange] = useState(new Date());
    const styling={
        width: "80vw"
    }

    function dayView(value,event){
        console.log("selected day value returned:")
        console.log(value.toString().split(" "))
        let parsedDate = value.toString().split(" ")
        console.log(parsedDate)
        parsedDate = [parsedDate[1],parsedDate[2],parsedDate[3]]
        console.log(parsedDate)
        parsedDate = parsedDate.join("-") 
        console.log(parsedDate) //parsed date hyphenated will be used to determine url for event/journal per day
        
        dayContext = {
            day: parsedDate
        } //obj format to import/export properly
        
        sessionStorage.setItem("day", parsedDate)
        console.log("from local storage")
console.log(sessionStorage.getItem("day"))
        history.push("/scheduler/date") //nav to date view 
        
    }
    return(
        <div className="calendar-container">
            <Calendar 
                value={value}
                onChange={onChange}
                onClickDay={dayView}
                
            />
        </div>
    );
}

export default Scheduler
export {dayContext}