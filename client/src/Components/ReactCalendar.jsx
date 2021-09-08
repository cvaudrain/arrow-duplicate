import React, {useState} from "react"
import Calendar from "react-calendar"
// import "react-calendar/dist/Calendar.css"
function ReactCalendar(){
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

export default ReactCalendar