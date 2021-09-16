import React, {useState, useContext, useEffect} from "react";
import { Switch, Route, Link, Redirect,useLocation, useHistory } from "react-router-dom";
import Scheduler from "./Scheduler"
import Date from "./Date"
import Journal from "./Journal"
import Events from "./Events"
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import noteValue from "./CreateArea";
import NoteEditor from "./NoteEditor";
import Auth from "./Auth"
import Settings from "./Settings"
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';


import axios from "axios";

const API_ENDPOINT = process.env.PORT || "http://localhost:4747"
let userContext; //global variable declaration. Will be defined after userNameFromAuth is defined from <Auth />

function App() {
  //State Declarations
  const [editModeStatus,setEditModeStatus] = useState(false)
  const [selectedNote, setSelectedNote] = useState({
    Id: "",
    Title: "",
    Content: ""
  })
  
const history = useHistory()
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
userContext = React.createContext(usernameFromAuth) //create context for SwipeableDrawer to consume with useContext hook


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

function toCalendar(){
history.push("/scheduler")
}


//Render Phase
  return (
 
  <div>

<Route exact path="/scheduler">
<Header
  logout={logout}
    userNameGreeting={usernameFromAuth}
    toCalendar={toCalendar}
   
/>
<Scheduler/>
</Route>

<Route exact path="/scheduler/date"> 
<Date />
</Route>
{/* paths below have placeholders for date variable as m-d-yy. Will have to originate in Scheduler, and pass up to App here for filepath*/}
<Route exact path ="/scheduler/date/m-d-yy/journal"> 
  <Journal />
</Route>
<Route exact path ="/scheduler/date/m-d-yy/events">
  <Events />
</Route>


<Route exact path="/settings">
<Header
  logout={logout}
    userNameGreeting={usernameFromAuth}
    toCalendar={toCalendar}
   
/>
  <Settings />
</Route>

<Route path="/authenticate">
{authStatus && <Redirect from="/authenticate" to="/"/>} 

  <Auth
  id={"Auth"}
   authFunction = {authStateFunction}
   />
 </Route>

<Route exact path= "/" >
 {!authStatus && <Redirect from="/" to="/authenticate" />} 
  {editModeStatus &&
  <div>
  <Header
    headerText="Edit Note"
    logout={logout}
    userNameGreeting={usernameFromAuth}
    toCalendar={toCalendar}
    user={usernameFromAuth}
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
headerText="Dashboard"
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

</div>

)

}

export default App;
export {userContext}
