import {useContext, useState,useEffect} from "react"
import React from "react"
import Header from "./Header";
import Calendar from "react-calendar"
import {credentialContext, userContext} from "./App"
import {dayContext} from "./Scheduler" //access date value for selected day
import axios from "axios";

function Events(props){ //testing to see in synchronous form when renders occur
  

const queryParams = useContext(credentialContext) //exported from <App />, gives username/email for db Queries
console.log("queryParams:")
console.log(queryParams)
  const [view,setView] = useState("day")
  const [evEditor, setEvEditor] = useState(false)
  const [multi,setMulti] = useState(false)
  const [eventCard, setEventCard] = useState("") //the JSX for ev-modal hover box will be set as state to return value
  // const [selectedEvNum, setSelectedEvNum] = useState("")
const [errorLength,setErrorLength] = useState(false)
const [errorIncomplete, setErrorIncomplete] = useState(false)
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
const [fetchComplete,setFetchComplete] = useState(false)

function closeEditor(){
  
  
  // formData = {
  //   evName: "",
  //   evDescription: "",
  //   startDate:fullDate,
  //   endDate:fullDate,
  //   timeStart: "",
  //   timeEnd: "",
  // }
  //  sessionStorage.setItem("form",JSON.stringify(formData))
  // setForm(formData)
  // // sessionStorage.setItem("form",JSON.stringify(formData))
  setEvEditor(false)
}

useEffect(()=>{
  let fetchData={
    fullDate:fullDate,
    queryParams:queryParams
  }
  
  axios.post("/events/fetch",fetchData)
  .then((res)=>{
    console.log("FETCH RESPONSE:")
    console.log(res.data)
    sessionStorage.setItem("eventList",JSON.stringify(res.data))
    eventListData = JSON.parse(sessionStorage.getItem("eventList"))
    !fetchComplete && setEventList(res.data) //prevent loop by setting conditional-should only setEventList once.
    setFetchComplete(true) 
    console.log("fetchComplete =")
    console.log(fetchComplete)
    // location.reload() LOOP
  })
  .catch((err)=>console.log(err))
},[])


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

},[eventList])

// useEffect(()=>{
//   console.log("RENDER has just occurred")
//   console.log("value of eventList:")
//   console.log(eventList)
//   console.log("value of eventListData:")
//   console.log(eventListData)
// })
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
  setErrorIncomplete(false)
      setErrorLength(false)
  
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

      // axios.post("/events/save",form)
      // .then((res)=>{
      //   console.log(res.data)
      // })
      // .catch((err)=>console.log(err))
      // function to render event blocks on day view UI
      let data = {
        eventList: eventList,
        fullDate: fullDate,
        queryParams: queryParams
      }
      axios.post("/events/update",data) //update DB after every completion of UI CRUD to synchronize
      .then((res)=>{
    console.log(res.data)
      })
      .catch((err)=>console.log(err))
      setForm({
        evName: "",
        evDescription: "",
        startDate:fullDate,
        endDate:fullDate,
        timeStart: "",
        timeEnd: ""
      })
      setEvEditor(false)
      
          } else if(eventList.length>2){
            setErrorLength(true)
            setErrorIncomplete(false)
             console.log(" too many events")
    } else{
      setErrorLength(false)
            setErrorIncomplete(true)
    }
  }

    function editEvent(obj){ 
      //first, delete the selected event locally (updated eventList will be set when save() function fires after user edits and save)
      let updated = []
      let copyOfEvents = eventListData.slice(0)
       copyOfEvents.map((event,ind)=>{
         console.log(event.evName == obj.evName ?  "MATCH" : "NO MATCH")
        if (event.evName == obj.evName && event.evDescription == obj.evDescription && obj.timeStart == event.timeStart){
          console.log("delete this one...")
        }else{
          updated.push(event)
        }
      })
      
      sessionStorage.setItem("eventList",JSON.stringify(updated))
      eventListData = updated
      setEventList(updated)
      setEventCard("") //remove modal box & revert to default view
      
      document.body.scrollTop = 25; //scroll top, Safari
      document.documentElement.scrollTop = 25; //scroll top, Chrome, FireFox, IE , Opera
      console.log("eventListData:")
      console.log(eventListData)
 
      //deleteEvent(obj) //delete is called which trigers useEffect for eventList. Remove this for now and delete using the logic that will happen in useEffetc
      setForm(obj) //when state is changed, other statefuls don't have to change, but the vanilla code is run again. Ergo, eventList is set from SESSION.
     addEvent()
     setEventCard("")
    
    }

    function deleteEvent(obj){ //passes eventInfo object to be compared against each event entry. Deletes match
     console.log("DELETE function called")
      let updated = []
      let copyOfEvents = eventListData.slice(0)
       copyOfEvents.map((event,ind)=>{
         console.log(event.evName == obj.evName ?  "MATCH" : "NO MATCH")
        if (event.evName == obj.evName && event.evDescription == obj.evDescription && obj.timeStart == event.timeStart){
          console.log("delete this one...")
        }else{
          updated.push(event)
        }
      })
      
      sessionStorage.setItem("eventList",JSON.stringify(updated))
      eventListData = updated
      setEventList(updated)
      setEventCard("")
      console.log("eventListData:")
      console.log(eventListData)
      //send updated to server
        let dataObj = {
        eventList: eventListData,
        fullDate: fullDate,
        queryParams: queryParams
      }
      axios.post("/events/update",dataObj) //update DB after every completion of UI CRUD to synchronize
      .then((res)=>{
    console.log(res.data)
   
      })
      .catch((err)=>console.log(err))
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
          
          function convertMilitary(str){
            
            console.log(str + "converted to: ")
            if(str[0]+str[1] == "00"){
              str="12" + str.slice(2) + "am"
            }
            else if(str[0] == "0"){
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
            <div className="ev-modal ">
            <div className="ev-modal-content container indigo-gradient">
            <div className="row">
              <div className="col">
              <button className="indigo-gradient save-btn-sm" onClick={()=>setEventCard("")}><i class="fas fa-times icon-pad"></i></button>
              </div>
              <div className="col">
              <button className="peach-gradient save-btn-sm" onClick={()=>editEvent(eventInfo)}><i class="fas fa-pencil-alt icon-pad"></i></button>
              </div>
              <div className="col">
              <button className="magenta-gradient save-btn-sm" onClick={()=>deleteEvent(eventInfo)}><i class="fas fa-trash-alt icon-pad"></i></button>
              </div>
            </div>
           
            <p className="ev-modal-title">{eventInfo.evName}</p>
              <p className="ev-modal-text">{eventInfo.evDescription}</p>
            
             
              <h4>Start Time: {convertMilitary(eventInfo.timeStart)}</h4>
              <h4>End Time: {convertMilitary(eventInfo.timeEnd)}</h4>
              </div>
             </div>
          )
          
        }
        
        let render1;
        let render2;
        let render3;
        let render4;
        
          const storedActive = ["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24"]
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
          // console.log(render1)
          n= <div name="4:00" className="row time-block">  
          {render1 ? <div id="0" name="event1" onClick={showEvent} className="col-3 render-event indigo-gradient shadowtext-sm" style={{textAlign:"center",color:"white",margin:"0 4px"}} >{eventList[0].evName}</div> : <div className="col-3"style={{margin:"0 4px",paddingTop:"5px"}}></div>}
        {render2 ? <div id="1" name="event2" onClick={showEvent} className="col-3 render-event peach-gradient shadowtext-sm" style={{textAlign:"center",color:"white",margin:"0 4px"}}>{eventList[1].evName}</div> : <div className="col-3"style={{margin:"0 4px",paddingTop:"5px"}}></div>}
        {render3 ? <div id="2" name="event3" onClick={showEvent} className="col-3 render-event magenta-gradient shadowtext-sm" style={{textAlign:"center",color:"white",margin:"0 4px"}}>{eventList[2].evName}</div> : <div className="col-3"style={{margin:"0 4px",paddingTop:"5px"}}></div>}
        </div>
          //if all render variables are false, div renders just like "stored", with no "active" colored columns
          mapResults.push(n) //render div n, which will evaluate the values of render1, render2 etc before rendering any columns. render1 etc reset after each iteration, giving fresh start for evaluation
        }
        )

      
    return(
        <div className="">
        <Header
            userNameGreeting={useContext(userContext)}
        />
        {/* {view === "day" && <Day/>}
        
        {view ==="week" &&<Week/>} */}
        {/* <Day/> */}
         <div className="br-white mclaren">
            <div className="day-title centered">
            <div className="title-card peach-gradient">
            
            <p className="">{weekday} <span className=""style={{color:"#224663"}}> {currDate}</span></p>
            </div>
            {eventCard}
            <span><button className={"save-btn title-card-btn"} onClick={addEvent}>New Event</button> </span>
            {evEditor && 
            <div>
              <form onChange={handleChange}>
                <input name="evName" id="evName" placeholder="Event Name" value={form.evName} maxLength="35"></input>
                <textarea name="evDescription" id="evDescription" placeholder="Description" value={form.evDescription} maxLength="70"></textarea>
                <label for="timeStart">Start Time:</label>
                <input name="timeStart" id="timeStart" type="time" style={{textAlign:"center"}} value={form.timeStart}></input>
                <label for="timeEnd">End Time:</label>
                <input name="timeEnd" id="timeEnd" type="time" style={{textAlign:"center"}} value={form.timeEnd}></input>
                <div >
                {/* <label for="multi">Multiple Day Event</label>
                <input name="multi" onClick={toggleMulti} id="multi" type="radio" value={form.multi}></input> */}
                
                <button type="submit" method="post" onClick={saveEvent} className="save-btn-sm"><i class="fas fa-check"></i></button>
                </div>
                
                
                <button className="save-btn-sm magenta-gradient"  onClick={()=>closeEditor}><i class="fas fa-times"></i></button>
              </form>
              {errorIncomplete && <div className="errMessage"><p>Please complete all fields & ensure valid start/end times.</p></div>}
              {errorLength && <div className="errMessage"><p>You're doing alot huh? The current limit is 3 events per day & is being increased soon. Apologies!</p></div>}
              {/* {multi &&
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
                } */}
            </div>

           }
           
                
            </div>
            <div className="container-xl">
          
            <div className="row border-top no-margin no-border-right">
            <div className="col-2 time-col centered periwinkle-gradient">
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
           {/* console.log(n) */}
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