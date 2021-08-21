import React, {useState, useContext, useEffect} from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useHistory } from "react-router-dom";

function PracticeRoute(props){
console.log("codeblock on PracticeRoute running")
    return (
        <h1>A practice route</h1>
    )
}

export default PracticeRoute