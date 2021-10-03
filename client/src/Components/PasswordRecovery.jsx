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
import validate from "../validation"; //validation functions
import Header from "./Header"

  export default function PasswordRecovery(props){
      //State variables
const [whichForm,setWhichForm] = useState("email")
const [data,setData] = useState({
    email:"",
    recovery:""
})
const [successMessage,setSuccessMessage] = useState(false)
const [messageState, setMessageState] = useState("")
//Functions
function handleChange(event){
    console.log(data)
    const {name,value} = event.target; //name/value are the html keys name = and value =
setData(preVal=>{
return {
    ...preVal,
    [name]: value
}
})
console.log(event.target.value)
}
function submitEmail(e){
    e.preventDefault()
    console.log("data:")
    console.log(data)
    if(validate.validateEmail(data.email)){
        axios.post("/passwordrecovery/submitemail",data)
        .then((res)=>{
            console.log(res.data)
            if(res.data=="success"){
            setWhichForm("recoveryCode")
            }
        })
        .catch((err)=>console.log(err))
    }
}
function submitCode(e){
    e.preventDefault()
        axios.post("/passwordrecovery/submitcode",data.recovery)
        .then((res)=>{
            console.log(res.data)
            if(res.data.recovered==true){
            setSuccessMessage(res.data.recovered)
            setMessageState(res.data.message)
            }
        })
        .catch((err)=>console.log(err))
    
}
    return(


        <div>
       <header className="auth-header">
        <img className="arrow" src="arrow.png"></img>
        
        </header>
        <div className = "centered">
            <h1>
                Recover Account
            </h1>
        </div>
        {whichForm=="email"?
        <form  method="Post" name="emailForm">
        <label for="email"><p style={{fontSize:"1.3rem"}}>Please enter the email associated with your account</p></label>
            <input onChange={handleChange} name="email" type="email" placeholder="yourEmail@mail.com">

            </input>
            <button><p style={{paddingTop:"8px"}} onClick={submitEmail}>Send</p></button>
        </form>
        :
        <form method="Post" name="codeForm">
            <input onChange={handleChange} name="recovery" type="text" placeholder="Enter Recovery Code">

            </input>
            <button>Send Code</button>
        </form>
        }
        {successMessage && 
        <div className="centered">
            
            <h4>{messageState}</h4>

        </div>}
        </div>
    )
  }