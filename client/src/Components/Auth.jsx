import React, {useState, useContext, useEffect} from "react";
import axios from "axios"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useHistory,
    useLocation,
    withRouter
  } from "react-router-dom";

  import {createBrowserHistory} from "history"
// let history = createBrowserHistory()

import Header from "./Header";
import Footer from "./Footer";
import SubmitButton from "./SubmitButton"
 


function Auth(props){
    let [authStatus2, setAuthStatus2] = useState(false) //logged in/ !logged in
    const [failedAttempt, setFailedAttempt] = useState(false) // incorrect login registered
    const [alreadyRegistered, setAlreadyRegistered] = useState(false)
    // console.log(props)
    // console.log(authStatus) DOES NOT RECOGNIZE AUTHSTATUS
const [credentials, setCredentials] = useState({
    email: "",
    password: ""
})

    const [credentialsReg,setCredentialsReg] = useState({
        name: "",
        email: "",
        password: ""
    })

    const [isRegistered,setIsRegistered] = useState(true); //defaults to case of returning user
    
    function handleChange(event){
        const {name,value} = event.target; //name/value are the html keys name = and value =
setCredentials(preVal=>{
    return {
        ...preVal,
        [name]: value
    }
})
console.log(credentials)
    }

    function registerSubmission(event){
axios.post("/api/registerUser",credentials)
.then((res)=>{
    // console.log("credentials returned: " + res.data.name + " " + res.data.email + " " + res.data.password + " " + res.data.authenticated)
            console.log(res.data)
        let authStatusBool = res.data.authStatus //if user is already registered or not
        let retrievedEmail= res.data.email
        let retrievedUsername = res.data.username

               
//         let userData = { //sessionStorage to be set on registration
//             username: retrievedUsername,
//             notes: [],
//             email: retrievedEmail,
//             authStatus: authStatusBool
//         }
//         userData = JSON.stringify(userData) //ready for session storage as JSON format

//         sessionStorage.setItem("userData", userData) //obj key must be string format going in to match JSON format.

//         setAlreadyRegistered(res.data.alreadyRegistered)
setAuthStatus2(res.data.authStatus) //THIS causes re-render
authStatus2 && props.authFunction(res.data.authStatus, [], res.data.username, res.data.email) //don't use authStatusBool, use the direct response value res.data.authenticated
})

event.preventDefault() //prevents "cannot POST" error
    }

    

    function submission(event){
        console.log("submission function")
        axios.post("/api/authenticate",credentials)
        .then((res)=>{
            
            console.log(res.data)
            console.log(res.data.retrievedNotes)
            let retrievedEmail= res.data.retrievedEmail
        // let enteredPassword = res.data.password
        let authStatusBool = res.data.authenticated
        let retrievedNotes = res.data.retrievedNotes
        let retrievedUsername = res.data.retrievedUsername
        
        let userData = { 
            username: retrievedUsername,
            notes: retrievedNotes,
            email: retrievedEmail,
            authStatus: authStatusBool
        }
        if(res.data == "unsuccessful attempt"){ //i.e failed login retains dummy values, but prevents empty sessionStorage
            userData = {
            username: "nameless user",
            notes: [],
            email: "no email",
            authStatus: false
            }
            
        }
                        
        userData = JSON.stringify(userData) //ready for session storage as JSON format

        sessionStorage.setItem("userData", userData) //obj key must be string format going in to match JSON format.
         
        setAuthStatus2(res.data.authenticated)
!userData.authStatus && setFailedAttempt(true) //fires UI message

//only fire this IF authStatusBool = true, so that we stay on auth page and can send users messages like "incorrect login, try again.."
        authStatusBool && props.authFunction(authStatusBool,retrievedNotes,retrievedUsername,retrievedEmail,userData) /*THIS is how we pass data to main app(parent)
        i.e LIFTING UP STATE WITH HOOKS & FUNCTIONAL COMPONENTS. Bc the internet wasn't helpful.
                             the props.functionName is the prop in App.jsx, and is arbitrary
                            but the ARGS we pass in though are DATA FROM THIS COMPONENT
                             So the args in the prop function ARE passed over, and in App.jsx
                             we'll have practiceFunction = {functionNameFromMainParentApp}
                             which will accept the appropriate number of args in its function definition
                             and will set state with setNotes(arg), and the arg will equal the arg passed here
                             which is retreivedNotes, an ARRAY from our SERVER, which will ultimately be taken
                             from QUERYING the DB on the serverside, awaiting query, then sending the retreived array
                             with the other values with res.json(responseData), received here as res.data
                             which we can deconstruct above as res.data.email, res.data.retreivedNotes, etc!
                                    */

//         props.practiceFunction([
//             {
//             title:"prop title 1",
//             content: "note content passed from Auth.jsx"
//         },
//     {
//         title: "a second note title",
//         content: "the function inside the submission function from Auth.jsx passed these replacement notes as props"
//     },
//     {title: "How?",
//     content: "props.practiceFunction in Auth took 1 argument- an array with these 3 objects!"
// }
// ])
       
        })
       
        event.preventDefault() //prevents "cannot POST" error
    }

    function toggleReg(){
        isRegistered ? setIsRegistered(false) : setIsRegistered(true)
        failedAttempt && setFailedAttempt(false) 
    }
//kb event listener to submit credentials on enter 
    function keydownListener(event){
        event.keyCode === 13 && document.getElementById("submitButton").click()
    }

    return (
        
        <Route path="/authenticate">
       
         {!authStatus2 ? console.log("not logged in yet") : <Redirect to="/" />}
         
        <div>
        <header className="auth-header">
        <h2 className = "auth-header-text">indigo</h2>
        <h3><i>A Growing Productivity Toolkit</i></h3>
        </header>
        <h1 className = "auth-sub-heading">{isRegistered ? "Login" : "Register"}</h1>
        <form method="post" className="auth-form">
            
            {!isRegistered && //extra field for name if unregistered
            <input onChange={handleChange}
            type="email"
            name="email"
            placeholder="Email"
             autoComplete="off"
                 className = "auth-login-field"
                 required="true"
             />
            }
            <input onChange={handleChange}
            type="text"
            name="username"
            placeholder="Username"
             autoComplete="off"
                 className = "auth-login-field"
                 required="true"
             />

            <input onChange={handleChange}
            type="password"
            onKeyDown= {keydownListener}
            name="password"
            placeholder="Password" 
            autoComplete="off"
                className = "auth-login-field"
                required="true"
            />

            
            <button className="auth-login-btn" 
            id="submitButton" 
            onClick={isRegistered ? submission : registerSubmission}>Submit
            </button>
            
        </form>
        
        
{failedAttempt==true &&  <div className="errMessage centered"><h4>Incorrect login... Let's try again.</h4></div>}
{alreadyRegistered==true && <div className="errMessage centered"><h4>That email is already in use. Register with a different email, or press the login button.</h4></div>}

        
        {isRegistered ? 
            <div className="register">
            <h3 className="regtext"><i>First time here?</i></h3>
            <button onClick= {toggleReg} className="to-register-btn">Register</button>
            </div>
            :
            <div className="register">
            <h3 className="regtext"><i>Already registered?</i></h3>
            <button onClick= {toggleReg} className="to-register-btn">Login</button>
          
            </div>
        }
        </div>
          </Route> 
    )
}

export default Auth