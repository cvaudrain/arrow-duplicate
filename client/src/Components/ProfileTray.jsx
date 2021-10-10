import React,{useState,useContext,useEffect} from "react"
import { Switch, Route, Link, Redirect,useLocation, useHistory } from "react-router-dom";
import { credentialContext } from "./App"
import axios from "axios"


function ProfileTray(props){
    const history = useHistory()
const credentials = useContext(credentialContext)
const [userStats,setUserStats]=useState({ //placeholder values while awaiting axios API call to fetch data
    mood: 0,
    motivation: 0,
    focus: 0,
    calm: 0,
    powerLevel:0,
    rank:""
})
const [pfEditor,setPfEditor] = useState(false)
let pfpVal = "/pfpblank.png"
if(localStorage.getItem("profilePicture") !=undefined){
pfpVal = localStorage.getItem("profilePicture")
}
const [pfp,setpfp] = useState(pfpVal)
useEffect(()=>{


axios.post("/profile/stats",credentials)
.then((res)=>{
console.log("res.data:")
console.log(res.data)
res.data.powerLevel != undefined && setUserStats(res.data) //statefuls fill in values on profile 

})
.catch((err)=>console.log(err))
},[])

// function toSettings(){
//     console.log("nav to settings")
// }
const [viewport,setViewport] = useState(window.innerWidth) //render abridged info if vw <800px- mobile users
window.addEventListener("resize",handleViewport)
function handleViewport(){
    if(window.innerWidth <800 && viewport >800){ setViewport(window.innerWidth)}
    if(window.innerWidth >=800 && viewport <800){ setViewport(window.innerWidth)}
}

    return(
        <div className="page-content page-container mclaren m-b-0" id="page-content">

    <div className=" m-b-0">
        <div className="row container d-flex justify-content-center" >
            <div className="col-xl-12 col-md-12">
                <div className="card user-card-full centered m-t-15 theGoodShading">
                 
                    <div className="row m-l-0 m-r-0">
                
                        <div  className="col-md-12 col-sm-12 bg-c-lite-green user-profile">
                        {/* <i style={{width:'80px', color:"white"}} className=" mdi mdi-square-edit-outline feather icon-edit m-t-10 f-16"></i> */}
                        
                            <div className="card-block text-center text-white kalam centered center-div">

                                <div className=" m-l-0 m-r-0 centered"> 
                                <img src={pfp} className="img-radius pfp-swipe" alt="User-Profile-Image" /> 
                                
                                </div>
                                {/* <i style={{color:"whites"}} className="fas fa-2x fa-edit options" onClick={toSettings}></i> */}
                                <div className="centered center-div">
                                <h4 >{credentials.username}</h4>
                                <h5>{credentials.username=="7"|| credentials.username=="Blue Kirbyy"?"Creator King" : userStats.rank}</h5> 
                                <h6>Power Level:</h6>
                                <h3 className="glowtext">{userStats.powerLevel}</h3>
                                </div>
                            </div>
                        </div>

                        </div>
                        <div>
                       
                            <div className="card-block ">
                                {/* <p className="m-b-20 p-b-5 b-b-default f-w-600"><strong>Stats</strong></p> */}
                                <div className="row ">
                                    <div className="col centered center-div">
                                        <p className="m-b-10 f-w-600">Focus</p>
                                        <p className="text-muted f-w-400 h6">{userStats.focus}</p>
                                    </div>
                                    <div className="col centered center-div">
                                        <p className="m-b-10 f-w-600">Motivation</p>
                                        <p className="text-muted f-w-400 h6">{userStats.motivation}</p>
                                    </div>
                                </div>
                                <div className="row ">
                                    <div className="col centered center-div">
                                        <p className="m-b-10 f-w-600">Calm</p>
                                        <p className="text-muted f-w-400 h6">{userStats.calm}</p>
                                    </div>
                                    <div className="col centered center-div">
                                        <p className="m-b-10 f-w-600">Vibe</p>
                                        <p className="text-muted f-w-400 h6">{userStats.mood}</p>
                                    </div>
                                </div>
                                
                                
                            </div>
                           
                          
                        </div>
                        </div>

                    {/* </div> */}
                </div>
            </div>
        </div>
    </div>

    )
}
export default ProfileTray