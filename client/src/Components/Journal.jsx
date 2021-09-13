import {useContext, useEffect, useState} from "react"
import {useHistory} from "react-router-dom"
import React from "react"
import Header from "./Header";

import {userContext} from "./App"
import {dayContext} from "./Scheduler" //access date value for selected day
import axios from "axios";

function Journal(props){
// const currDate = JSON.parse(dayContext)
const history = useHistory()
let currDate;
let weekday;
if(sessionStorage.getItem("day") != undefined){ //avoid returning undefined on refresh (state refreshes)
    currDate = sessionStorage.getItem("day")
   console.log(sessionStorage.getItem("day"))
   weekday = sessionStorage.getItem("weekday")
   console.log(weekday)
}else{ //after click date, i.e NOT after refreshing the /events route
currDate = dayContext.day //Must be PARSED bc export/import is JSON. Avoids invariant violation
weekday= dayContext.weekday
}

const styles = {
    slider : {
        low : {
            color: "red",
            fontFamily: "McLaren",
            fontSize: "1.4rem"
        },
        medium: {
            color: "purple",
            fontFamily: "McLaren",
            fontSize: "1.4rem"
        },
        high: {
            color: "blue",
            fontFamily: "McLaren",
            fontSize: "1.4rem"
        }
    }
}


let entry; //declared but undefined until after saveJournal defines them. Top level bc their values come from child components. 
let stats;

function getEntry(value){
    entry = value
    
}
function getStats(value){
    stats = value
}

function saveJournal(){ //save function is TOP level ( <Journal />)
    const data = { //stats is passed via prop function from StatLog />, & entry is passed via prop function from JounralEntry />. 
        currDate,
        stats,     
        entry    
    }
    axios.post("/journal/save",data).then((req,res)=>{
        console.log(data)
        console.log(res)
        let sessionData = JSON.stringify(data)
        sessionStorage.setItem(currDate,sessionData)
        history.push("/scheduler")
    })
  
}


function StatLog(props){
//Statefuls for Stat Log
const [sliderValues, setSliderValues] = useState({
    mood: "5",
    motivation: "5",
    focus: "5",
    calm: "5"
})
    

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
        <h1 className="journal-header card-div peach">Journal Entry Page for: {currDate}</h1>
        <div className="card-div">
        <ul className="plain-list">
        <h3 className="journal-header">So, how's it going?</h3>
        <h3 className="journal-header">On a scale of 0-10 how's your:</h3>
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
//statefuls for Journal Entry 
const [entry,setEntry] = useState({
    title: currDate + ":",
    content: ""
})
     
        function handleChange(event){
          
            const {name,value} = event.target;
            setEntry(prevEntry=> {
                return {
                    ...prevEntry,
                    [name]: value
                }
            })
            console.log(value)
          
        }
    
       props.fromJournalEntry(entry)
        
        return (
            <div className="centered">
            <div className=" card-div journal-header" style={{width: "30vw"}}>
            <h4>Collect your thoughts...</h4>
            </div>
                <form style={{width:"89vw", height:"75vh"}}>
                    <input onChange={handleChange}
                     name="title" value={entry.title}
                      
                       autoComplete="off"/>
                    <textarea className="paper"
                    type="submit" onChange={handleChange}
                     name="content" value={entry.content}
                      placeholder="Today's journal entry..."
                       row="20"
                        autoComplete="off"/>
                     
                </form>
                <div className="centered">
                <button className="peach button-pad" name="saveJournalBtn" onClick={saveJournal}>Save Journal Entry</button>
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