import React, {useState, useContext, useEffect} from "react";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios"

function Auth(props){
const [credentials, setCredentials] = useState({
    email: "",
    password: ""
})
    
    

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
        
        console.log(credentials)
        axios.post("api/authenticate",credentials)
        // props.onAuthSubmit(credentials)
        setCredentials({ //reset field values on submit
            email:"",
            password: ""
        })
        event.preventDefault()
    }

//kb event listener to submit credentials on enter 
    function keydownListener(event){
        event.keyCode === 13 && document.getElementById("submitButton").click()
    }



    return (
        <div>
        <header class="auth-header">
        <h1 class = "auth-header-text">Welcome to Notes</h1>
        </header>
        <h2>Login Here</h2>
        <form class="">
            
            
            <input onChange={handleChange}
            type="email"
            name="email"
            placeholder="Email"
             autoComplete="off"/>
            
            <input onChange={handleChange}
            type="password"
            onKeyDown= {keydownListener}
            name="password"
            placeholder="Password" 
            autoComplete="off"/>

            <button class="auth-login-btn" 
            id="submitButton" 
            onClick={submission}>Submit
            </button>
        </form>
        </div>
    )
}

export default Auth