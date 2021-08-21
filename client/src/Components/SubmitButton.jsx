import React, {useState, useContext, useEffect} from "react";
import {useHistory} from "react-router-dom"
import axios from "axios"

function SubmitButton(){
    let history = useHistory();
    
    function handleClick(){
        
        history.push("/")
        axios.post("/api/authenticate",history.location.pathname)
       
    };
    return(
        <button className="auth-login-btn" type="button" onClick={handleClick}>
            Submit
        </button>
    )
}

export default SubmitButton