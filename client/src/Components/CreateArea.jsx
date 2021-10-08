import {useState} from "react"
import React from "react"
let noteValue;


function CreateArea(props){

    const [note,setNote] = useState({
        id: "",
        title: "",
        content: ""
    })
   

 
    function handleChange(event){
        //name is either title or content. value is the 
        //string value for text or content, whichever is being edited
        const {name,value} = event.target;
        setNote(prevNote=> {
            return {
                ...prevNote,
                [name]: value
            }
        })
        console.log(value)
      
    }

    function submitNote(event){
        if(note.title.length == 0 && note.content.length==0){
            console.log("detecting EMPTY NOTE")
            return
        }
        props.onAdd(note)
       noteValue = note;
        setNote({
            id: "",
            title:"",
            content: ""
        })
       
        event.preventDefault();  //stops reload on submission of form
    }

    function submitOnEnter(event){
        event.keyCode === 13 && document.getElementById("submitButton").click()
    }
   
    
    return (
        <div>
            <form className="create-area">
                <input onChange={handleChange}
                 name="title" value={note.title}
                  placeholder="Title"
                   autoComplete="off"/>
                <textarea onKeyDown= {submitOnEnter} 
                type="submit" onChange={handleChange}
                 name="content" value={note.content}
                  placeholder="Take a Note"
                   row="3"
                    autoComplete="off"/>
                <button id="submitButton" className="save-btn-sm" onClick={submitNote}><i class="fas fa-plus"></i></button>
            </form>
        </div>
    )
}

export default CreateArea
export {noteValue}