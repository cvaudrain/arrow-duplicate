import React, {useState, useEffect, useContext} from "react"


    // Week view, option
    export default function Week(props){

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