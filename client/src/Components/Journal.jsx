import {useContext, useEffect, useState} from "react"
import {useHistory} from "react-router-dom"
import React from "react"
import Header from "./Header";

import {credentialContext,userContext} from "./App"
import {dayContext} from "./Scheduler" //access date value for selected day
import axios from "axios";
// import { application } from "express";

function Journal(props){
// const currDate = JSON.parse(dayContext)
const queryParams = useContext(credentialContext) //exported from <App />, gives username/email to incl for all db Queries
console.log("queryParams:")
console.log(queryParams)
const history = useHistory()
let currDate;
let weekday;
let fullDate;
if(sessionStorage.getItem("day") != undefined){ //avoid returning undefined on refresh (state refreshes)
    currDate = sessionStorage.getItem("day")
   console.log(sessionStorage.getItem("day"))
   weekday = sessionStorage.getItem("weekday")
   console.log(weekday)
   fullDate = sessionStorage.getItem("fullDate")
}else{ //after click date, i.e NOT after refreshing the /events route
currDate = dayContext.day //Must be PARSED bc export/import is JSON. Avoids invariant violation
weekday= dayContext.weekday
fullDate = dayContext.fullDate
}

const styles = {
    slider : {
        low : {
            color: "red",
            fontFamily: "McLaren",
            fontSize: "1.4rem"
        },
        medium: {
            color: "#fff",
            fontFamily: "McLaren",
            fontSize: "1.4rem",
            fontWeight:"bold"
            
        },
        high: {
            color: "blue",
            fontFamily: "McLaren",
            fontSize: "1.4rem"
        }
    }
}

let sessionData = {
    entry : {
        title: "",
        content: ""
    },
    stats: {
        mood: "5",
        motivation: "5",
        focus: "5",
        calm: "5"
    }
}
const [parentData,setParentData] = useState(sessionData) //set from sessionData, will be used to pass down values after inital fetch inside useEffect
//Get and render previous entry (if any on file ) ...Wrap in useEffect to run AFTER initial render ONCE and subsequently cause re-render with updated values
useEffect(()=>{
axios.post("/journal/fetch",{
    queryParams: queryParams,
    fullDate: fullDate
})
.then((res)=>{ //be sure to only pass 1 callback arg: res. NOT req,res if server is sending 1 obj i.e just res
    console.log("return res:")
    console.log(res.data)
    
    entry = res.data.entry
    stats = res.data.stats
    sessionStorage.setItem("sessionData",JSON.stringify(res.data)) //set sessionStorage to values pulled from DB, if any.
    console.log(stats)
    setParentData(res.data)
})
.catch((err)=>console.log(err))
},[]) //Only fetch ONCE. After initial re-render from this useEffect, we set state from sessionStorage
//sessionStorage.setItem("sessionData",JSON.stringify(sessionData)) //resets sessionStorage to default; necessary to have accurate values if we nav to another date without a DB entry already.

// if(sessionStorage.getItem("sessionData") != undefined){
//  sessionData = sessionStorage.getItem("sessionData")
//  sessionData = JSON.parse(sessionData)
// }else{
//  sessionData = {
//         entry : {
//             title: "",
//             content: ""
//         },
//         stats: {
//             mood: "5",
//             motivation: "5",
//             focus: "5",
//             calm: "5"
//         }
//     }
// }
console.log("sessionData =")
console.log(sessionData)
console.log("sessionData.entry =")
console.log(sessionData.entry)
let entry = sessionData.entry
console.log("sessionData.stats =")
console.log(sessionData.stats)
let stats = sessionData.stats
console.log(stats.mood)


    let journalContext = React.createContext(parentData) //use to pass values down after fetch in useEffect
function getEntry(value){ //the journal entry passed up from jounral component
    entry = value
    
}
function getStats(value){ //the stats values passed up from the Statlog component
    stats = value
}

function saveJournal(){ //save function is TOP level ( <Journal />)
    const data = { //stats is passed via prop function from StatLog />, & entry is passed via prop function from JounralEntry />. 
        fullDate,
        stats,     
        entry,
        queryParams    
    }
   
    axios.post("/journal/save",data)
    .then((req,res)=>{
        console.log(data)
        console.log(res)
        let sessionData = JSON.stringify(data)
        sessionStorage.setItem(currDate,sessionData)
        history.push("/scheduler")
})
.catch((err)=>console.log(err))
}


function StatLog(props){
let context = useContext(journalContext)

//Statefuls for Stat Log

const [sliderValues, setSliderValues] = useState(context.stats)

function handleSlider(e){
    const {name,value} = e.target
    setSliderValues(previous=>{
        return{
            ...previous,
            [name] : value
        }
})
  
}

props.fromStatLog(sliderValues)
return (
    <div >
        <h1 className="journal-header card-div peach theGoodShading">Journal Entry Page for: {currDate}</h1>
        <div className="card-div theGoodShading">
        <ul className="plain-list">
        <h3 className="journal-header" style={{color: "#5185c9"}}>So, how's it going?</h3>
        <h3 className="journal-header" style={{color: "#fff"}}>On a scale of <span style={{color: "#5185c9"}}>0-10 </span>how's your:</h3>
        <li style={styles.slider.medium}>Mood: {sliderValues.mood}</li>
        <input style={{width:"40vw"}} onChange={handleSlider} name="mood" placeholder="1-10" type="range" min="0" max = "10" value={sliderValues.mood}></input>
        <li style={styles.slider.medium}>Motivation: {sliderValues.motivation}</li>
        <input style={{width:"40vw"}} onChange={handleSlider} name="motivation" placeholder="1-10" type="range" min="0" max = "10" value={sliderValues.motivation}></input>
        <li style={styles.slider.medium}>Focus: {sliderValues.focus}</li>
        <input style={{width:"40vw"}} onChange={handleSlider} name="focus" placeholder="1-10" type="range" min="0" max = "10" value={sliderValues.focus}></input>
        <li style={styles.slider.medium}>Calm: {sliderValues.calm}</li>
        <input style={{width:"40vw"}} onChange={handleSlider} name="calm" placeholder="1-10" type="range" min="0" max = "10" value={sliderValues.calm}></input>

        </ul>
        </div>
        </div>
)
}
//END StatLog />

function JournalEntry(props){
    let context = React.useContext(journalContext)
    console.log("context is")
    console.log(context)
    // console.log(context)
//statefuls for Journal Entry 
console.log("journal component entry value:")
console.log(entry)
const [entryState,setEntryState] = useState(context.entry)
// const [entry,setEntry] = useState(entry)
     
        function handleChange(event){
          
            const {name,value} = event.target;
            setEntryState(prevEntry=> {
                return {
                    ...prevEntry,
                    [name]: value
                }
            })
            console.log(value)
          
        }
    
       props.fromJournalEntry(entryState)
        
        return (
            <div className="centered">
            <div className=" card-div journal-header theGoodShading" style={{width: "30vw"}}>
            <h4 className="collect-thoughts"> Collect your thoughts...</h4>
            </div>
           
                <form className="theGoodShading paper-br" style={{width:"89vw", height:"75vh"}}>
                    <input className="kalam paper-br" onChange={handleChange}
                     name="title" value={entryState.title}
                      placeholder="Entry Title"
                       autoComplete="off"/>
                    <textarea className="kalam paper-br"
                    type="submit" onChange={handleChange}
                     name="content" value={entryState.content}
                      placeholder="Today's journal entry..."
                       row="20"
                        autoComplete="off"/>
                     
                </form>
                
                <div className="centered">
                <button className="peach button-pad pill" name="saveJournalBtn" onClick={saveJournal}>Save Journal Entry</button>
                </div>
                
            </div>
        )
    
    }
    //END JournalEntry />

    return(
        <div >
        <Header
            userNameGreeting={useContext(userContext)}
        />

        <StatLog 
        fromStatLog={getStats}
        />
        
        <JournalEntry
        fromJournalEntry={getEntry}
        
        />

        </div>
    )
}


export default Journal;