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
    let [authStatus2, setAuthStatus2] = useState(false)
    const [failedAttempt, setFailedAttempt] = useState(false)
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

    const [isRegistered,setIsRegistered] = useState(true);
    
    // useEffect(()=>{
    //     console.log(history)
    //     console.log("history updated per createBrowserHistory history.push() method, useEffect triggered to attempt re-render in accordance with updated url")
    // },[history])
   

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

    

    function submission(event){
        
        // console.log(credentials)
        axios.post("/api/authenticate",credentials)
        .then((res)=>{
            console.log("credentials returned: " + res.data.email + " " + res.data.password + " " + res.data.authenticated)
            console.log(res.data)
            let enteredEmail= res.data.email
        let enteredPassword = res.data.password
        let authStatusBool = res.data.authenticated
        let retrievedNotes = res.data.retrievedNotes
        let retrievedUsername = res.data.username
        props.authenticateUser(enteredEmail,enteredPassword,authStatusBool)
            props.changeState 
        setAuthStatus2(res.data.authenticated)
authStatusBool== false && setFailedAttempt(true)
        props.practiceFunction(authStatusBool,retrievedNotes,retrievedUsername) /*THIS is how we pass data to main app(parent)
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
        <h1 className = "auth-header-text">Welcome to Notes</h1>
        </header>
        <h1 className = "auth-sub-heading">{isRegistered ? "Login" : "Register"}</h1>
        <form method="post" className="auth-form">
            
            {!isRegistered && //extra field for name if unregistered
            <input onChange={handleChange}
            type="text"
            name="username"
            placeholder="Username"
             autoComplete="off"
                 className = "auth-login-field"
             />
            }
            <input onChange={handleChange}
            type="email"
            name="email"
            placeholder="Email"
             autoComplete="off"
                 className = "auth-login-field"
             />

            <input onChange={handleChange}
            type="password"
            onKeyDown= {keydownListener}
            name="password"
            placeholder="Password" 
            autoComplete="off"
                className = "auth-login-field"
            />

            {/* <Link to="/"> */}
            <button className="auth-login-btn" 
            id="submitButton" 
            onClick={submission}>Submit
            </button>
           {/* </Link> */}
        </form>
        <div>
{failedAttempt && <h2> Hm. You don't look familiar........ Let's Try again.</h2>}

        </div>
        {isRegistered ? 
            <div className="register">
            <h3><i>First time here?</i></h3>
            <button onClick= {toggleReg} className="to-register-btn">Register</button>
            </div>
            :
            <div className="register">
            <h3><i>Already registered?</i></h3>
            <button onClick= {toggleReg} className="to-register-btn">Login</button>
          
            </div>
        }
        </div>
          </Route> 
    )
}

export default Auth