import {useState} from "react"
import React from "react"

function CreateArea(props){

    const [note,setNote] = useState({
        title: "",
        content: ""
    })
 
    function handleChange(event){
        const {name,value} = event.target;
        setNote(prevNote=> {
            return {
                ...prevNote,
                [name]: value
            }
        })
    }

    function submitNote(event){
        props.onAdd(note)
       
        setNote({
            title:"",
            content: ""
        })
        event.preventDefault();  //stops reload on submission of form
    }
   
    
    return (
        <div>
            <form>
                <input onChange={handleChange} name="title" value={note.title} placeholder="Title"/>
                <textarea onChange={handleChange} name="content" value={note.content} placeholder="Take a Note" row="3"/>
                <button onClick={submitNote}>Add</button>
            </form>
        </div>
    )
}

export default CreateArea