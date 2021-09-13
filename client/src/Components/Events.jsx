import {useContext, useState} from "react"
import React from "react"
import Header from "./Header";
import {userContext} from "./App"
import {dayContext} from "./Scheduler" //access date value for selected day


function Events(props){
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
    // Day View, default
    function Day(props){

        return(
            
            <div className="br-white">
            <div className="day-title centered">
            <span onClick={toggleView}>Toggle View</span>
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

        return(
            <div className="">
  <div className="container-xl">

  <div className="row">
  <div className="col-1 time-col centered">
            
  <div onClick={toggleView} className="timestamp">Toggle View</div>
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
    <div className="col weekday no-border-left">monday</div>
    <div className="col weekday no-border-left">tuesday</div>
    <div className="col weekday no-border-left">wednesday</div>
    <div className="col weekday no-border-left">thursday</div>
    <div className="col weekday no-border-left">friday</div>
    <div className="col weekend no-border-left">saturday</div>
    <div className="col weekend no-border-left">sunday</div>
    </div>

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
   
    return(
        <div>
        <Header
            userNameGreeting={useContext(userContext)}
        />
        <Day/>
        <Week/>
            
        </div>
    )
}

export default Events;