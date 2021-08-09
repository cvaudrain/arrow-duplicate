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

      <h1 onClick={handleEdit} >{props.title}</h1>
      <p onClick={handleEdit} >{props.content}</p>
    
      <button onClick={handleClick}>DELETE</button>
    </div>
  );
}

export default Note;