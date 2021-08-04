import React from "react";
import {useState} from "react"



function Note(props) {
  const [inputTitle,setInputTitle] = useState("")
  const [inputText,setInputText] = useState("")
const [editState, setEditState] = useState(false)
  function handleClick(){
    props.onDelete(props.id)
  }
  function handleEdit(event){
    props.onEdit(props.id, props.title, props.content)
   
// if(event.target === inputTitle){
//   setInputTitle(props.title)
// } else if(event === inputText){
//   setInputText(props.content)
// } 
  }
  function handleEditClick(event){
    
    const {name,value} = event.target;
    setNote(prevNote=> {
        return {
            ...prevNote,
            [name]: value
        }
    })
    console.log(name)
    console.log(value)
    
  }
 
  return (
    
    <div className="note">
    
      <h1 onClick={handleEdit} >{props.title}</h1>
      <p onClick={handleEdit} >{props.content}</p>
    
    
      <button onClick={handleClick}>DELETE</button>
    </div>
   
  );
}

export default Note;