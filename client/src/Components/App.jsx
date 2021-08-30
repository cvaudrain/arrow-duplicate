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

// import {createBrowserHistory} from "history"

// let history = createBrowserHistory()
function App() {
  
// console.log(history)
  //State Declarations
 
  const [editModeStatus,setEditModeStatus] = useState(false)
  
  const [selectedNote, setSelectedNote] = useState({
    Id: "",
    Title: "",
    Content: ""
  })
//ACTUALLY declare ALL state variables that correspond with sessionStorage AFTER checking the sessionStorage value
  //const [notes,setNotes] = useState([]) //lets declare notes AFTEr checking to see if sessionStorage exists, to avoid too many re-renders..
  // const [authStatus,setAuthStatus] = useState(false)
  // const [usernameFromAuth, setUsernameFromAuth] = useState("unauthenticated interloper")
  // const [emailFromAuth, setEmailFromAuth] = useState("no email")

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
  console.log("sessionData variable is still available (line 34)")
  JSON.parse(sessionStoredValue)
  console.log(sessionStoredValue)
 
  return JSON.parse(sessionStoredValue)
}
    else {
  console.log("sessionStorage NOT set correctly, currently storing dummy values")
  return { //this means sessionStorage wasn't set and/or retrieved correctly.
    username: "nameless user",
    notes: [],
    email: "no email",
    authStatus: false
  }} //handle case with no session data so sessionData never undefined & always usable for initial set state
}

sessionData = sessionData() //seems to be returning undefined?
console.log("sessiondata ====")
console.log(sessionData)
console.log(sessionData.notes) //wasn't being parsed so was returning undefined!!!!!!!!!!!!!!!!!!!!!!
const [notes,setNotes] = useState(sessionData.notes) // declare notes HERE so page refresh will work without too many renders caused by re-setting it too many times in initial render.
console.log("notes stateful ===")
console.log(notes)
const [authStatus,setAuthStatus] = useState(sessionData.authStatus)
  const [usernameFromAuth, setUsernameFromAuth] = useState(sessionData.username)
  const [emailFromAuth, setEmailFromAuth] = useState(sessionData.email)
//setNotes(sessionData.notes)    //causes TOO MANY RE-RENDERS due to useEffect loop. 
// // sessionData = JSON.parse(sessionData)
// const [notes,setNotes] = useState(sessionData.notes) //returns user notes array if 
// console.log(notes)
// //set notes from sessionStorage
// const [usernameFromAuth,setUsernameFromAuth] = useState(sessionData.username) //already parsed in function
// console.log(usernameFromAuth)
// // set username from sessionStorage
// const [emailFromAuth, setEmailFromAuth] = useState(sessionData.email)
// console.log(emailFromAuth)
// //set email from sessionStorage to be used for DB queries to find and return user data to populate notes, username, etc.
//   let [authStatus, setAuthStatus] = useState(/*false*/sessionData.authStatus) //uses react-router <Redirect /> to redirect to login if not logged in
//   //set authStatus from sessionStorage
 
//  useEffect(()=>{
//    console.log("a user Data value changed. Re-rendering and updating sessionStorage to match")
//    let newSessionVals = {
//      username: usernameFromAuth,
//      notes: notes,
//      email:emailFromAuth,
//      authStatus:authStatus
//    }
//    newSessionVals = JSON.stringify(newSessionVals)
//    sessionStorage.setItem("userData",newSessionVals)
//  },[authStatus, usernameFromAuth, emailFromAuth,notes])

  


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

// if(authStatus==true){
  // useEffect(()=>{ //every render gets notes list from server, handles initial render on app load.
   
  //   console.log("initial GET req on login OR refresh page- emailFromAuth = ")
  //  console.log(emailFromAuth)
  //   //this get req returns an error on initial load bc the db query on server has no search parameter without posting a string here.
  //   //CHANGED so that it returns empty array if err, so if emailFromAuth isn't pulled from sessionStorage, this will setNotes([])
  //   axios.get("/api/practiceNotes",{headers: {email:emailFromAuth}}) //is userProfile set at this point? NO. Need to sync this up with stateful var
  //   .then((res)=>{ //awaits response from server....
  //     console.log(res.data) 
  //    setNotes(res.data) //res.data is empty because our POST req on server isn't .save() correctly
  //     // setNotes([]) //setNotes as [] to stop crashing temporarily
  //     //console.log("res.data.allNotes arrives at client as:")
  //     //console.log(res.data.allNotes)
  //     //console.log("notes is ")
  //     //console.log(notes)
  //   }) //will set notes to equal the value of the response from server, from db query
  //   .catch((err)=>{
  //     console.log(err)
      
  //   }) //handle error logging
  //   // console.log("notes reset via setNotes. axios.get to server. notes array =")
  //   console.log(notes) //NOW is returning as empty array here.
   
  // },[]) //empty array is useEffect syntax

  
  //addNote function  AND EditNote function can contain our axios.post, sending the newly updated notes array to server
  //every time its state changes. Can we use a simple use of useEffect hook to
  // axios.post() to the server api endpoint on every setNotes() call? <<<<<<<<
  //Yes we can:

  //Works perfectly for add and delete, but NOT for edit. Bc we circumvented setNotes with shallowCopy. Will perform CRUD
  //for session and axios.post from that function, after the point where notes is set correctly
  useEffect(()=>{ //FIX: W/ conditional, initial GET w/ setNotes will NOT trigger this post.
    if(notes.length > 0 && notes){ //i.e don't post on initial load when GET req calls setNotes. OR if login fails, leaving empty []
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
  // .then((res)=>setNotes(res.data)) 
  // .catch((err)=> console.log(err))
  console.log(emailFromAuth)
  console.log("useEffect detected setNotes update to notes. axios.post to server notes:")
  console.log(notes)
    }
  },[notes]) 

// } //conditional authStatus
// else{ console.log("not logged in, axios not get/posting to server yet")}

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
    //console.log(edited) //edited IS logging and shows changes made in editor
    //console.log("editComplete called")
    //console.log(edited.id) //IS now capturing id value

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
    //console.log("testtest 54321.. notes state = ")
    
    console.log("NOTES STATUS IN EDITCOMPLETE LINE 260  ")
    console.log(notes) //THIS IS NOW UPDATED to match shallowCopy. try axios.post here
    //manually inserting CRUD Op for edits, add/delete are detected by useEffect.
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
    ) //end CRUD insert
    
  }
//Functional Components rendering

function authStateFunction(loginStatusBoolFromAuth,valuePassedFromAuth,usernameFromAuth,emailFromAuth){
    console.log("authStateFunction Called")
    // userProfile.email = emailFromAuth
    // userProfile.username = usernameFromAuth
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
console.log("USERPROFILE:")
console.log(userProfile)
userProfile = JSON.stringify(userProfile)
sessionStorage.setItem( "userData", userProfile )
}
console.log(notes)

function logout(){
  axios.get("/logout",function(req,res){
    req.logout;
    // setAuthStatus(false)
  })
  sessionStorage.clear()
  setNotes([])
  setUsernameFromAuth("nameless user")
  setEmailFromAuth("no email")
  setAuthStatus(false)
  // window.location.reload()
}


// function resetAuthTernaries(status,failed,registered){
//   status=false
//   failed=false
//   registered=false
// }

  return (
    <Router history = {history}>
  <div>

<Switch>



<Route path="/PracticeRoute">
  <PracticeRoute />
</Route>

<Route path="/authenticate">
{authStatus && <Redirect from="/authenticate" to="/" /*WORKS*/ />} 
{/* This authStatus logic occurs at a DIFFERENT ROUTE. Need to have authStatus in <Auth>. It doesn't KNOW
authStatus changed, because it doesn't have authStatus over there EITHER:
figure out how to access the state across components
OR make an analogous authStatus over on <Auth> */
}
{/* {authStatus && <Redirect from="/authenticate" to="/PracticeRoute"/> } NOT working...  */}
  <Auth
  id={"Auth"}
   authFunction = {authStateFunction}
  //  resetAuthTern= {resetAuthTernaries}
   />
 </Route>

<Route path= "/" >
{console.log(authStatus)}
{console.log("right above here is the authStatus full value..")}
 {!authStatus && <Redirect from="/" to="/authenticate" /> /*WORKS*/} 

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
  populateContent={selectedNote.Content} //THESE are getting pulled from the editedNote state via props from NoteEditor
  onEditSubmit={editComplete} // this calls editComplete, passing in the arg from NoteEditor
/>
</div>
  }

{!editModeStatus &&

<div>
{/* {console.log("notes array looks like this before rendering, after submitting edit:")}
{console.log(notes)} */}

<Header 
headerText="Notepad"
userNameGreeting={usernameFromAuth}
logout={logout}
/>
<CreateArea 
onAdd={addNote} 
/> 
{notes.map((noteItem,index)=>{
  //console.log("Notes inside map function down in render section")
  //console.log(notes) //The notes array is updated successfully....
  
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
{/* {console.log("Finished Render/map. Notes array is:")}
{console.log(notes)}  */}

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

