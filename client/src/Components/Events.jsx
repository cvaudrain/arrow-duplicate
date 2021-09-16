import {useContext, useState} from "react"
import React from "react"
import Header from "./Header";
import Calendar from "react-calendar"
import {userContext} from "./App"
import {dayContext} from "./Scheduler" //access date value for selected day


function Events(props){
  const [view,setView] = useState("day")
  const [evEditor, setEvEditor] = useState(false)
  const [multi,setMulti] = useState(false)
  const [startDate,setStartDate] = useState("")
  const [endDate,setEndDate] = useState("")
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

function toggleView(){
    console.log("toggle view fired")
}
function addEvent(){
  console.log("add event")
setEvEditor(true)

}
function saveEvent(e){
e.preventDefault()
  console.log("save event")
}
function clickRange(value){
  
  
}
    // Day View, default
    function Day(props){
function toggleMulti(){
multi ? setMulti(false) : setMulti(true)
}
        return(
            
            <div className="br-white">
            <div className="day-title centered">
            <span><button onClick={addEvent}>New Event</button> </span>
            {evEditor && 
            <div>
              <form>
                <input id="evName" placeholder="Event Name"></input>
                <textarea id="evDescription" placeholder="Description"></textarea>
                <div >
                <label for="multi-yes">Multiple Day Event</label>
                <input onClick={toggleMulti} id="multi-yes" type="radio"></input>
              
                
                </div>
                <button type="submit" method="post" onClick={saveEvent}>Save</button>
                
              </form>
              {multi &&
              <div>
              <div>
              <h3 id="startDate" name="startDate">Start: {startDate} </h3>
              <h3 id="endDate" name="endDate">End: {endDate}</h3>
              </div>
    
                <Calendar
                selectRange={true}
                showWeekNumbers={false}
               onClickDay={clickRange(props.value)}
              
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
            <div className="col-1 time-col centered">
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
            
          
              <div className="row events">
              <div className="col">
             
              <div className="row time-block no-border"></div>
              <div className="row time-block"></div>
              <div className="row time-block"></div>
              <div className="row time-block"></div>
              <div className="row time-block"></div>
              <div className="row time-block"></div>
              <div className="row time-block"></div>
              <div className="row time-block"></div>
              <div className="row time-block"></div>
              <div className="row time-block"></div>
              <div className="row time-block"></div>
              <div className="row time-block"></div>
              <div className="row time-block"></div>
              <div className="row time-block"></div>
              <div className="row time-block"></div>
              <div className="row time-block"></div>
              <div className="row time-block"></div>
              <div className="row time-block"></div>
              <div className="row time-block"></div>
              <div className="row time-block"></div>
              <div className="row time-block"></div>
              <div className="row time-block"></div>
              <div className="row time-block"></div>
              <div className="row time-block"></div>
             
              </div>
              </div>
              
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
  <div className="col-1 time-col centered">
            
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