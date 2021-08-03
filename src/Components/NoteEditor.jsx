import {useState} from "react"
import React from "react"


function NoteEditor(props){
    // import App, {id,title,content} from "./App";
    const [editedNote,setEditedNote] = useState({
        id: id,
        title: title,
        content: content
    })
 console.log(editedNote) //did we import successfully?
//set fullscreen
 const editorStyle = {
    height: "100vh",
    width: "100vw"
    }

    function handleEdit(event){

        //name is either title or content. value is the 
        //string value for text or content, whichever is being edited
        //prevNote will hold value for unedited value. setting new 
        //key/value pair will overwrite the existing one with same key. 
        const {name,value} = event.target;
        setEditedNote(prevNote=> {
            return {
                ...prevNote,
                [name]: value
            }
        })
    }

    function submitEditedNote(event){
        props.onEditSubmit(editedNote)

       //below resets the setEdited Note to empty, so thisstate can be
       //used to edit other noptes in future. 
        setEditedNote({
            title:"",
            content: ""
        })
        event.preventDefault();  //stops reload on submission of form
    }
    //return FULLSCREEN Note or darken background and enlarge editor
    return(
        <div style={editorStyle}>
            <form>
                <input onChange={handleEdit} name="title" value={editedNote.title} placeholder="Title"/>
                <textarea onChange={handleEdit} name="content" value={editedNote.content} placeholder="Take a Note" row="3"/>
                <button onClick={submitEditedNote}>Add</button>
            </form>
        </div>
    )
}


export default NoteEditor