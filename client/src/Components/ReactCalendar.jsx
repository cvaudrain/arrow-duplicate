import React, {useState} from "react"
import Calendar from "react-calendar"

function ReactCalendar(){
    const [value, onChange] = useState(new Date());

    return(
        <div>
            <Calendar 
                value={value}
                onChange={onChange}
            />
        </div>
    );
}

export default ReactCalendar