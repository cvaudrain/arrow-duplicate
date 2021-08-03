import React from "react";
import {useState} from "react"



function Note(props) {
  const [inputTitle,setInputTitle] = useState("")
  const [inputText,setInputText] = useState("")

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
  function handleEditClick(){
    props.editNote(props.id)
  }
 
  function test(){
    console.log(props.content)
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