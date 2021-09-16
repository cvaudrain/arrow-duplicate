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
 

    function logWeek(weekNumber, date,event){
        console.log("Week #"+weekNumber)
        console.log("Begins on: " + date)
        let starting = new Date(date) //value of 1st day of selected week, Monday.
        let mon = new Date()
        let tue = new Date()
        let wed = new Date()
        let thu = new Date()
        let fri = new Date()
        let sat = new Date()
        let sun = new Date()
        let days = [mon,tue,wed,thu,fri,sat,sun]
        let week=[]
        days.map((day,ind)=>{
day.setDate(starting.getDate()+ind)
week.push(day)
        })
       
        // let starting = new Date(date) //value of 1st day of selected week, Monday.
        // week.push(starting)
        //  tue.setDate(starting.getDate()+1)
        //  console.log(tue)
        //  week.push(tue)
        //  wed.setDate(starting.getDate()+2)
        //  console.log(wed)
        //  week.push(wed)
         
   
        // for(var i=0;i<7;i++){
        //   nextDay.setDate(nextDay.getDate()+1)
        //     week.push(nextDay)
        //     console.log(week)
        // }
        // nextDay.setDate(nextDay.getDate()+1)
        // console.log(nextDay)
        // nextDay.setDate(nextDay.getDate()+2)
        // console.log(nextDay)
        console.log(week)
       

    }
    function clickDay(value,event){
        
        console.log(value)
        console.log("selected day value returned:")
        console.log(value.toString().split(" "))
        let parsedDate = value.toString().split(" ")
        console.log(parsedDate)
        const weekday = parsedDate[0]
        parsedDate = [parsedDate[1],parsedDate[2],parsedDate[3]]
       
        console.log(parsedDate)
        parsedDate = parsedDate.join("-") 
        console.log(parsedDate) //parsed date hyphenated will be used to determine url for event/journal per day
        console.log(weekday)
        dayContext = {
            day: parsedDate,
            weekday: weekday
        } //obj format to import/export properly
        
        sessionStorage.setItem("day", parsedDate)
        sessionStorage.setItem("weekday",weekday)
        console.log("from local storage")
console.log(sessionStorage.getItem("day"))
        history.push("/scheduler/date") //nav to date view 
    
    }
    return(
        <div className="calendar-container">
        <div className="card-div">
           
        </div>
            <Calendar 
                value={value}
                onChange={onChange}
                onClickDay={clickDay}
                showWeekNumbers={true}
                onClickWeekNumber={logWeek}
               selectRange={false}
                
            />
        </div>
    );
}

export default Scheduler
export {dayContext}