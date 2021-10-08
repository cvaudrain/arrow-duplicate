require("dotenv").config({debug: process.env.DEBUG});
const express  = require("express");
const mongoose = require("mongoose");
var session = require("express-session")
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose")
const path = require("path");
var cors = require('cors')
const { response } = require("express");
const { ServerResponse } = require("http");
const { match } = require("assert");
const app = express();
const nodemailer = require("nodemailer");
var getRandomValues = require("get-random-values")
// const SECRET = process.env.SECRET //passport.js local strategy secret key- cookie signature
const PORT     = process.env.PORT || 4747;
const DB       = "arrowDB";
// const DB_URI   = process.env.DATABASE_URL; // recall that mongo runs locally on port 27017 by default

//Serve Production Build as static:
// app.use(express.static(path.join(__dirname,"../client/build")));
app.use(express.static(path.join(__dirname,".././client/build"))); //imports build
app.get("*",(req,res)=>{
   res.sendFile(path.join(__dirname,"../client/build","index.html"))
})

// app.get("/authenticate",(req,res)=>{
// res.sendFile(path.join(__dirname,"../client/build","index.html"))
// })

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
//Authentication w/ Passport

app.use(session({
   resave:false,
   saveUninitialized:false,
   secret: "BlueElephant" //REQUIRED here, not as a process.env
}))
app.use(passport.initialize())
app.use(passport.session())
// app.use(cors());
 
// Establish DB connection////////////////////////////////

// mongoose.connect(process.env.DATABASE_URL + DB, {
//    useUnifiedTopology: true,
//    useNewUrlParser: true,
//    useCreateIndex: true,
//    useFindAndModify: false,
//    connectTimeoutMS: 10000
// });

//local ONLY testing connection to Mongo
mongoose.connect("mongodb://localhost:27017/"+DB,{
   useUnifiedTopology: true,
   useNewUrlParser: true,
   useCreateIndex: true,
   useFindAndModify: false,
   connectTimeoutMS: 10000
});
 
const db = mongoose.connection; 
 db.on("error",(error)=>{console.log(error)})
// Event listeners
db.once('open', () => console.log(`Connected to ${DB} database`));

const UserSchema = new mongoose.Schema( //1st Schema
   {
      username: String,
      email: String,
      password: String,
      notesArray: Array,
      eventsArray : Array,//contains the following object formats per date, formatted before save()
      /* {
         singleDate: String, // the full date value, used to sort datesArray, and to locate entries
         eventArray: Array,//contains obj event: {Title: String, location: String, Description: String
      },*/
      journalArray : Array, //contains the following object formats sorted by date, formatted before save()
      /*date: String,
            mood: Number,
            motivation: Number,
            focus: Number,
            calm: Number,
            powerLevel: Number,//(mood + motivation + sleepQuality / 3) x 1000. 
            entry: String
         }  
      */
      theme: String,
      recoveryCode: String
   }, 
   {collection: "arrowUsers"} //custom collection name
)

UserSchema.plugin(passportLocalMongoose) //2nd Passport  Plugin

let UserModel = db.model("UserModel", UserSchema) //3rd create Model //by default would start new collection called usermodels case insensitive.

passport.use(UserModel.createStrategy()) //4 Create Strategy 
passport.serializeUser(UserModel.serializeUser())
passport.deserializeUser(UserModel.deserializeUser())
//AUTH POST Listeners///////

//For REGISTRATION///////////
app.post("/api/registerUser", (req,res)=>{ 
   let posted = req.body
   console.log("received new user credentials: ")
console.log(posted)
UserModel.register(
   {
   username: posted.username,
   email:posted.email,
   notesArray:[]
}, posted.password,function(err,user){
   if(err){
      console.log(err)
      res.json({
         authStatus: false,
         username: "nameless user",
         email: "no email",
         notes: [],
         error:err
      })  
   }else{
      passport.authenticate("local")(req,res,function(){
         res.json({
            authStatus: true,
            username: posted.username,
            email: posted.email,
            notes: []
         }) 
      })
   }
})

})
//
//For LOGIN/////////////////
app.post("/api/authenticate", (req,res,next)=>{
   console.log("posted recieved from client")
   passport.authenticate("local",function(err,user,info){
      if(err){ 
         res.json(err)
         console.log(err)
         return next(err)}
      if(!user){
         console.log(req.body)
         console.log("user not found")
         return res.json("unsuccessful attempt")
      }

      req.logIn(user,function(err){
         if(err){
            res.json(err)
            console.log("req.logIn called, error thrown")
            return next(err)
         }
         console.log("req.logIn called, NO error.")
         
         return res.json(
            {retrievedUsername: user.username,
               retrievedNotes: user.notesArray,
               retrievedEmail:user.email,
               authenticated: true}
         )
      })
   })(req,res,next);
   
});
             
//MAIN NOTE APP GET/POST
app.get("/api/practiceNotes", (req, res) => { //REQ to client for res (notes arr)
   console.log("req.params object is:")
 console.log(req.headers.email) //use req.headers containing an OBJECT with email as VALUE instead of data or params

 let emailQuery = req.headers.email
UserModel.findOne({email:{$regex:emailQuery}}, (err, userDoc) => { 
      if (!err) {
         console.log("GET req:")
         console.log(userDoc) 
      } else {
         console.log(err)
      }
   })
   .then((userDoc)=>{ //.thenable, so we reference the returned userDoc from mongoose query
      res.json(userDoc.notesArray) 
   })
})

app.post("/api/addNotes",(req, res) => {
   let notes = req.body.notes //this is an array of objects. This is correct
   let userEmail = req.body.userEmail 

  const user = UserModel.findOne({email: {$regex:userEmail}},(err,userDoc)=>{
     if(err){
        console.log(err)
     } else if(!userDoc){
        console.log("Query returned no user-debug")

     } else{
        return userDoc
     }
  })
  .then((userDoc)=>{ 
     
   userDoc.notesArray = notes
    userDoc.save() //const  user = the returned query value. 
    
    res.json("Your notes have updated successfully!")
  })
  .catch((err)=>{
     console.log(err)
     res.json(err)
   })
 
  })

//DASHBOARD/HUD
app.post("/api/setdashboard",(req,res)=>{
   console.log("FETCH DASHBOARD ITEMS")
   console.log(req.body)
   UserModel.findOne({email:req.body.email},(err,doc)=>{
if(err){
   console.log(err)
}
else if(!doc) {
   res.json("No user found, revise query.")
}
else{
   return doc
}
   })
.then((doc)=>{
   let currDate = new Date()
   let array = doc.eventsArray
   array = array.filter((n,i)=>{
      if(n[0].startDate == currDate.toString().split(" ").slice(0,4).join(" ")){
      return n} else{
         null
      }
   })
   if(array.length == 0) {
      console.log("None")
      res.json("None")
    } else{
       console.log("array found")
        res.json(array[0])
    }
   
})
})


  //SCHEDULER
app.post("/scheduler/findevents",(req,res)=>{
console.log(req.body)

UserModel.findOne({username:req.body.username},(err,doc)=>{
   if(err){
      console.log(err)
   } else if(!doc){
      console.log("query returned no user, debug")
   } else return doc
})
.then((doc)=>{
   const events = doc.eventsArray
   res.json(events)
})
.catch((err)=>console.log(err))
})

  //EVENTS
  app.post("/events/fetch",(req,res)=>{
        console.log("fetching events")
        let fetchedEvents = []
        console.log("req.body:")
       console.log(req.body)//should be queryParams and fullDate
       UserModel.findOne({username:req.body.queryParams.username},(err,doc)=>{
          if(err){
             console.log(err)
          } else if(!doc){
             console.log("query returned no user, debug")
          } else return doc
       })
       .then((doc)=>{
         //  doc.eventsArray = []
         //  doc.save()
          let retrievedArray = doc.eventsArray
         //  console.log("retrieved array is:")
          console.log(retrievedArray)
          
          retrievedArray.forEach((eventArr,ind)=>{
            if (eventArr[0].startDate == req.body.fullDate){ //compare startDate from any of the 3 events
               console.log("match found")
               console.log(eventArr)
               fetchedEvents = eventArr //entire array
               // res.json(fetchedEvents)
            } else{
               console.log("match NOT found") 
            //  res.json(["none found"])
            }
              
         })
         console.log(fetchedEvents)
         console.log("returning events to client")
         res.json(fetchedEvents)// if no match, will be empty array as is appropriate to reset given date
         // fetchedEvents ? res.json(fetchedEvents) : res.json([])
      })
       })
  app.post("/events/update",(req,res)=>{
     console.log("updating events...")
     console.log(req.body)
     const eventList = req.body.eventList //events for single date
     const fullDate = req.body.fullDate
     console.log("fulldate:  " + fullDate)
     const queryParams = req.body.queryParams
   //   res.json("Received event list: " + eventList.evName + ", " + "scheduled on " + eventList.startDate + "." )
     UserModel.findOne({username:req.body.queryParams.username},(err,doc)=>{
      if(err){
         console.log(err)
      }else if(!doc){
         console.log("Query returned no user.. debug.")
      } else{
         return doc 
      }
      })
      .then((doc)=>{
         // doc.eventsArray = []
         // doc.save()
         console.log(doc.eventsArray)
         let array = doc.eventsArray //ALL dates, each with event arrays
         array = array.filter((pastEntry,index)=>{
            if (pastEntry[0].startDate != fullDate){ //currently start/end date are the same- both = fullDate
               // console.log(pastEntry)
               return pastEntry 
            }
         })
         eventList.length > 0 && array.push(eventList)
         array = array.sort((a,b)=>new Date(a.startDate)-new Date(b.startDate))
         doc.eventsArray = array
         //doc.eventsArray=[] //used to reset user Array during debugging
         doc.save()
         res.json("successful update to DB")
      })
      .catch((err)=>console.log(err))
      // res.json("received at server")
   })

//SCHEDULER
//   app.post("/events/save",(req,res)=>{
//    console.log("save function fired")
//    console.log(req.body)

//    res.json("Received event list at server.")
// })

//JOURNAL Entry
app.post("/journal/save",(req,res)=>{
   console.log("save function fired")
   console.log(req.body)
let journalEntry = {
   fullDate: req.body.fullDate,
   stats: req.body.stats,   
   entry: req.body.entry
}
//Query DB 
 UserModel.findOne({username:req.body.queryParams.username},(err,doc)=>{
if(err){
   console.log(err)
}else if(!doc){
   console.log("Query returned no user.. debug.")
} else{
   return doc 
}
})
.then((doc)=>{
   console.log("user found:")
   console.log(doc)
   let array = doc.journalArray
   console.log(array)
   let entry = {
      journalEntry
   }
   array.map((pastEntry,index)=>{
      if(pastEntry.fullDate != journalEntry.fullDate){
         return pastEntry
      }
   })
   array.push(journalEntry)
   array.sort((a,b)=>new Date(a.fullDate)-new Date(b.fullDate))
   doc.journalArray = array
   doc.save()
})
.catch((err)=>console.log(err))

   res.json("Received at server.")
})

app.post("/journal/fetch",(req,res)=>{
   let matchEntry = {
      entry: "",
      stats: ""
   } //both entry and stats in object
   console.log(req.body) //queryParams and date
   UserModel.findOne({username:req.body.queryParams.username},(err,doc)=>{ //add email into query
      if(err){
         console.log(err)
      }else if(!doc){
         console.log("Query returned no user.. debug.")
      } else{
         return doc 
      }
      })
      .then((doc)=>{
        
         console.log("user found. populating journal entry")
         let retrievedArray = doc.journalArray
         console.log(retrievedArray)
        
           retrievedArray.forEach((journObj,ind)=>{
               if (journObj.fullDate == req.body.fullDate){
                  console.log("match found")
                  matchEntry = journObj 
                 
               } else{
                  console.log("match NOT found") //set the response to default value
                   
                 
               }
                 
            })
            console.log(matchEntry)
            res.json(matchEntry)
         })
        
         .catch((err)=>console.log(err))
          
      })
      app.post("/journal/reader/fetch",(req,res)=>{
         console.log("REQ.BODY")
         console.log(req.body)
         let matchEntry = {
            entry: "",
            stats: "",
           
         } //both entry and stats in object
         let matchEntryInd;
         console.log(req.body) //queryParams and date
         UserModel.findOne({username:req.body.username},(err,doc)=>{ //add email into query
            if(err){
               console.log(err)
            }else if(!doc){
               console.log("Query returned no user.. debug.")
            } else{
               return doc 
            }
            })
            .then((doc)=>{
              
               console.log("user found. populating journal entry")
               let retrievedArray = doc.journalArray
               console.log(retrievedArray)
            //   doc.journalArray=[]
            //   doc.save()
               //   retrievedArray.forEach((journObj,ind)=>{
               //       if (journObj.fullDate == req.body.fullDate){
               //          console.log("match found")
               //          matchEntry = journObj 
               //         matchEntryInd = ind
               //       } else{
               //          console.log("match NOT found") //set the response to default value
                         
                       
               //       }
                       
               //    })
                  // console.log(matchEntry)
                  // matchEntry = {
                  //    ...matchEntry,
                  //    entryIndex:matchEntryInd, //get our place in the order of entries
                  //    retrievedArray: retrievedArray //add all journal entries for "page flipping" without other requests
                  // }
                  let response={
                     retrievedArray:retrievedArray,
                     currInd:retrievedArray.length
                  }
                  res.json(response)
               })
              
               .catch((err)=>console.log(err))
                
            })
    
      //Get stats and power level info for pf card in slideout / profile page
      app.post("/profile/stats",(req,res)=>{
         let credentials = req.body
         console.log(credentials)
         UserModel.findOne({username:credentials.username},(err,doc)=>{
            if(err){
               console.log(err)
            } else if(!doc){
               console.log("User not found.. Please debug.")
            }else{
               return doc
            }
            })
            .then((doc)=>{
               // console.log("returning stats...")
               let journalEntries = doc.journalArray.slice(0) //no mutating here...

               const stats = {
               mood: 0,
               motivation: 0,
               focus: 0,
               calm: 0,
               powerLevel:0,
               rank:""
               }
               const statsAggregate = {
                  moodAgg: 0,
               motivationAgg: 0,
               focusAgg: 0,
               calmAgg: 0,
               kaioken:0,
               powerLevel:0
               }
               //iterate through stats
               journalEntries.forEach((entry)=>{
                statsAggregate.moodAgg = statsAggregate.moodAgg + parseInt(entry.stats.mood)
                statsAggregate.motivationAgg = statsAggregate.motivationAgg + parseInt(entry.stats.motivation)
                statsAggregate.focusAgg = statsAggregate.focusAgg + parseInt(entry.stats.focus)
                statsAggregate.calmAgg = statsAggregate.calmAgg + parseInt(entry.stats.calm)
                entry.entry.content.length > 50 ? statsAggregate.kaioken+=5 : null
                console.log("statsAgg currently:")
                console.log(statsAggregate)
               })
               // console.log("statsAggregate after iteration:")
               // console.log(statsAggregate)
               //Calc stats and power level (ea stat = per stat sum of all days, / # of entries, x 100 for sizzle)
               //...Plus a bonus modifier of +4 per each day where journal entry.content > 50 chars for extra sizzle
               // console.log(statsAggregate)
               const divisor = journalEntries.length
               // console.log("divisor =")
               // console.log(divisor)
               stats.mood = Math.floor(parseInt(statsAggregate.moodAgg)/divisor * 10)
               stats.motivation = Math.floor(parseInt(statsAggregate.motivationAgg)/divisor * 10)
               stats.focus = Math.floor(parseInt(statsAggregate.focusAgg)/divisor * 10)
               stats.calm = Math.floor(parseInt(statsAggregate.calmAgg)/divisor * 10)
               stats.powerLevel = Math.floor(parseInt(stats.mood + stats.motivation + stats.focus + stats.calm + statsAggregate.kaioken))
               if(doc.username=="Blue Kirby"){stats.rank="Lvl.100 White Knight Paladin"}
                else if(stats.powerLevel<10){stats.rank="Novice"}
else if(stats.powerLevel<100){stats.rank="Acolyte"}               
else if(stats.powerLevel<300){stats.rank="Adventurer"}
else if(stats.powerLevel<500){stats.rank="Hero"}               
else if(stats.powerLevel<1000){stats.rank="Champion"}
else if(stats.powerLevel<2000){stats.rank="Paladin"}  
else{stats.rank="Unranked"}             
               console.log(stats)
               res.json(stats)
            })
         })


         //Profile Maintenance
         app.post("/settings/edit",(req,res)=>{
            console.log("settings/edit")
            console.log(req.body)
            
            if(req.body.editType==="password"){ //regardless of form data, editType is specific to the submission functions for each respective type of edit
               UserModel.findOne({username:req.body.queryParams.username},(err,user)=>{
                  if(err){
                     console.log(err)
                  } else if(!user){
                     console.log("User not found.. Please debug.")
                  }else{
                     return user
                  }
                  })
                  .then((user)=>{
                    
                     user.setPassword(req.body.password,(err)=>{
                        console.log(req.body.password)
                        if(err){
                           console.log(err)
                        }
                        else{
                           user.save()
                           res.json("Password Reset Successfully")
                        }
                     })
                  })
            }
            
         })

            //PASSWORD RECOVERY//   

//global scope for password recovery variables (used for sendmail and submitcode endpoints)
let recoveryCreds={
username:"",
code:""
}

         app.post("/passwordrecovery/submitemail",(req,res)=>{
            console.log("received request")
            console.log(req.body)

            const email = req.body.email
            console.log(email)
            UserModel.findOne({email:email},(err,user)=>{
               if(err){
                  console.log(err)
                  res.json("Error-email not registered.")
               } else {
                  
                  return user
               }
               })
               .then((user)=>{
                
//Nodemailer Transporter Obj
let transporter = nodemailer.createTransport({
   service:"gmail",
   auth:{
      user:process.env.NODEMAIL_USER,
      pass:process.env.NODEMAIL_PASS
   }
})
//Generate random num for recovery code
let array = new Uint8Array(8) //returns an array of 8 numbers
let num = getRandomValues(array)
num = num[0].toString() + num[1].toString() //takes the stringified versions of first 2 numbers (gives longer random number instead of only 2-3 chars each)
console.log(email)
console.log(num)

    recoveryCreds= {
      username:user.username,
      code: num
   }
console.log(user.email)
                  let options = { //now email will send
                     from:'"Arrow Support"',
                     to:user.email,
                     subject:"Arrow Password Recovery",
                     priority:"high",
                    secure:"false",
                     html:`<div>
                     <div>
                         <h3>Hello, ${recoveryCreds.username}</h3>
                     </div>
                     <div>
                          This message is sent to you per your request to recover your account with Arrow.
                          Your confirmation code is: <strong> ${recoveryCreds.code} </strong>.  
                          <div>Thanks for using Arrow!</div> 
                          <div>Best,</div>
                          <div>Arrow Support</div>
                          (If you did not request this reset, ignore this email.)
                     </div>
                 </div>`
                  }
                  console.log(options)
                  transporter.sendMail(options,function(err,info){
                     if(err){
                        console.log(err)
                     } else{
                        console.log("email sent")
                     }
                  })
                  user.recoveryCode = recoveryCreds.code
                  res.json("success") 
                  console.log("user saved after res.json")
                  user.save()
               })
            })
         

         app.post("/passwordrecovery/submitcode",(req,res)=>{
            const recoveryCode = req.body.recovery
            const email = req.body.email
            console.log(req.body)
            UserModel.findOne({email:email},(err,user)=>{
               if(err){
                  console.log(err)
                  res.json("Error-email not registered.")
               } else {
                  
                  return user
               }
               })
               .then((user)=>{
                  if(user.recoveryCode == recoveryCode){
                     user.recoveryCode = ""
                     let tempPass = "Arrow"+user.username+recoveryCode
                     //resets user password to temp pass
                     user.setPassword(tempPass,(err)=>{
                        console.log(tempPass)
                        if(err){
                           console.log(err)
                           res.json("error on server...")
                        }
                        else{
                   //then send data to client
                     res.json({
                        recovered:true,
                        tempPass:tempPass,
                        message:`Successful recovery. your temporary password is ${tempPass}. Use it for your next login and for security purposes, reset your password from the settings page.`
                     })
                  }
                     //finally, save updated user info
                     user.save()
                  })

                  } else{
                     res.json("incorrect code. please try again")
                  }
               })
         })
      

app.listen(PORT, () => {
   console.log(app.get("env").toUpperCase() + " Server started on port " + (PORT));
});