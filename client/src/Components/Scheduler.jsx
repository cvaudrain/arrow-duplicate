import React, {useState, useEffect, useContext} from "react"
import Calendar from "react-calendar"
// import "react-calendar/dist/Calendar.css"

//Need a function that returns the Date component- have to go editing around in the imported Calendar child components
function Scheduler(){
    const [value, onChange] = useState(new Date());
    const styling={
        width: "80vw"
    }
    return(
        <div className="calendar-container">
            <Calendar 
                value={value}
                onChange={onChange}
            />
        </div>
    );
}

export default Scheduler