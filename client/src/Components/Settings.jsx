import React, {useState, useContext, useEffect} from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useHistory } from "react-router-dom";
import { credentialContext } from "./App"
import axios from "axios"

import validate from "../validation.js"
let pfpContext;
function Settings(props){
const [passVisible,setPassVisible] = useState(false) //use for conditional renders 
const [emailVisible,setEmailVisible] = useState(false)
    const credentials = useContext(credentialContext)
    const [userStats,setUserStats]=useState({ //placeholder values while awaiting axios API call to fetch data
        mood: 0,
        motivation: 0,
        focus: 0,
        calm: 0,
        powerLevel:0,
        rank:""
    })
    
    const [pass,setPass] = useState()
    useEffect(()=>{
    
    //fetch stats/pf info
    axios.post("/profile/stats",credentials)
    .then((res)=>{
    console.log("res.data:")
    res.data.powerLevel != undefined && setUserStats(res.data) //statefuls fill in values on profile 
    
    })
    },[])
const [emailEditor,setEmailEditor] = useState("")
const [passwordEditor,setPasswordEditor] = useState("")
const queryParams = useContext(credentialContext)

const [edits,setEdits] = useState({ //handles all input changes for submission to server
    userName: "",
    email: "",
    password: "",
    confirmUserName: "",
    confirmEmail: "",
    confirmPassword: ""
})
let pfpInitialVal = "/pfpblank.png" //generic pfp if no localStorage value pulled
if(localStorage.getItem("profilePicture")!=undefined){
    pfpInitialVal = localStorage.getItem("profilePicture") //checks on each load. 
}

const [urlTracker,setUrlTracker] = useState({url:""}) //tracks changes
const [pfpLink,setPfpLink] = useState(pfpInitialVal) //state value of pfp url 
const [pfpEditor,setPfpEditor] = useState(false)

// useEffect(()=>{
//     localStorage.setItem("profilePicture",pfpLink)
// },pfpLink)

function handleChangePfp(e){
    const {name,value}= e.target;
    console.log(urlTracker)
    setUrlTracker(previous=>{
        return {
            ...previous,
            [name]:value
        }
    })
    
}
function pfpSave(e){
e.preventDefault()
localStorage.setItem("profilePicture",urlTracker.url) //sets PFP to localstorage, where stateful pulls it's value from on refresh
setPfpLink(urlTracker.url)


setPfpEditor(false)


}
function alertImage(){
    localStorage.setItem("profilePicture","/pfpblank.png") //ensures that profileTray also gets updated value, not undefined
setPfpLink("/pfpblank.png")
    
console.log("Invalid image source. Please try another source")
}


function handleChange(event){
    const {name,value} = event.target; //name/value are the html keys name = and value =
setEdits(preVal=>{
return {
    ...preVal,
    [name]: value
}
})

}
//API calls to POST changes
let submitEmail=(e)=>{
   e.preventDefault()
    console.log("edits saved")
    console.log(edits.email)
    let data = {
        email:edits.email,
        queryParams:queryParams,
        editType:"email" //use same path for any pf edit by specifying name of user doc obj key to change
    }
    if(validate.validateEmail(data.email)){
    axios.post("/settings/edit",data)
    .then((res)=>{
        console.log(res.data)
        setEdits({ 
            userName: "",
            email: "",
            password: "",
            confirmUserName: "",
            confirmEmail: "",
            confirmPassword: ""
        })
    })
}else alert("not a valid email!")
}

let submitPassword = (e)=>{
    e.preventDefault()
    console.log("edits saved")
    let data = ""
    if(edits.password === edits.confirmPassword){ //ensure confirmation matches
     data = {
        password: edits.password,
        queryParams:queryParams,
        editType:"password"
    }
    // console.log(validate.validatePassword(data.password))
    if(validate.validatePassword(data.password)==true){

    axios.post("/settings/edit",data)
    .then((res)=>{
       console.log(res.data) 
       setEdits({ 
        userName: "",
        email: "",
        password: "",
        confirmUserName: "",
        confirmEmail: "",
        confirmPassword: ""
    })
    })
}else {
    return(alert("Ensure password contains at least 1 uppercase, 1 lowercase,a number, and is 6 characters or more in length"))
}
}else {
    return(alert("Passwords do not match- please review."))
}
}

    return (
        <div className="mclaren">
            <div className="card user-card-full theGoodShading margin-all">
             
                <div className="row m-l-0 m-r-0">
            
                    <div  className="col-md-5 col-sm-12 bg-c-lite-green user-profile">
                    {/* <i style={{width:'80px', color:"white"}} className=" mdi mdi-square-edit-outline feather icon-edit m-t-10 f-16"></i> */}
                    
                        <div className="card-block text-center text-white">

                            <div className="m-b-25"> 
                            <img onError={alertImage} src={pfpLink} className="img-radius pfp" alt="User-Profile-Image" /> 
                            <div className="pad-t-sm"><i class="fas fa-2x fa-pencil-alt " onClick={()=>setPfpEditor(true)}></i></div>
                            {pfpEditor && <form style={{width:"30vw",fontSize:"0.8rem"}}>
                                <input name="url" onChange={handleChangePfp} placeholder="Image url here"></input><button onClick={pfpSave} className="save-btn-sm">Save</button>
                            </form>

                            }
                            </div>
                            
                            <h4 className="f-w-600">{props.username}</h4>
                            <h4>{credentials.username=="7"|| credentials.username=="Blue Kirby"?"Creator King" : userStats.rank}</h4> 
                            <h6>Power Level:</h6>
                            <h3 className="glowtext">{userStats.powerLevel}</h3>
                            
                        </div>
                    </div>
                    <div className="col-md-7">
                        <div className="card-block centered">
                            <h4 className="m-b-20 p-b-5 b-b-default f-w-600" h6>Info</h4>
                            <div className="row rm-mg-row">
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
                            <div className="row rm-mg-row">
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
<div id="editSettings" className="centered">
{/* <div className="content-card-indigo ">
    <p2>Change Email</p2>
   
</div> */}

          <div className=" br-indigo content-card-lg theGoodShading">
          <div className=" ">
    <h4 className="pad-t-sm">Change Email</h4>
   
</div>
          <div className="col-xs-12 col-xl-12">
          <form className="br-yt">
          <div className="centered">
        <div>
          <label for="email">New Email </label>
        </div>  <div>
          <input style={{borderTop:"1px solid gray",borderBottom:"1px solid gray"}} id="email" name="email" type="text" onChange={handleChange}></input>
        </div>
          </div>
          <div className="centered">
        <div>
          <label for="confirmEmail">Confirm New Email</label>
        </div>  <div>
          <input style={{borderTop:"1px solid gray",borderBottom:"1px solid gray"}} id="confirmEmail" name="confirmEmail" type="text" onChange={handleChange}></input>
            </div>
          </div>
          <div className="centered">
              <button className="save-btn" onClick={submitEmail}>Save</button>
              </div>
              </form>
          </div>
          
          </div>

          
         

              <div className="content-card-lg  br-indigo bottom-space theGoodShading">
              <div className="br-indigo">
    <h4 className="pad-t-sm">Change Password</h4>
</div>
              <div className="col-xs-12 col-xl-12">
              <form className="br-yt">
              <div className="centered">
            <div>
              <label for="password">New Password </label>
            </div>  <div>
              <input style={{borderTop:"1px solid gray",borderBottom:"1px solid gray"}} id="password" name="password" type="password" onChange={handleChange}></input>
            </div>
              </div>
              <div className="centered">
            <div>
              <label for="confirmPassword">Confirm New Password</label>
            </div>  <div>
              <input style={{borderTop:"1px solid gray",borderBottom:"1px solid gray"}} id="confirmPassword" name="confirmPassword" type="password" onChange={handleChange}></input>
                </div>
              </div>
              <div className="centered">
              <button className="save-btn br-yt" onClick={submitPassword}>Save</button>
              </div>
              </form>
              </div>
              
              </div>

            
              

</div>

        </div>
    )
}

export default Settings
