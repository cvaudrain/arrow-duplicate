import {useContext, useState,useEffect} from "react"
import React from "react"
import Header from "./Header";
import Calendar from "react-calendar"
import {credentialContext, userContext} from "./App"
import {dayContext} from "./Scheduler" //access date value for selected day
import axios from "axios";

function Events(props){
const queryParams = useContext(credentialContext) //exported from <App />, gives username/email for db Queries
console.log("queryParams:")
console.log(queryParams)
  const [view,setView] = useState("day")
  const [evEditor, setEvEditor] = useState(false)
  const [multi,setMulti] = useState(false)
  const [eventCard, setEventCard] = useState("")
  // const [selectedEvNum, setSelectedEvNum] = useState("")

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
//Get Fuill List of saved events data
let eventListData;
if(sessionStorage.getItem("eventList")!= undefined){
  eventListData = JSON.parse(sessionStorage.getItem("eventList"))
} else{
  eventListData=[]
}
const [value, onChange] = useState(new Date()); //per React Calendar Docs: current date value returned from value state

const [form, setForm] = useState(formData)
const [eventList,setEventList]  = useState(eventListData)


useEffect(()=>{ //if re-render to render calendar for nmulti-day, form entered values are preserved i nsessionStorage.
  sessionStorage.setItem("form",JSON.stringify(form))
  console.log(sessionStorage.getItem("form"))
  setEventList(eventListData)
  console.log("form after useEffect")
  console.log(form)
},[form])
let eventContext = React.createContext(form)

useEffect(()=>{ //if re-render to render calendar for nmulti-day, form entered values are preserved i nsessionStorage.
  sessionStorage.setItem("eventList",JSON.stringify(eventList))
  eventListData = eventList
  console.log("event list")
  console.log(sessionStorage.getItem("eventList"))
  console.log("stateful eventList")
  console.log(eventList)

  axios.post("/events/update",eventList) //update DB after every completion of UI CRUD to synchronize
  .then((req,res)=>{
console.log(res.data)
  })
  .catch((err)=>console.log(err))

},[eventList])

    // Day View, default
    // function Day(props){

function toggleMulti(){
multi ? setMulti(false) : setMulti(true)
}
//Get Individual Event Form Data
let eventListContext = React.createContext(eventList)

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

  function addEvent(){
    console.log("add event")
  setEvEditor(true)
  
  }

  function saveEvent(e){
    e && e.preventDefault()
      console.log("save event")
      console.log(form)
      let validTime = form.timeStart.slice(0,2) + form.timeStart.slice(4) < form.timeEnd.slice(0,2) + form.timeEnd.slice(4)
      console.log(validTime)
      if(form.evName.length > 0 && form.timeStart.length > 0 && form.timeEnd.length > 0 && validTime && eventList.length<3){ //auth complete form and valid time range
      eventListData.push(form)
      sessionStorage.setItem("eventList",JSON.stringify(eventListData))

      axios.post("/events/save",form)
      .then((res)=>{
        console.log(res.data)
      })
      .catch((err)=>console.log(err))
      // function to render event blocks on day view UI
      
      setForm({
        evName: "",
        evDescription: "",
        startDate:fullDate,
        endDate:fullDate,
        timeStart: "",
        timeEnd: ""
      })
      setEvEditor(false)
      
          } else{ console.log("Please complete form / too many events")}
    }

    function editEvent(obj){ //setForm is called which triggers useEffect. The value we set with setEventList originates in session,->eventListData, THEN setState. 
      //so we need to directly change the highest level, sesssionStorage list value, if we want that to continue using it or else it will reset the eventList to the prev val, from sessionStorage. Start by getting updated list, just like deleteEvent does
      let updated = eventListData.filter((eventDetails)=>{ 
        if (eventDetails != obj){
          return eventDetails
        }
      })
      sessionStorage.setItem("eventList",JSON.stringify(updated))  //Set session data here before state update, so that when setForm is called and code re-runs,  
      //deleteEvent(obj) //delete is called which triggers useEffect for eventList. Remove this for now and delete using the logic that will happen in useEffetc
      setForm(obj) //when state is changed, other statefuls don't have to change, but the vanilla code is run again. Ergo, eventList is set from SESSION.
     addEvent()
     setEventCard("")
    //  sessionStorage.setItem("form",JSON.stringify(obj))
    //  setForm(obj)
    // saveEvent()
     console.log("form currently: ")
     console.log(form)
    
     setEventCard("")
     alert("edit complete")
    }

    function deleteEvent(obj){ //passes eventInfo object to be compared against each event entry. Deletes match
     console.log("delete function called")
      let updated = eventListData.filter((eventDetails)=>{
        if (eventDetails != obj){
          return eventDetails

        }
      })
      console.log(updated)
      eventListData = updated
      console.log(eventListData)
      setEventList(updated)
      setEventCard("")
      
      
    }

      //Event Row Component: <EventRows /> Parent: <Day/> Recieves: eventContext, drawing value from state variable "form"
      // function EventRows(props){
    
        // const eventList = useContext(eventListContext)
        
        let eventInfo; //changes based on currently selected event & used to re-populate form on editForm()
        console.log("event context in eventRows")
        console.log(eventList)
      
        function showEvent(e){
          let eventId = e.target.id
          let eventNum;
          console.log(eventNum)
          console.log(eventId)
          eventInfo = eventList.filter((n,i)=>{
            eventNum =i //sets event number to specify for deletion
           return i== eventId && n
          })
          // setSelectedEvNum(eventNum)
          eventInfo = eventInfo[0]
          console.log(eventInfo)
          let keyList = Object.keys(eventInfo)
          let valueList = Object.values(eventInfo)
          console.log(" keys and values:")
          console.log(keyList)
          console.log(valueList)
          
          function convertMilitary(str){
            
            console.log(str + "converted to: ")
            if(str[0] == "0"){
               str = str.slice(1) + "am"
          } else if(+str.slice(0,2) > 12){
            let hours = +str.slice(0,2)
            hours-=12
            hours = hours.toString()
            str = hours + str.slice(2) + "pm"
          } else if(str.slice(0,2) == "11" || str.slice(0,2) == "10" ){
            str = str + "am"
          }
          else if(str.slice(0,2) == "12"){
            str = str + "pm"
          }
          console.log(str)
          return str

        }
          setEventCard(
            <div class="ev-modal">
            <div class="ev-modal-content">
            <div class="row">
              <div class="col">
              <button style = {{textShadow:"textShadow: 2px 1px 3px black",borderRadius:"10px",padding:"3px",background:"#76baff",color:"white"}} onClick={()=>setEventCard("")}><p style={{textShadow:"2px 1px 2px black",paddingTop:"5px"}}>Close</p></button>
              </div>
              <div class="col">
              <button style = {{textShadow:"textShadow: 2px 1px 3px black",borderRadius:"10px",padding:"3px",background:"#eea15a",color:"white"}} onClick={()=>editEvent(eventInfo)}><p style={{textShadow:"2px 1px 2px black",paddingTop:"5px"}}>Edit</p></button>
              </div>
              <div class="col">
              <button style = {{textShadow:"textShadow: 2px 1px 3px black",borderRadius:"10px",padding:"3px",background:"rgba(195, 70, 97)",color:"white"}} onClick={()=>deleteEvent(eventInfo)}><p style={{textShadow:"2px 1px 2px black",paddingTop:"5px"}}>Delete</p></button>
              </div>
            </div>
            
              <h1>{eventInfo.evName}</h1>
              <h2>{eventInfo.evDescription}</h2>
              <h3>Start Time: {convertMilitary(eventInfo.timeStart)}</h3>
              <h3>End Time: {convertMilitary(eventInfo.timeEnd)}</h3>
              </div>
             </div>
          )
          
        }
        
        let render1;
        let render2;
        let render3;
        let render4;
        
          const storedActive = ["01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24"]
        const mapResults = []
        storedActive.map((n)=>{ //iterate through array of divs (n=div[n]) ONCE, evaluating which event column if any to render based on ternaries, when div renders (return n)
          let colTime = +n
          //determine if ev col 1 renders in div
          if(eventList.length>=1){ //make sure it exists or .timeStart etc will return undefined and crash. If length not met, no  nested evalations. faster and no undefined erors
            if( +eventList[0].timeStart.slice(0,2) <= colTime && +eventList[0].timeEnd.slice(0,2) >= colTime){
            render1 = true
          }else render1 = false
          }
           //and column for event 2
          if(eventList.length >=2){
            if(+eventList[1].timeStart.slice(0,2) <= colTime && +eventList[1].timeEnd.slice(0,2) >= colTime){
            render2 = true
          }else render2 = false
          }
          //and 3rd event
          if(eventList.length>= 3){
            if(+eventList[2].timeStart.slice(0,2) <= colTime && +eventList[2].timeEnd.slice(0,2) >= colTime){
            render3 = true
          }else render3 = false
          }
          console.log(render1)
          n= <div name="4:00" className="row time-block">
          {render1 ? <div id="0" name="event1" onClick={showEvent} className="col-3" style ={{cursor:"pointer", boxShadow: "inset", margin:"0 4px", borderRadius:"1px",backgroundColor:"rgba(112, 12, 62, 0.413)",textAlign:"center",textShadow: "2px 3px 5px rgba(0,0,0,0.5)",color:"#fff",paddingLeft:"4%",fontFamily:"McLaren",fontSize:"1rem"}} >{eventList[0].evName}</div> : <div className="col-3"style={{margin:"0 4px",paddingTop:"5px"}}></div>}
        {render2 ? <div id="1" name="event2" onClick={showEvent} className="col-3" style ={{cursor:"pointer", boxShadow: "inset", margin:"0 4px", borderRadius:"1px",backgroundColor:"#0b819e",textAlign:"center",textShadow: "2px 3px 5px rgba(0,0,0,0.5)",color:"#fff",paddingLeft:"4%",fontFamily:"McLaren",fontSize:"1rem"}}>{eventList[1].evName}</div> : <div className="col-3"style={{margin:"0 4px",paddingTop:"5px"}}></div>}
        {render3 ? <div id="2" name="event3" onClick={showEvent} className="col-3" style ={{cursor:"pointer", boxShadow: "inset", margin:"0 4px", borderRadius:"1px",backgroundColor:"#31b08a",textAlign:"center",textShadow: "2px 3px 5px rgba(0,0,0,0.5)",color:"#fff",paddingLeft:"4%",fontFamily:"McLaren",fontSize:"1rem"}}>{eventList[2].evName}</div> : <div className="col-3"style={{margin:"0 4px",paddingTop:"5px"}}></div>}
        </div>
          //if all render variables are false, div renders just like "stored", with no "active" colored columns
          mapResults.push(n) //render div n, which will evaluate the values of render1, render2 etc before rendering any columns. render1 etc reset after each iteration, giving fresh start for evaluation
        }
        )

      
    return(
        <div>
        <Header
            userNameGreeting={useContext(userContext)}
        />
        {/* {view === "day" && <Day/>}
        
        {view ==="week" &&<Week/>} */}
        {/* <Day/> */}
        <div className="br-white">
            <div className="day-title centered">
            <div className="title-card">
            
            <p>{weekday} <span style={{color:"#224663"}}> {currDate}</span></p>
            </div>
            {eventCard}
            <span><button className={"add-btn"} onClick={addEvent}>New Event</button> </span>
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
                {/* <label for="multi">Multiple Day Event</label>
                <input name="multi" onClick={toggleMulti} id="multi" type="radio" value={form.multi}></input> */}
                
                <button type="submit" method="post" onClick={saveEvent}>Save</button>
                </div>
                
                
                <button style = {{textShadow:"textShadow: 2px 1px 3px black",borderRadius:"50%",padding:"1px",background:"rgba(195, 70, 97)",color:"white",width:"30px",height:"30px",marginTop:"10px"}} onClick={()=>setEvEditor(false)}>X</button>
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
           
                
            </div>
            <div className="container-xl">
          
            <div className="row border-top">
            <div className="col-2 time-col centered">
            <div className="timestamp">12:00a</div>
              <div className="timestamp">1:00a</div>
              <div className="timestamp">2:00a</div>
              <div className="timestamp">3:00a</div>
              <div className="timestamp">4:00a</div>
              <div className="timestamp">5:00a</div>
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
              
              
            </div>
            <div className="col days-col">
            
           {/* <EventRows/> */}
           <div className="row events">
         <div className="col">


         {/* {renderArrayHold.map((n)=>{
           return n
         })} */}
         {mapResults.map((n)=>{
           console.log(n)
          return n
         })}
        
         </div>
         </div>

              </div>
              </div>
          
            </div>
            
            
          </div>
        
            
        </div>
    )
}

export default Events;