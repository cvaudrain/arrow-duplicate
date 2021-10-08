import React, {useState, useContext, useEffect} from "react";
import axios from "axios"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useHistory
  } from "react-router-dom";
  import isEmail from "validator/lib/isEmail"

  const API_ENDPOINT = process.env.PORT || "http://localhost:4747"
function Auth(props){
    let [authStatus2, setAuthStatus2] = useState(false) //logged in/ !logged in
    const [failedAttempt, setFailedAttempt] = useState(false) // incorrect login registered
    const [alreadyRegistered, setAlreadyRegistered] = useState(false)
    const [failedReg, setFailedReg] = useState(false) 
    const [usernameTaken, setUsernameTaken] = useState(false)
    let history = useHistory();
const [credentials, setCredentials] = useState({
    name:"",
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

    }

    function validation(email,password) { //ensure pass and email meet requirements before continuing.
        let emailPassed=isEmail(email) //from validator node package isEmail
        let passwordPassed;
        var lower = /[a-z]/.test(password)
        var upper = /[A-Z]/.test(password)
        var num = /\d/.test(password)
        // var invalid = /\W/.test(password)
        var len = password.length
         if(lower == true && upper == true && num == true /*&& invalid == false*/ && len>=6){
             passwordPassed = true
         }
         else{passwordPassed = false}
         if(emailPassed && passwordPassed){
             console.log("validation PASSED")
             return true
         } else{
             console.log("validation FAILED")
             console.log(passwordPassed)
             console.log(emailPassed)
             return false
         }
        }

    function registerSubmission(event){
        let isValid = validation(credentials.email, credentials.password) //run email and pass through validation function before continuing.

        if (isValid === true){
axios.post("/api/registerUser",credentials)
.then((res)=>{
    // console.log("credentials returned: " + res.data.name + " " + res.data.email + " " + res.data.password + " " + res.data.authenticated)
            console.log(res.data)
        let authStatusBool = res.data.authStatus //if user is already registered or not
        let retrievedEmail= res.data.email
        let retrievedUsername = res.data.username

setAuthStatus2(res.data.authStatus) //re-render
authStatusBool && props.authFunction(res.data.authStatus, [], res.data.username, res.data.email) //don't use authStatusBool, use the direct response value res.data.authenticated
!res.data.authStatus && setFailedReg(true) 
res.data.authStatus && setFailedReg(false)
let userData;
if(res.data.authStatus){
     userData = JSON.stringify(res.data)
     sessionStorage.setItem("userData",userData)
    }

let nameError;
if(res.data.error != null && res.data.error.name != undefined){
    nameError = res.data.error.name
}else{
    nameError="none"
}
nameError == "UserExistsError" && setUsernameTaken(true)
})

        } else if(isValid === false){
            setFailedReg(true)
            document.getElementById("authForm").reset()
        }

        event.preventDefault() //prevents "cannot POST" error
    }

    function submission(event){
        
        console.log("submission function fired...")
       
        axios({
            method: "post",
            url:"/api/authenticate",
            data: credentials
        })
        
        // axios.post(`/${API_ENDPOINT}/authenticate`,credentials)
        .then((res)=>{
            let retrievedEmail= res.data.retrievedEmail
        let authStatusBool = res.data.authenticated
        let retrievedNotes = res.data.retrievedNotes
        let retrievedUsername = res.data.retrievedUsername
        
        let userData = { 
            username: retrievedUsername,
            notes: retrievedNotes,
            email: retrievedEmail,
            authStatus: authStatusBool
        }
        console.log(res.data)
        if(res.data == "unsuccessful attempt"){ //i.e failed login retains dummy values, but prevents empty sessionStorage
            userData = {
            username: "nameless user",
            notes: [],
            email: "no email",
            authStatus: false
            }
            document.getElementById("authForm").reset()
            
        }
                        
        userData = JSON.stringify(userData) //ready for session storage as JSON format

        sessionStorage.setItem("userData", userData) //obj key must be string format going in to match JSON format.
         
        setAuthStatus2(res.data.authenticated)
!userData.authStatus && setFailedAttempt(true) //fires UI message

//only fire this IF authStatusBool = true, so that we stay on auth page for UI msg on on authentication err
        authStatusBool && props.authFunction(authStatusBool,retrievedNotes,retrievedUsername,retrievedEmail,userData) 
       
        })
       
        event.preventDefault() //prevents "cannot POST" error
    }

    function toggleReg(){
        isRegistered ? setIsRegistered(false) : setIsRegistered(true)
        failedAttempt && setFailedAttempt(false) 
        setFailedReg(false)
        setUsernameTaken(false)
    }
//kb event listener to submit credentials on enter 
    function keydownListener(event){
        event.keyCode === 13 && document.getElementById("submitButton").click()
    }

    return (
        
        <Route path="/authenticate">
       
         {!authStatus2 ? console.log("not logged in yet") : <Redirect to="/" />}
         
        <div className="arrow-br">
        <header className="auth-header theGoodShading">
        <img className="arrow" src="arrow.png"></img>
        
        </header>
        
        <form method="post" className="auth-form" id="authForm">
        <h2 className = "auth-sub-heading">{isRegistered ? "-Login-" : "-Register-"}</h2>
            {!isRegistered && //extra field for name if unregistered
            <input onChange={handleChange}
            type="email"
            name="email"
            placeholder="Email"
             autoComplete="off"
                 className = "auth-login-field"
                 required={true}
             />
            }
            <input onChange={handleChange}
            type="text"
            name="username"
            placeholder="Username"
             autoComplete="off"
                 className = "auth-login-field"
                 required={true}
             />

            <input onChange={handleChange}
            type="password"
            onKeyDown= {keydownListener}
            name="password"
            placeholder="Password" 
            autoComplete="off"
                className = "auth-login-field"
                required={true}
            />

            
            <button className="auth-login-btn" 
            id="submitButton" 
            onClick={isRegistered ? submission : registerSubmission}>Submit
            </button>
            
        </form>
        
        
{failedAttempt==true &&  <div className="errMessage centered"><h4>Incorrect login... Let's try again.</h4></div>}
{usernameTaken && <div className="errMessage centered"><div><h2 className="br">Username taken!</h2> It must be pretty cool. Try another one.</div></div>}
{failedReg==true &&  <div className="errMessage centered"><div><h2>Invalid credentials.</h2> <h3 className="br">Please confirm that:</h3> <h5 className="br">Password contains 1 uppercase letter</h5> <h5 className="br">Password contains 1 lowercase letter</h5> <h5 className="br">Password contains 1 number</h5> <h5 className="br">Password is at least 6 characters long</h5> <h5 className="br">Your email is not already registered</h5></div></div>}
        
        {isRegistered ? 
            <div >
            <div className="center-wrap">
            {/* <p className="reg-text"><i>First time here?</i></p> */}
           
            <button onClick= {toggleReg} className="to-register-btn pill"><p>Register</p></button>
           
            </div>
            <div className="center-wrap">
            {/* <p className="reg-text"><i>Forgot Password?</i></p> */}
        <button className = "red-button pill" onClick={()=>history.push("/passwordrecovery")}><p className="text-sm">Forgot <br/> Password</p></button>
        </div>
       
            </div>
            :
            <div className="center-wrap">
            {/* <p className="reg-text"><i>Already registered?</i></p> */}
            <button onClick= {toggleReg} className="to-register-btn pill">To Login</button>
          
            </div>
        }
        

        <div className="about-arrow footerShading">
        <div><h1 className="about-header">About Arrow...</h1></div>
            <h4 className="paragraph">Arrow is a productivity-focused web application to help organize your tasks as well as your thoughts. It's intended as a cohesive collection of productivity apps for personal organization and personal reflection, with a growing set of features to make it all a bit more fun.</h4>
               <h4 className="paragraph">If you'd like to give it a try, rest assured you'll get no email spam from this app and your email will be used solely to secure your account.</h4> 
             <h4 className="paragraph"> Thanks for stopping by, and I hope you enjoy the site.</h4>
             <h3 className="paragraph signature"> -Chris </h3>
        </div>
        </div>
          </Route> 
    )
}

export default Auth