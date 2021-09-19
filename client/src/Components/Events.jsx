import {useContext, useState,useEffect} from "react"
import React from "react"
import Header from "./Header";
import Calendar from "react-calendar"
import {userContext} from "./App"
import {dayContext} from "./Scheduler" //access date value for selected day
import axios from "axios";


function Events(props){
  const [view,setView] = useState("day")
  const [evEditor, setEvEditor] = useState(false)
  const [multi,setMulti] = useState(false)
  
// Placeholders in Session Data
// !sessionStorage.getItem("form") && sessionStorage.setItem("formContext","placeholder for form")
// let toContext = sessionStorage.getItem("formContext")
// let eventContext = React.createContext(toContext)
// console.log(eventContext)

  let currDate;
let weekday;
let fullDate;
if(sessionStorage.getItem("day") != undefined){ //avoid returning undefined on refresh (state refreshes)
  //mm-dd-yyyy
    currDate = sessionStorage.getItem("day")
   console.log(sessionStorage.getItem("day"))
   //Day of week
   weekday = sessionStorage.getItem("weekday")
   console.log(weekday)
   //Full date compatible Date constructor setDate methods
   fullDate = sessionStorage.getItem("fullDate")
   console.log(fullDate)
}else{ //after click date, i.e NOT after refreshing the /events route
currDate = dayContext.day //Must be PARSED bc export/import is JSON. Avoids invariant violation
weekday= dayContext.weekday
fullDate = dayContext.fullDate
} 

function toggleView(){
    console.log("toggle view fired")
}

function addEvent(){
  console.log("add event")
setEvEditor(true)

}


    // Day View, default
    function Day(props){

function toggleMulti(){
multi ? setMulti(false) : setMulti(true)
}
let formData;
if(sessionStorage.getItem("form")!=undefined){
  formData = JSON.parse(sessionStorage.getItem("form"))
  formData.startDate= fullDate
  formData.endDate= fullDate
}else{
  formData = {
    evName: "",
    evDescription: "",
    startDate:fullDate,
    endDate:fullDate,
    timeStart: "",
    timeEnd: "",
  }
}
const [value, onChange] = useState(new Date()); //per React Calendar Docs: current date value returned from value state

const [form, setForm] = useState(formData)
useEffect(()=>{ //if re-render to render calendar for nmulti-day, form entered values are preserved i nsessionStorage.
  sessionStorage.setItem("form",JSON.stringify(form))
  console.log(sessionStorage.getItem("form"))
  
},[form])
let eventContext = React.createContext(form)


function handleChange(e){ //form data change tracking
  const {name,value}=e.target
setForm(prev=>{
  return {
    ...prev,
    [name]: value
  }
})


console.log("Form State:")
console.log(form)
}

const [startEnd, setStartEnd] = useState("startDate") //determinant for whether click event sets start or end date.
function toggleStartEnd(e){
setStartEnd(e.target.id)
console.log("startEnd triggered")
console.log(startEnd)
}

function clickRange(value, event){
  
  console.log("cal current value is:")
  console.log(value)
 
    setForm(prev=>{
      return {
        ...prev,
        [startEnd]: value.toString()
      }
    })
    
   
    setStartEnd("endDate")
    
    
  }

  function saveEvent(e){
    e.preventDefault()
      console.log("save event")
      console.log(form)
      axios.post("/events/save",form)
      .then((res)=>{
        console.log(res.data)
      })
      //function to render event blocks on day view UI
      


      //function to pass form data via props to scheduler parent

    }

      //Event Row Component: <EventRows /> Parent: <Day/> Recieves: eventContext, drawing value from state variable "form"
      function EventRows(props){
        const importEv = useContext(eventContext)
        console.log("event context")
        console.log(importEv)
        console.log(importEv.timeStart)
        let stored = [
        <div name="06:00" className="row time-block no-border"></div>,
        <div name="07:00" className="row time-block"></div>,
        <div name="08:00" className="row time-block"></div>,
        <div name="09:00" className="row time-block"></div>,
        <div name="10:00" className="row time-block"></div>,
        <div name="11:00" className="row time-block"></div>,
        <div name="12:00" className="row time-block"></div>,
        <div name="13:00" className="row time-block"></div>,
        <div name="14:00" className="row time-block"></div>,
        <div name="15:00" className="row time-block"></div>,
        <div name="16:00" className="row time-block"></div>,
        <div name="17:00" className="row time-block"></div>,
        <div name="8:00" className="row time-block"></div>,
        <div name="19:00" className="row time-block"></div>,
        <div name="20:00" className="row time-block"></div>,
        <div name="21:00" className="row time-block"></div>,
        <div name="22:00" className="row time-block"></div>,
        <div name="23:00" className="row time-block"></div>,
        <div name="24:00" className="row time-block"></div>,
        <div name="1:00" className="row time-block"></div>,
        <div name="2:00" className="row time-block"></div>,
        <div name="3:00" className="row time-block"></div>,
        <div name="4:00" className="row time-block"></div>,
        <div name="5:00" className="row time-block"></div>]
        let storedActive = [
          <div style={{backgroundColor:"rgba(112, 12, 62, 0.413)",textAlign:"center",textShadow: "2px 3px 5px rgba(0,0,0,0.5)",color:"#fff",paddingLeft:"30px",fontFamily:"McLaren",fontSize:"1.2rem"}} name="06:00" className="row time-block no-border">{importEv.evName}</div>,
          <div style={{backgroundColor:"rgba(112, 12, 62, 0.413)",textAlign:"center",textShadow: "2px 3px 5px rgba(0,0,0,0.5)",color:"#fff",paddingLeft:"30px",fontFamily:"McLaren",fontSize:"1.2rem"}} name="07:00" className="row time-block">{importEv.evName}</div>,
          <div style={{backgroundColor:"rgba(112, 12, 62, 0.413)",textAlign:"center",textShadow: "2px 3px 5px rgba(0,0,0,0.5)",color:"#fff",paddingLeft:"30px",fontFamily:"McLaren",fontSize:"1.2rem"}} name="08:00" className="row time-block">{importEv.evName}</div>,
          <div style={{backgroundColor:"rgba(112, 12, 62, 0.413)",textAlign:"center",textShadow: "2px 3px 5px rgba(0,0,0,0.5)",color:"#fff",paddingLeft:"30px",fontFamily:"McLaren",fontSize:"1.2rem"}} name="09:00" className="row time-block">{importEv.evName}</div>,
          <div style={{backgroundColor:"rgba(112, 12, 62, 0.413)",textAlign:"center",textShadow: "2px 3px 5px rgba(0,0,0,0.5)",color:"#fff",paddingLeft:"30px",fontFamily:"McLaren",fontSize:"1.2rem"}} name="10:00" className="row time-block">{importEv.evName}</div>,
          <div style={{backgroundColor:"rgba(112, 12, 62, 0.413)",textAlign:"center",textShadow: "2px 3px 5px rgba(0,0,0,0.5)",color:"#fff",paddingLeft:"30px",fontFamily:"McLaren",fontSize:"1.2rem"}} name="11:00" className="row time-block">{importEv.evName}</div>,
          <div style={{backgroundColor:"rgba(112, 12, 62, 0.413)",textAlign:"center",textShadow: "2px 3px 5px rgba(0,0,0,0.5)",color:"#fff",paddingLeft:"30px",fontFamily:"McLaren",fontSize:"1.2rem"}} name="12:00" className="row time-block">{importEv.evName}</div>,
          <div style={{backgroundColor:"rgba(112, 12, 62, 0.413)",textAlign:"center",textShadow: "2px 3px 5px rgba(0,0,0,0.5)",color:"#fff",paddingLeft:"30px",fontFamily:"McLaren",fontSize:"1.2rem"}} name="13:00" className="row time-block">{importEv.evName}</div>,
          <div style={{backgroundColor:"rgba(112, 12, 62, 0.413)",textAlign:"center",textShadow: "2px 3px 5px rgba(0,0,0,0.5)",color:"#fff",paddingLeft:"30px",fontFamily:"McLaren",fontSize:"1.2rem"}} name="14:00" className="row time-block">{importEv.evName}</div>,
          <div style={{backgroundColor:"rgba(112, 12, 62, 0.413)",textAlign:"center",textShadow: "2px 3px 5px rgba(0,0,0,0.5)",color:"#fff",paddingLeft:"30px",fontFamily:"McLaren",fontSize:"1.2rem"}} name="15:00" className="row time-block">{importEv.evName}</div>,
          <div style={{backgroundColor:"rgba(112, 12, 62, 0.413)",textAlign:"center",textShadow: "2px 3px 5px rgba(0,0,0,0.5)",color:"#fff",paddingLeft:"30px",fontFamily:"McLaren",fontSize:"1.2rem"}} name="16:00" className="row time-block">{importEv.evName}</div>,
          <div style={{backgroundColor:"rgba(112, 12, 62, 0.413)",textAlign:"center",textShadow: "2px 3px 5px rgba(0,0,0,0.5)",color:"#fff",paddingLeft:"30px",fontFamily:"McLaren",fontSize:"1.2rem"}} name="17:00" className="row time-block">{importEv.evName}</div>,
          <div style={{backgroundColor:"rgba(112, 12, 62, 0.413)",textAlign:"center",textShadow: "2px 3px 5px rgba(0,0,0,0.5)",color:"#fff",paddingLeft:"30px",fontFamily:"McLaren",fontSize:"1.2rem"}} name="8:00" className="row time-block">{importEv.evName}</div>,
          <div style={{backgroundColor:"rgba(112, 12, 62, 0.413)",textAlign:"center",textShadow: "2px 3px 5px rgba(0,0,0,0.5)",color:"#fff",paddingLeft:"30px",fontFamily:"McLaren",fontSize:"1.2rem"}} name="19:00" className="row time-block">{importEv.evName}</div>,
          <div style={{backgroundColor:"rgba(112, 12, 62, 0.413)",textAlign:"center",textShadow: "2px 3px 5px rgba(0,0,0,0.5)",color:"#fff",paddingLeft:"30px",fontFamily:"McLaren",fontSize:"1.2rem"}} name="20:00" className="row time-block">{importEv.evName}</div>,
          <div style={{backgroundColor:"rgba(112, 12, 62, 0.413)",textAlign:"center",textShadow: "2px 3px 5px rgba(0,0,0,0.5)",color:"#fff",paddingLeft:"30px",fontFamily:"McLaren",fontSize:"1.2rem"}} name="21:00" className="row time-block">{importEv.evName}</div>,
          <div style={{backgroundColor:"rgba(112, 12, 62, 0.413)",textAlign:"center",textShadow: "2px 3px 5px rgba(0,0,0,0.5)",color:"#fff",paddingLeft:"30px",fontFamily:"McLaren",fontSize:"1.2rem"}} name="22:00" className="row time-block">{importEv.evName}</div>,
          <div style={{backgroundColor:"rgba(112, 12, 62, 0.413)",textAlign:"center",textShadow: "2px 3px 5px rgba(0,0,0,0.5)",color:"#fff",paddingLeft:"30px",fontFamily:"McLaren",fontSize:"1.2rem"}} name="23:00" className="row time-block">{importEv.evName}</div>,
          <div style={{backgroundColor:"rgba(112, 12, 62, 0.413)",textAlign:"center",textShadow: "2px 3px 5px rgba(0,0,0,0.5)",color:"#fff",paddingLeft:"30px",fontFamily:"McLaren",fontSize:"1.2rem"}} name="24:00" className="row time-block">{importEv.evName}</div>,
          <div style={{backgroundColor:"rgba(112, 12, 62, 0.413)",textAlign:"center",textShadow: "2px 3px 5px rgba(0,0,0,0.5)",color:"#fff",paddingLeft:"30px",fontFamily:"McLaren",fontSize:"1.2rem"}} name="1:00" className="row time-block">{importEv.evName}</div>,
          <div style={{backgroundColor:"rgba(112, 12, 62, 0.413)",textAlign:"center",textShadow: "2px 3px 5px rgba(0,0,0,0.5)",color:"#fff",paddingLeft:"30px",fontFamily:"McLaren",fontSize:"1.2rem"}} name="2:00" className="row time-block">{importEv.evName}</div>,
          <div style={{backgroundColor:"rgba(112, 12, 62, 0.413)",textAlign:"center",textShadow: "2px 3px 5px rgba(0,0,0,0.5)",color:"#fff",paddingLeft:"30px",fontFamily:"McLaren",fontSize:"1.2rem"}} name="3:00" className="row time-block">{importEv.evName}</div>,
          <div style={{backgroundColor:"rgba(112, 12, 62, 0.413)",textAlign:"center",textShadow: "2px 3px 5px rgba(0,0,0,0.5)",color:"#fff",paddingLeft:"30px",fontFamily:"McLaren",fontSize:"1.2rem"}} name="4:00" className="row time-block">{importEv.evName}</div>,
          <div style={{backgroundColor:"rgba(112, 12, 62, 0.413)",textAlign:"center",textShadow: "2px 3px 5px rgba(0,0,0,0.5)",color:"#fff",paddingLeft:"30px",fontFamily:"McLaren",fontSize:"1.2rem"}} name="5:00" className="row time-block">{importEv.evName}</div>]
        console.log(stored)
  
        
          let indexPos = { //track where event begins/ends to fill in between with visual indicator
            startInd: 100,
            endInd: 100
          }
          let renderArray = stored.map((n,index)=>{

            if(n.props.name === importEv.timeStart){ //starting block
             console.log(importEv.evName + "Starts at " + n.props.name)
             indexPos.startInd = index
            
             return storedActive[index]
            } else if( n.props.name===importEv.timeEnd){ //ending block
           console.log(importEv.evName + "ends at " + n.props.name)
           indexPos.endInd = index
           return storedActive[index]
            }else if(indexPos.startInd<index && indexPos.endInd > index){ //block in between (array order is appropriate for this)
              return storedActive[index]
            } else{
             console.log(n.props.name) //return a NON-active class div
            return n
            }
      
          })
          
        

        return (
         <div className="row events">
         <div className="col">


         {renderArray.map((n)=>{
           return n
         })}
        
         </div>
         </div>
        )
     
         } 


        return(
            
            <div className="br-white">
            <div className="day-title centered">
            <span><button onClick={addEvent}>New Event</button> </span>
            {evEditor && 
            <div>
              <form onChange={handleChange}>
                <input name="evName" id="evName" placeholder="Event Name" value={form.evName}></input>
                <textarea name="evDescription" id="evDescription" placeholder="Description" value={form.evDescription}></textarea>
                <label for="timeStart">Start Time:</label>
                <input name="timeStart" id="timeStart" type="time" style={{textAlign:"center"}} value={form.timeStart}></input>
                <label for="timeEnd">End Time:</label>
                <input name="timeEnd" id="timeEnd" type="time" style={{textAlign:"center"}} value={form.timeEnd}></input>
                <div >
                <label for="multi">Multiple Day Event</label>
                <input name="multi" onClick={toggleMulti} id="multi" type="radio" value={form.multi}></input>
              
                
                </div>
                <button type="submit" method="post" onClick={saveEvent}>Save</button>
                
              </form>
              {multi &&
              <div>
              <div>
              <h3 name="startDate" id="startDate" name="startDate">Start Date: {form.startDate} </h3><button onClick={toggleStartEnd} id="startDate" name="toggleStart">Select</button>
              <h3 name="endDate" id="endDate" name="endDate">End Date: {form.endDate}</h3><button onClick={toggleStartEnd} id="endDate" name="toggleEnd">Select</button>
              </div>
    
                <Calendar
                value={value}
                onChange={onChange}
                selectRange={false}
                showWeekNumbers={false}
               onClickDay={clickRange}
              
                 />
                 </div>
                }
            </div>

           }
            <div className="title-card">
            
            <p>{weekday} <span style={{color:"#224663"}}> {currDate}</span></p>
            </div>
                
            </div>
            <div className="container-xl">
          
            <div className="row border-top">
            <div className="col-2 time-col centered">
              <div className="timestamp">6:00a</div>
              <div className="timestamp">7:00a</div>
              <div className="timestamp">8:00a</div>
              <div className="timestamp">9:00a</div>
              <div className="timestamp">10:00a</div>
              <div className="timestamp">11:00a</div>
              <div className="timestamp">12:00p</div>
              <div className="timestamp">1:00p</div>
              <div className="timestamp">2:00p</div>
              <div className="timestamp">3:00p</div>
              <div className="timestamp">4:00p</div>
              <div className="timestamp">5:00p</div>
              <div className="timestamp">6:00p</div>
              <div className="timestamp">7:00p</div>
              <div className="timestamp">8:00p</div>
              <div className="timestamp">9:00p</div>
              <div className="timestamp">10:00p</div>
              <div className="timestamp">11:00p</div>
              <div className="timestamp">12:00a</div>
              <div className="timestamp">1:00a</div>
              <div className="timestamp">2:00a</div>
              <div className="timestamp">3:00a</div>
              <div className="timestamp">4:00a</div>
              <div className="timestamp">5:00a</div>
              
            </div>
            <div className="col days-col">
            
           <EventRows/>

              </div>
              </div>
          
            </div>
            
            
          </div>
        )
    }
    



    // Week view, option
    function Week(props){

      const hours = []
      for(var i=6;i<12;i++){ //fill hours array so we can .map. for loops don't work in JSX expressions
        hours.push(i + ":00am")
      }
      hours.push(12 + ":00pm")
      for(var i=1;i<12;i++){ //fill hours array so we can .map. for loops don't work in JSX expressions
        hours.push(i + ":00pm")
      }
      hours.push(12 + ":00am")
      for(var i=1;i<6;i++){ //fill hours array so we can .map. for loops don't work in JSX expressions
        hours.push(i + ":00am")
      }
    
      // event listener for onClick events
      function targetTimeWeek(e,id){
        console.log(hours)
        console.log("click event on time block")
        console.log(id)
      }


      function HourPerDay(props){ //24 of these mapped instead of just plain rows per hour. Props.hour for every hour on clock.
        
        function targetTime(e){
          console.log("targetTime")
          console.log(e.target.id)
          const passedId = e.target.id
          props.getTimeValue(e,passedId) //needed to pass the event UP to week in order to register the click event, to READ the e.target.name in week level, bc it's value comes from props not yet determined here
        }
        return(
          <div hour={props.hour} className="row time-block">
          <div id={"mon"+ " " + props.hour} name={"mon"+ " " + props.hour} onClick={targetTime} className="col hour-per-day"></div>
          <div id={"tue"+ " " + props.hour} name={"tue" + " " + props.hour} onClick={targetTime} className="col hour-per-day"></div>
          <div id={"wed"+ " " + props.hour} name={"wed"+ " " + props.hour} onClick={targetTime} className="col hour-per-day"></div>
          <div id={"thu"+ " " + props.hour} name={"thu"+ " " + props.hour} onClick={targetTime} className="col hour-per-day"></div>
          <div id={"fri"+ " " + props.hour} name={"fri"+ " " + props.hour} onClick={targetTime} className="col hour-per-day"></div>
          <div id={"sat"+ " " + props.hour} name={"sat"+ " " + props.hour} onClick={targetTime} className="col hour-per-day"></div>
          <div id={"sun"+ " " + props.hour} name={"sun"+ " " + props.hour} onClick={targetTime} className="col hour-per-day"></div>
  
          </div>
          )
        }
        // Week Render Statement
        return(
            <div className="">
  <div className="container-xl">

  <div className="row">
  <div className="col-3 time-col centered">
            
  {/* <div onClick={toggleView} className="timestamp">Toggle View</div> */}

  <div className="timestamp">6:00a</div>
              <div className="timestamp">7:00a</div>
              <div className="timestamp">8:00a</div>
              <div className="timestamp">9:00a</div>
              <div className="timestamp">10:00a</div>
              <div className="timestamp">11:00a</div>
              <div className="timestamp">12:00p</div>
              <div className="timestamp">1:00p</div>
              <div className="timestamp">2:00p</div>
              <div className="timestamp">3:00p</div>
              <div className="timestamp">4:00p</div>
              <div className="timestamp">5:00p</div>
              <div className="timestamp">6:00p</div>
              <div className="timestamp">7:00p</div>
              <div className="timestamp">8:00p</div>
              <div className="timestamp">9:00p</div>
              <div className="timestamp">10:00p</div>
              <div className="timestamp">11:00p</div>
              <div className="timestamp">12:00a</div>
              <div className="timestamp">1:00a</div>
              <div className="timestamp">2:00a</div>
              <div className="timestamp">3:00a</div>
              <div className="timestamp">4:00a</div>
              <div className="timestamp">5:00a</div>
            </div>
  <div className="col days-col">
  <div className="row days-row">
    <div name="mon" className="col weekday no-border-left">monday</div>
    <div name="tue" className="col weekday no-border-left">tuesday</div>
    <div name="wed" className="col weekday no-border-left">wednesday</div>
    <div name="thu" className="col weekday no-border-left">thursday</div>
    <div name="fri" className="col weekday no-border-left">friday</div>
    <div name="sat" className="col weekend no-border-left">saturday</div>
    <div name="sun" className="col weekend no-border-left">sunday</div>
    </div>

    <div className="row events">
    <div className="col">
    { hours.map((val,ind)=>{
      return <HourPerDay 
        hour={val} //format back from "military" time
        getTimeValue={targetTimeWeek}
      />

    })
    
    }
   
    </div>
    </div>
    
    </div>
    </div>

  </div>
  
  
</div>
        )
    }
   
   
    
      //Top Level render statement
    return(
        <div>
        <Header
            userNameGreeting={useContext(userContext)}
        />
        {view === "day" && <Day/>}
        
        {view ==="week" &&<Week/>}
            
        </div>
    )
}

export default Events;