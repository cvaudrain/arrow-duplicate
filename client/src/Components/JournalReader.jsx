import React, {useState, useEffect, useContext} from "react"
import {useHistory} from "react-router-dom"
import Calendar from "react-calendar"
import axios from "axios";
import { credentialContext } from "./App";
// import "react-calendar/dist/Calendar.css"

let dayContext; 
let journalDatesContext;

    //Need a function that returns the Date component- have to go editing around in the imported Calendar child components
    function JournalReader(props){
        const history = useHistory() //redirects to Date view onClickDay
     
        const [value, onChange] = useState(new Date());
       
     const [datesWithJourn,setDatesWithJourn] = useState([])
     const allDates=[]
    
    //  let journDatesContext = React.createContext(datesWithJourn)
     let credentials = useContext(credentialContext)
     console.log("userObj is")
     console.log(credentials)
     useEffect(()=>{
        axios.post("/journal/reader/fetch",credentials)
        .then((res)=>{
            console.log("Fetched journal dates:")
            console.log(res.data)
            console.log(res.data.length > 0)
            setDatesWithJourn(res.data.retrievedArray)
        })
        .catch((err)=>console.log(err))
     },[])
     
        function formatDates(locale,date){ //whatever we return will be the <abbr> label value. if no return, no label.
            allDates.push(date.toString(" ").split(" ").slice(0,4).join(" ") )
            return date.toString(" ").split(" ").slice(0,4).join(" ") 
            
        }
        function showJourn({startDate,date,view}){
            // console.log(datesWithEv)
            // console.log("date") //Args must be inside object to access in your function
           if(view=="month"){
            let formatDate=date.toString(" ").split(" ").slice(0,4).join(" ")
            // console.log(formatDate)
            let val;
            // for(var j=0;j<datesWithEv.length;j++){
             datesWithJourn.forEach((n,i)=>{ //n is an array of obhjects.
                 console.log("ENTRY =")
                 console.log(n)
                 console.log(n.fullDate)
                if(n.fullDate == formatDate){ //each entry we created is an object with startDate, evTitle etc, inside an array with up to 3 event obj
                    //console.log(n[0].startDate) //n[i] represents an array with up to 3 event objects, n[0], n[1] n[2]
                    //console.log(formatDate)
                    console.log("day with Journal found")
                   
                     val = 
                     <div className="centered">
                     <div><i class="fas fa-address-book"></i></div> 
                    
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
                    tileContent = {showJourn}
                />
            </div>
        );
    }

    
    export default JournalReader;
    export {dayContext}

    //function JournalReader(props){ //function simply reroutes to journal after setting session values to current date (formatted) from tray anchor when "Journal" anchor is clicked
//     let history = useHistory()

//     let value = new Date()
//     console.log(value)
//     console.log("selected day value returned:")
//     console.log(value.toString().split(" "))
//     let parsedDate = value.toString().split(" ")
//     console.log("PARSED Date")
//     console.log(parsedDate)
    
//     const fullDate = parsedDate.slice(0,4).join(" ")
//     console.log("FULLDATE: " + fullDate)
//     const weekday = parsedDate[0]
//     parsedDate = [parsedDate[1],parsedDate[2],parsedDate[3]]
   
//     console.log(parsedDate)
//     parsedDate = parsedDate.join("-") 
//     console.log(parsedDate) //parsed date hyphenated will be used to determine url for event/journal per day
//     console.log(weekday)
//     // dayContext = {
//     //     day: parsedDate,
//     //     weekday: weekday,
//     //     fullDate:fullDate
//     // } //obj format to import/export properly
//    console.log("FULL Date")
    
//     sessionStorage.setItem("day", parsedDate)
//     sessionStorage.setItem("weekday",weekday)
//     sessionStorage.setItem("fullDate",fullDate)
//     console.log("from local storage")
// console.log(sessionStorage.getItem("day"))
//     // history.push(urlPath) //nav to date view 

  
//         history.push("/scheduler/date/mm-dd-yyyy/journal")
//         location.reload()

