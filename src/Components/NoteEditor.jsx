import {useContext, useState} from "react"
import React from "react"
import Header from "./Header";

function NoteEditor(props){
    // const selectedContext = React.createContext(props.context)

    // import App, {id,title,content} from "./App";
    const [editedNote,setEditedNote] = useState({
        id: props.populateId,
        title: props.populateTitle,
        content: props.populateContent
    })
 
//set fullscreen
 const editorStyle = {
    height: "60vh",
    width: "90vw"
    }
    const textAreaStyle = {
        height: "50vh",
        width: "80vw"
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
        console.log(name)
        console.log(value)
    }

    function submitEditedNote(event){ 
        
        props.onEditSubmit(editedNote) //handleEdit on the other hand DOES work bc it is here. 
//editedNote is the right value,  but we're treating this like a controlled component,
//and it is not

       //below resets the setEdited Note to empty, so thisstate can be
       //used to edit other noptes in future. 
        setEditedNote({
            id: "",
            title:"",
            content: ""
        })
        event.preventDefault();  //stops reload on submission of form
    }
    //return FULLSCREEN Note or darken background and enlarge editor
    return(
        <div>
        
            <form style={editorStyle} >
                <input onChange={handleEdit} name="title" value={editedNote.title} placeholder="Title"/>
                <textarea style={textAreaStyle} onChange={handleEdit} name="content" value={editedNote.content} placeholder="Take a Note" row="3"/>
                <button onClick={submitEditedNote}>Add</button>
            </form>
        </div>
    )
}


export default NoteEditor