import React from "react";
import {useState} from "react"
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import { createNotEmittedStatement } from "typescript";

//Alternatively, you could make this an anonymous function INSIDE th App() component

function App() {
  //State Declarations
 
  const[notes,setNotes] = useState([]) 
  const [inputTitle,setInputTitle] = useState("")
  const [inputText,setInputText] = useState("")
  //Functions
  function addNote(newNote){
  setNotes(prevNotes=>{
    return [...prevNotes, newNote]
  });
  }

  function deleteNote(id){
 setNotes(prevNotes=>{
   return prevNotes.filter((noteItem,index)=>{
     return index !== id
   })
  })
  }

  function changeTitle(){
    const updated=event.target.value
setInputTitle(updated)
  }

  function changeText(){
    const updated=event.target.value
setInputText(updated)
  }
  

 


//Functional Components rendering
  return (
    <div>
      <Header />
      <CreateArea onAdd={addNote} />
      {notes.map((noteItem,index)=>{
        return <Note 
        key={index}
        id={index}
        title={noteItem.title}
         content={noteItem.content}
         onDelete={deleteNote}
         />
      })
      }
      

      <Footer />
    </div>
  );
}

export default App;