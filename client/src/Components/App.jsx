import React, {useState, useContext, useEffect} from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import noteValue from "./CreateArea";
import NoteEditor from "./NoteEditor";
import Auth from "./Auth"
import axios from "axios";


function App() {
  //State Declarations
 
  const [editModeStatus,setEditModeStatus] = useState(false)
  
  const [selectedNote, setSelectedNote] = useState({
    Id: "",
    Title: "",
    Content: ""
  })

  const [notes,setNotes] = useState([]) 
 
  //handle GET/POST with Axios between client and server AXIOS EXPLAINED HERE:
  //one url communicates with the server get request, the other with the post request
  //the get request in server contains a DB query to return notes, which is caught by Axios here
  //the post request on server will save() the notes array to db when we post it
  //server get req listens on practiceNotes endpoint, the post listens on addNotes endpoint
  /*Axios basically holds multiple endpoints to communicate with our server as if they're coming from different 
  endpoints, when they';re just here on the single page app. So in past projects there were different pages
  with forms, inputs etc. We had a get and a post for each PAGE
  Axios lets us work the same way, but all from one page, sending get and post requests with our server from inside each
  useEffect call, which contains a set state call, and a res to the server with that newly set state
  So with Axios, each useEffect is like its own page endpoint, just without leaving this page
  We can use this the same way to get values from a login component that has a handlechange() and passes inputs as props,
   then in App.jsx we set state to a user object, and have a new Axios useEffect that will send that to our server for 
   DB CRUD Ops*/
  //AXIOS useEffect calls and function calls to communicate between client and server:

  useEffect(()=>{ //every render gets notes list from server, handles initial render on app load.
    axios.get("/api/practiceNotes") //added ternary to handle empty array received from server
    .then((res)=>{
      /*res.data.length>0 && */ setNotes(res.data.allNotes)
      console.log("res.data.allNotes arrives at client as:")
      console.log(res.data.allNotes)
      console.log("notes is ")
      console.log(notes)
    }) //will set notes to equal the value of the response from server, from db query
    .catch((err)=>{
      console.log(err)
      
    }) //handle error logging
    // console.log("notes reset via setNotes. axios.get to server. notes array =")
    console.log(notes) //NOW is returning as empty array here.
   
  },[]) //empty array is useEffect syntax

  //addNote function  AND EditNote function can contain our axios.post, sending the newly updated notes array to server
  //every time its state changes. Can we use a simple use of useEffect hook to
  // axios.post() to the server api endpoint on every setNotes() call? <<<<<<<<
  //Yes we can:

  useEffect(()=>{ //FIX: W/ conditional, initial GET w/ setNotes will NOT trigger this post.
    if(notes.length > 0 && notes){ //i.e don't post on initial load when GET req calls setNotes.
    axios.post("/api/addNotes",notes)
  // .then((res)=>setNotes(res.data)) 
  // .catch((err)=> console.log(err))
  console.log("useEffect detected setNotes update to notes. axios.post to server notes:")
  console.log(notes)
    }
  }, [notes]) 
  /*passing the state variable notes into the useEffect 2nd arg will call this function
              // every time notes has a new state change in client (from add, delete, or edit)*/
  
               
  function addNote(newNote){  
  setNotes(prevNotes=>{
    return [...prevNotes, newNote]
  });
  let tempArr = [];
  
  console.log(notes)
  notes.forEach((entry)=>{
    tempArr.push(entry)
  })
  console.log("tempArr")
  console.log(tempArr)
  // axios.post("/api/addNotes",tempArr)         //AXIOS CALL
  // .catch((err)=>console.log(err))
  // console.log("on addNote, we send the following via post from client to server:")
  // console.log(notes) 
  //is adding old version of notes prior to this setNotes call.
  // So, the useState is BEHIND. Bc of async....
  }



  function deleteNote(id){
 setNotes(prevNotes=>{
   return prevNotes.filter((noteItem,index)=>{
     return index !== id
   })
  })
  // axios.post("/api/addNotes",notes)         //AXIOS CALL
  // .catch((err)=>console.log(err))
  }

  
//called when NOTE is clicked- look in <Note /> not NoteEditor
function editNote(id,title,content){
  console.log("editNote called")
    console.log(title) //these ARE logging successfully when editor opens...
    console.log(content)
    console.log(id)
    setSelectedNote({
      Id: id,
      Title: title,
      Content: content
    })
 
    console.log("selectedNote values are now: ")  //returning blank
    console.log(selectedNote.Title)
    console.log(selectedNote.Content)
    setEditModeStatus(true)
     
  }
//called when <NotedEditor add button is pressed.
  function editComplete(edited){ //edited is from NoteEditor onEditSubmit
    console.log(edited) //edited IS logging and shows changes made in editor
    console.log("editComplete called")
    console.log(edited.id) //IS now capturing id value

    // axios.post("/api/addNotes",notes)         //AXIOS CALL
    // .catch((err)=>console.log(err))    

      let shallowCopy = notes

      shallowCopy = shallowCopy.map(function(entry,index){ //UPDATING SUCCESSFULLY
if(index === edited.id){
shallowCopy[index] = edited
}else{
    return entry
  }
  
})

    /* setNotes(shallowCopy)
     if you setNotes HERE, it DOESN'T WORK */
    setEditModeStatus(false)
    console.log("testtest 54321.. notes state = ")
    console.log(notes) //THIS IS NOW UPDATED to match shallowCopy. try axios.post here
    axios.post("/api/addNotes",notes) 
  }
//Functional Components rendering



  return <div>

  {editModeStatus &&
  <div>
  <Header
    headerText="Edit Note"
  />
  <NoteEditor 
  
  populateId= {selectedNote.Id} //THIS wasn't included before, causing map function to fail.
  populateTitle={selectedNote.Title}
  populateContent={selectedNote.Content} //THESE are getting pulled from the editedNote state via props from NoteEditor
  onEditSubmit={editComplete} // this calls editComplete, passing in the arg from NoteEditor
/>
</div>
  }

{!editModeStatus &&

<div>
{console.log("notes array looks like this before rendering, after submitting edit:")}
{console.log(notes)}

<Header 
headerText="React Notes"
/>
<CreateArea 
onAdd={addNote} 
/> 
{notes.map((noteItem,index)=>{
  console.log(notes) //The notes array is updated successfully....
  
return <Note 
key={index}
id={index} //SO ANY NOTE THAT WAS EDITED will now render as the most recently edited note. Hm..
title={!noteItem ? "edit value didn't carry over" : noteItem.title} //see notes learned about asynchronous population of arrays in react
content={!noteItem ? "something wrong w/ notes array" : noteItem.content}//if noteItem.title/content not yet populated, this lets the app nopt crash before it finishes rendering bc it's asynchronous.
onDelete={deleteNote}
onEdit={editNote}
/>
})
}
{console.log("Finished Render/map. Notes array is:")}
{console.log(notes) /*axios.post here to handle ALL add,edit,delete?*/} 
<Footer />
</div>
}
</div>

}

export default App;

