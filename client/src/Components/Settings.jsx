import React, {useState, useContext, useEffect} from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useHistory } from "react-router-dom";
import { credentialContext } from "./App"
import axios from "axios"
function Settings(props){

    const credentials = useContext(credentialContext)
    const [userStats,setUserStats]=useState({ //placeholder values while awaiting axios API call to fetch data
        mood: 0,
        motivation: 0,
        focus: 0,
        calm: 0,
        powerLevel:0,
        rank:""
    })
    
    
    useEffect(()=>{
    
    
    axios.post("/profile/stats",credentials)
    .then((res)=>{
    console.log("res.data:")
    res.data.powerLevel != undefined && setUserStats(res.data) //statefuls fill in values on profile 
    
    })
    },[])
const [editScreen,setEditScreen] = useState("")

function saveEdits(){
    console.log("edits saved")
    let data = {
        userName:username.value,
        email:email.value
    }
    axios.post("/settings/edit",data)
    .then((res)=>{
        console.log(res.data)
        setEditScreen("")
    })
}

    function settings(){
        console.log("settings")
        setEditScreen(
            <div className="ev-modal">
            <div className="ev-modal-content ">
            <div className="row">
              <div className="col">
              <button style = {{textShadow:"textShadow: 2px 1px 3px black",borderRadius:"10px",padding:"3px",background:"#76baff",color:"white"}} onClick={()=>setEditScreen("")}><p style={{textShadow:"2px 1px 2px black",paddingTop:"5px"}}>Close</p></button>
              </div>
              
              </div>
              <div className="row">

              <div className="col-12">
              <label for="username">Edit Username</label>
              <input name="username" type="text"></input>
              <label for="confirmUsername">Confirm New Username</label>
              <input name="confirmUsername" type="text"></input>
              </div>
              </div>
            <div className="row">
              <div className="col-12">
              <label for="email">Edit Email Address</label>
              <input name="email" type="text"></input>
              <label for="confirmEmail">Confirm New Email</label>
              <input name="confirmEmail" type="text"></input>
              </div>
              
              </div>

              {/* PFP Select */}
              <div className="row">

              <div className="col-6">
              </div>
              <div className="col-6">
              </div>
              
              </div>
            </div>
            
            
              </div>
            
          )
    }
    return (
        <div className="mclaren">
      
        {editScreen}
        
        


   
            <div className="card user-card-full">
             
                <div className="row m-l-0 m-r-0">
            
                    <div  className="col-md-5 col-sm-12 bg-c-lite-green user-profile">
                    {/* <i style={{width:'80px', color:"white"}} className=" mdi mdi-square-edit-outline feather icon-edit m-t-10 f-16"></i> */}
                    
                        <div className="card-block text-center text-white">

                            <div className="m-b-25"> 
                            <img src="/beluga.jpg" className="img-radius pfp" alt="User-Profile-Image" /> 
                            
                            </div>
                            <i style={{color:"whites"}} className="fas fa-2x fa-edit options" onClick={settings}></i>
                            <h4 className="f-w-600">{props.username}</h4>
                            <h4>{credentials.username=="7"|| credentials.username=="Blue Kirbyy"?"Creator King" : userStats.rank}</h4> 
                            <h6>Power Level:</h6>
                            <h3 className="glowtext">{userStats.powerLevel}</h3>
                            
                        </div>
                    </div>
                    <div className="col-md-7">
                        <div className="card-block centered">
                            <h4 className="m-b-20 p-b-5 b-b-default f-w-600" h6>Info</h4>
                            <div className="row">
                                <div className="col-sm-6">
                                    <p className="m-b-10 f-w-600">User</p>
                                    <h4 className="text-muted f-w-400 h6">{credentials.username}</h4>
                                </div>
                                <div className="col-sm-6">
                                    <p className="m-b-10 f-w-600">Email</p>
                                    <h4 className="text-muted f-w-400 h6">{credentials.email}</h4>
                                </div>
                            </div>
                            <h4 className="m-b-20 m-t-40 p-b-5 b-b-default f-w-600 h6">Membership</h4>
                            <div className="row">
                                <div className="col-sm-6">
                                    <p className="m-b-10 f-w-600">Member Type</p>
                                    <h4 className="text-muted f-w-400 h6">{credentials.username=="7"|| credentials.username=="Blue Kirby"?"Admin" : "User"}</h4>
                                </div>
                                <div className="col-sm-6">
                                    <p className="m-b-10 f-w-600">Rank</p>
                                    <h4 className="text-muted f-w-400 h6">{userStats.rank}</h4>
                                </div>
                            </div>
                            
                        </div>
                       </div>
                        </div>
                    </div>


        </div>
    )
}

export default Settings