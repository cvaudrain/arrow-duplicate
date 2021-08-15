import React, {useState, useContext, useEffect} from "react";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios"

function Auth(props){
const [credentials, setCredentials] = useState({
    email: "",
    password: ""
})
    
    

    function handleChange(e){
        const {fieldType,fieldValue} = e.target;
setCredentials(preVal=>{
    return {
        ...preVal,
        [fieldType]: fieldValue
    }
})
console.log(fieldValue)
    }
    function submission(){
        props.onAuthSubmit(credentials)
        setCredentials({ //reset field values on submit
            email:"",
            password: ""
        })
    }

//kb event listener to submit credentials on enter 
    function keydownListener(event){
        event.keyCode === 13 && document.getElementById("submitButton").click()
    }

    return (
        <div>
        <form>
            <h1>Welcome to Notes</h1>
            <h2>Login Here</h2>
            <input onChange={handleChange} type="email" name="email" value={credentials.email} placeholder="Email" autoComplete="off"/>
            <input onChange={handleChange} type="password" onKeyDown= {keydownListener} name="password" value={credentials.password} placeholder="Password" autoComplete="off"/>
            <button id="submitButton" onClick={submission}>Submit</button>
        </form>
        </div>
    )
}

export default Auth