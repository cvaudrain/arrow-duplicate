import React, {useState, useContext, useEffect} from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect,useLocation, useHistory } from "react-router-dom";

import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import noteValue from "./CreateArea";
import NoteEditor from "./NoteEditor";
import Auth from "./Auth"
import axios from "axios";
import PracticeRoute from "./PracticeRoute"
const API_ENDPOINT = process.env.PORT || "http://localhost:4747"
function App() {
  //State Declarations
  const [editModeStatus,setEditModeStatus] = useState(false)
  const [selectedNote, setSelectedNote] = useState({
    Id: "",
    Title: "",
    Content: ""
  })

  if(sessionStorage.getItem("userData") === null){
  sessionStorage.setItem("userData",JSON.stringify({ //IF null, Initial set session storage. Values will be replaced ater successful auth
    username: "nameless user",
    notes: [],
    email: "no email",
    authStatus: false
  })
  )
}
  // Get Session-Dependent State 
let sessionData = ()=>{
  let sessionStoredValue= sessionStorage.getItem("userData")
if(sessionStoredValue.email !== "no email") { //i.e, if the initial values have been replaced by a user login action...
   sessionStoredValue = sessionStorage.getItem("userData")
  JSON.parse(sessionStoredValue)
 
 
  return JSON.parse(sessionStoredValue)
}
    else {
  console.log("sessionStorage NOT set correctly, currently storing placehold values")
  return { //this means sessionStorage wasn't set and/or retrieved correctly.
    username: "nameless user",
    notes: [],
    email: "no email",
    authStatus: false
  }} //handle case with no session data so sessionData never undefined & always usable for initial set state
}
//auth statefuls
sessionData = sessionData() 
const [notes,setNotes] = useState(sessionData.notes) 
const [authStatus,setAuthStatus] = useState(sessionData.authStatus)
  const [usernameFromAuth, setUsernameFromAuth] = useState(sessionData.username)
  const [emailFromAuth, setEmailFromAuth] = useState(sessionData.email)

  useEffect(()=>{ //FIX: W/ conditional, initial GET w/ setNotes will NOT trigger this post.
    if(notes.length > 0 && notes){ //i.e don't post on initial load when GET req calls setNotes.
      console.log("when posting in useEffect, notes ==")
      console.log(notes)
    axios.post("/api/addNotes",{
      userEmail: emailFromAuth, //stateful variable
      notes: notes
    }).then((res)=>console.log(res.data))
    sessionStorage.setItem("userData",JSON.stringify({ //should sync session with what we send to DB
      username: usernameFromAuth,
    notes: notes,
    email: emailFromAuth,
    authStatus: true
    })
    )
    }
  },[notes]) 

  //Add Note
  function addNote(newNote){  
  setNotes(prevNotes=>{
    return [...prevNotes, newNote]
  });
  let tempArr = [];
  
  console.log(notes)
  notes.forEach((entry)=>{
    tempArr.push(entry)
  })
  }

  function deleteNote(id){
 setNotes(prevNotes=>{
   return prevNotes.filter((noteItem,index)=>{
     return index !== id
   })
  })
  }

//Edit- called when NOTE is clicked
function editNote(id,title,content){
    setSelectedNote({
      Id: id,
      Title: title,
      Content: content
    })
    setEditModeStatus(true) 
  }
//called when <NotedEditor add button is pressed.
  function editComplete(edited){ //edited is from NoteEditor onEditSubmit
      let shallowCopy = notes
      shallowCopy = shallowCopy.map(function(entry,index){ //UPDATING SUCCESSFULLY
if(index === edited.id){
shallowCopy[index] = edited
}else{
    return entry
  }
  
})
    setEditModeStatus(false)
    axios.post("/api/addNotes",{
      userEmail: emailFromAuth,
      notes: notes
    }).then((res)=>console.log(res.data))
    sessionStorage.setItem("userData",JSON.stringify({ //should sync session with what we send to DB
      username: usernameFromAuth,
    notes: notes,
    email: emailFromAuth,
    authStatus: true
    })
    ) 
  }

function authStateFunction(loginStatusBoolFromAuth,valuePassedFromAuth,usernameFromAuth,emailFromAuth){
    setUsernameFromAuth(usernameFromAuth)
    setEmailFromAuth(emailFromAuth)
setNotes(valuePassedFromAuth)
setAuthStatus(loginStatusBoolFromAuth)
let userProfile = { //on login or registration, this object is set to sessionStorage. Keeps session & state consistent
  username: usernameFromAuth,
  email: emailFromAuth,
    notes: valuePassedFromAuth,
    authStatus: loginStatusBoolFromAuth
}

userProfile = JSON.stringify(userProfile)
sessionStorage.setItem( "userData", userProfile )
}
function logout(){
  axios.get("/logout",function(req,res){
    req.logout;
  })
  sessionStorage.clear()
  setNotes([])
  setUsernameFromAuth("nameless user")
  setEmailFromAuth("no email")
  setAuthStatus(false)
  // window.location.reload()
}

//Render Phase
  return (
    <Router history = {history}>
  <div>

<Switch>

<Route path="/PracticeRoute">
  <PracticeRoute />
</Route>

<Route path="/authenticate">
{authStatus && <Redirect from="/authenticate" to="/"/>} 

  <Auth
  id={"Auth"}
   authFunction = {authStateFunction}
   />
 </Route>

<Route path= "/" >
 {!authStatus && <Redirect from="/" to="/authenticate" />} 
  {editModeStatus &&
  <div>
  <Header
    headerText="Edit Note"
    logout={logout}
    userNameGreeting={usernameFromAuth}
  />
  <NoteEditor 
  populateId= {selectedNote.Id} //THIS wasn't included before, causing map function to fail.
  populateTitle={selectedNote.Title}
  populateContent={selectedNote.Content} // pulled from the editedNote state via props from NoteEditor
  onEditSubmit={editComplete} // this calls editComplete, passing in the arg from NoteEditor
/>
</div>
  }

{!editModeStatus &&

<div>

<Header 
headerText="Notepad"
userNameGreeting={usernameFromAuth}
logout={logout}
/>
<CreateArea 
onAdd={addNote} 
/> 
{notes.map((noteItem,index)=>{
return <Note 
key={index}
id={index} 
title={!noteItem ? "edit value didn't carry over" : noteItem.title} 
content={!noteItem ? "something wrong w/ notes array" : noteItem.content}
onDelete={deleteNote}
onEdit={editNote}
/>
})
}
<Footer />
</div>
}
</Route>
</Switch>
</div>
</Router>
)
}

export default App;

