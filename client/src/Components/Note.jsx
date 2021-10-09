import React from "react";

function Note(props) {

  function handleClick(){
    props.onDelete(props.id)
  }
  function handleEdit(event){
    props.onEdit(props.id, props.title, props.content)

  }
  
  return (
    <div className="note">

      <h1 onClick={handleEdit} >{props.title.length < 11 ? props.title : props.title.slice(0,11) + " ..."}</h1>
      <p onClick={handleEdit} >{props.content.length<100 ? props.content :props.content.slice(0,100) + "  ..."}</p>
      <button onClick={handleClick}><i class="fas fa-trash-alt red"></i></button>
      <button onClick={handleEdit}><i class="fas fa-pencil-alt orange"></i></button>
     
    </div>
  );
}

export default Note;