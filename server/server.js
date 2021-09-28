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
      theme: String
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
         array.map((pastEntry,index)=>{
            if (pastEntry.startDate != fullDate){ //currently start/end date are the same- both = fullDate
               // console.log(pastEntry)
               return pastEntry 
            }
         })
         eventList.length > 0 && array.push(eventList)
         array.sort((a,b)=>new Date(a.startDate)-new Date(b.startDate))
         doc.eventsArray = array
         doc.save()
         res.json("eventList updated successfully")
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
    

app.listen(PORT, () => {
   console.log(app.get("env").toUpperCase() + " Server started on port " + (PORT));
});