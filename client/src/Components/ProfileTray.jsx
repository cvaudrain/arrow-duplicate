import React,{useState,useContext,useEffect} from "react"
import { credentialContext } from "./App"
import axios from "axios"

function ProfileTray(props){
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
    return(
        <div className="page-content page-container" id="page-content">
    <div className="padding">
        <div className="row container d-flex justify-content-center">
            <div className="col-xl-12 col-md-12">
                <div className="card user-card-full">
                    <div className="row m-l-0 m-r-0">
                        <div className="col-sm-4 bg-c-lite-green user-profile">
                            <div className="card-block text-center text-white">
                                <div className="m-b-25"> <img src="/beluga.jpg" className="img-radius pfp" alt="User-Profile-Image"/> </div>
                                <h4 className="f-w-600">{props.username}</h4>
                                <p>{credentials.username=="7"|| credentials.username=="Blue Kirby"?"Creator King" : "New User"}</p> <i className=" mdi mdi-square-edit-outline feather icon-edit m-t-10 f-16"></i>
                            </div>
                        </div>
                        <div className="col-sm-8">
                            <div className="card-block">
                                <h4 className="m-b-20 p-b-5 b-b-default f-w-600" h6>Information</h4>
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
                                <ul className="social-link list-unstyled m-t-40 m-b-10">
                                    <li><a href="#!" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="facebook" data-abc="true"><i className="mdi mdi-facebook feather icon-facebook facebook" aria-hidden="true"></i></a></li>
                                    <li><a href="#!" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="twitter" data-abc="true"><i className="mdi mdi-twitter feather icon-twitter twitter" aria-hidden="true"></i></a></li>
                                    <li><a href="#!" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="instagram" data-abc="true"><i className="mdi mdi-instagram feather icon-instagram instagram" aria-hidden="true"></i></a></li>
                                </ul>
                            </div>
                           
                            
                        </div>
                        {/* Addittional card */}
                        <div className="centered col-lg-12 col-sm-8">
                            <div className="card-block">
                                <h4 className="m-b-20 p-b-5 b-b-default f-w-600" h6>Stats</h4>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <p className="m-b-10 f-w-600">Focus</p>
                                        <h4 className="text-muted f-w-400 h6">{userStats.focus}</h4>
                                    </div>
                                    <div className="col-sm-6">
                                        <p className="m-b-10 f-w-600">Motivation</p>
                                        <h4 className="text-muted f-w-400 h6">{userStats.motivation}</h4>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <p className="m-b-10 f-w-600">Calm</p>
                                        <h4 className="text-muted f-w-400 h6">{userStats.calm}</h4>
                                    </div>
                                    <div className="col-sm-6">
                                        <p className="m-b-10 f-w-600">Vibe</p>
                                        <h4 className="text-muted f-w-400 h6">{userStats.mood}</h4>
                                    </div>
                                </div>
                                <h4 className="m-b-20 m-t-40 p-b-5 b-b-default f-w-600 h6">Power Level</h4>
                                <div className="">
                                    <div className="centered">
                                        {/* <p className="m-b-10 f-w-600">Power Level</p> */}
                                        <h1 className="text-muted f-w-400 ">{userStats.powerLevel}</h1>
                                    </div>
                                    {/* <div className="col-sm-6">
                                        <p className="m-b-10 f-w-600">Monthly Goals</p>
                                        <h4 className="text-muted f-w-400 h6">1/2</h4>
                                    </div> */}
                                </div>
                                
                            </div>
                           
                            
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
    )
}
export default ProfileTray