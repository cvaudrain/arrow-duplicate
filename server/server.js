require("dotenv").config();
const express  = require("express");
const mongoose = require("mongoose");
const session = require("express-session")
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose")
// const cors     = require("cors"); //may need cors to replace proxy in production build
const path     = require("path");
const { response } = require("express");
const { ServerResponse } = require("http");
const app = express();
 
const SECRET = process.env.SECRET //passport.js local strategy secret key- cookie signature
const PORT     = process.env.PORT || 4747;
const DB       = "arrowDB";
const DB_URI   = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.sfcxm.mongodb.net/arrowDB?retryWrites=true`; // recall that mongo runs locally on port 27017 by default

// const PRACTICEDB = "practiceDB" 
// const serverAddress = "http://localhost:4747/api/notes"
// const serverAddress = "http://localhost:4747/api/practiceNotes"
// const addNoteAddress = "http://localhost:4747/api/addNotes"
//used full address instead of proxy to launch w/o issue in production build
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Authentication w/ Passport x BCrypt

app.use(session({
   resave:false,
   saveUninitialized:false,
   secret: SECRET
}))
app.use(passport.initialize())
app.use(passport.session())
// app.use(cors());
 
// Establish DB connection////////////////////////////////
mongoose.connect(DB_URI + DB, {
   useUnifiedTopology: true,
   useNewUrlParser: true,
   useCreateIndex: true,
   useFindAndModify: false,
   connectTimeoutMS: 10000
});
 
const db = mongoose.connection; //the currently specified db in mongoose.connect()
 db.on("error",(error)=>{console.log(error)})
// Event listeners
db.once('open', () => console.log(`Connected to ${DB} database`));
 
//PRACTICE requests
// const PracticeSchema = new mongoose.Schema(
//    {
//       allNotes: Array
//    },
//    {collection: "practiceCollection"} //THE COLLECTION
// )
// let PracticeModel = db.model("PracticeModel",PracticeSchema)
//so based on schema, PracticeModel.cloudNotes = [the notes array]


const UserSchema = new mongoose.Schema( //1st Schema
   {
      username: String,
      email: String,
      password: String,
      notesArray: Array
   },
   {collection: process.env.Collection}
)

UserSchema.plugin(passportLocalMongoose) //2nd Passport  Plugin

let UserModel = db.model("UserModel", UserSchema) //3rd create Model

passport.use(UserModel.createStrategy()) //4 Create Strategy 
passport.serializeUser(UserModel.serializeUser())
passport.deserializeUser(UserModel.deserializeUser())
//AUTH POST Listeners//////////////////////////////////////////////////////

//For REGISTRATION///////////
app.post("/api/registerUser", (req,res)=>{ //This works
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
      }) //will set authstatus in React state 
   }else{
      passport.authenticate("local")(req,res,function(){
         res.json({
            authStatus: true,
            username: posted.username,
            email: posted.email,
            notes: []
         }) //will set authstatus in React state
      })
   }
})

//.then(()=>res.json(serverResponse)) //.then() ensures that serverResponse is ready prior to res.json to client

})
//
//For LOGIN/////////////////
app.post("/api/authenticate", (req,res,next)=>{
   console.log("posted recieved from client")
   passport.authenticate("local",function(err,user,info){
      if(err){ 
         console.log(err)
         return next(err)}
      if(!user){
         console.log(req.body)
         console.log("user not found")
         return res.json("unsuccessful attempt")
      }

      req.logIn(user,function(err){
         if(err){
            console.log("req.logIn called, error thrown")
            return next(err)
         }
         console.log("req.logIn called, NO error.")
         console.log(user.username)
         console.log(user.notesArray)
         console.log(user.email)
         return res.json(
            {retrievedUsername: user.username,
               retrievedNotes: user.notesArray,
               retrievedEmail:user.email,
               authenticated: true}
         )
      })
   })(req,res,next);
   

});
            
         
   //IF DB query matches, THEN res.json
   // UserModel.findOne({email: {$regex:enteredEmail},password: {$regex:enteredPassword}}, (err,dbRes)=>{
   //    if(err){
   //       console.log(err)
   //       responseData = "Hm, something went wrong. Please try again."
   //    } else if(dbRes){
   //       console.log(dbRes)
   //       console.log(dbRes.notesArray)
   //       responseData =  {
   //          message: "that email and password combo was returned as true from db. Proceed.",
   //          alreadyRegistered: true,
   //          authenticated: true,
   //          retrievedUsername: dbRes.username,
   //          retrievedNotes: dbRes.notesArray,
   //          retrievedEmail: dbRes.email

   //    } 
   //    }else if(!dbRes){
   //    console.log("null case")
   //       responseData = {
   //          email: "",
   //          enteredPassword: "",
   //          retrievedUsername: "",
   //          authenticated: false,
   //    retrievedNotes: [{title: "u r not logged in", content: "sorry dude, I'll redirect you......."}]
   //       }
   
   //    }
      
      //})
      //.then(()=>{ //needs to be async to wait for query results so it doesn't res.json undefined.
//       console.log("responseData is set as: ")
//       console.log(responseData)
// res.json(responseData)
   //})
   //})
   //
// if(enteredCredentials.email == "bob@gmail.com" && enteredCredentials.password =="bobpassword"){
//    let responseData = {
//       ...enteredCredentials,
//       authenticated: true,
//       username: "Bob",
//       retrievedNotes:[
//          {
//             title: "Bob's first Note",
//             content: "Fun fact- Bob is a convicted felon"
//          },
//          {
//             title: "A second note",
//             content: "These notes are unique to bob!"
//          },
//          {
//             title: "Note 3",
//             content: "Now I just use Mongoose to create a user schema.."
//          },
//          {
//             title: "Final Note-",
//             content: "...And then anyone can be just like Bob!"
//          }
//       ]
//    }
//    res.json(responseData)
// }else{
//    let responseData = {
//       ...enteredCredentials,
//       authenticated: false,
//       retrievedNotes: [{title: "u r not logged in", content: "sorry dude, I'll redirect you......."}]
//    }
//    res.json(responseData)
// }

  
   
// })

// app.get("/api/reroute",(req,res)=>{
//    res.redirect("/")
// })
//MAIN APP GET/POST
app.get("/api/practiceNotes", (req, res) => { //REQ to client for res (notes arr)
   console.log("req.params object is:")
 console.log(req.headers.email) //use req.headers containing an OBJECT with email as VALUE instead of data or params
//  console.log(req)
 let emailQuery = req.headers.email
UserModel.findOne({email:{$regex:emailQuery}}, (err, userDoc) => { //_v:0 is a second search param meaning versionKey=0 i.e, first version of document. Not necessary but good practice with complex collections
      // find ALL, and put them all into an array before sending back
      if (!err) {
         console.log("GET req:")
         console.log(userDoc) 
         // res.json([])
      } else {
         console.log(err)
         // res.json([])
         // res.status(400).json({"error": err}); //sends error to client also
      }
   })
   .then((userDoc)=>{ //.thenable, so we reference the returned userDoc from mongoose query
      console.log("user doc returned: ")
      console.log(userDoc)
      console.log("notesArray value returned for user: ")
      console.log(userDoc.notesArray)
      res.json(userDoc.notesArray) //sometimes returns undefined, causing app crash
               //let's put this res.json OUTSIDE the conditional with a 
         // .then promise, to make sure we get a value before axios response
   })
})

app.post("/api/addNotes",(req, res) => {
  
   console.log("req.body is:")
   console.log(req.body)
   let notes = req.body.notes //this is an array of objects. This is correct
   console.log("notes variable set as")
   console.log(notes)
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
  .then((userDoc)=>{ //userDoc IS the result of successful query.
     console.log("userDoc returned from post req query to db is:")
     console.log(userDoc)
     console.log("Before save()")
   console.log(userDoc)
   userDoc.notesArray = notes
    userDoc.save() //const  user = the returned query value. Bc findOne is .thenable, 
    //Need to make sure we refer to UserModel constructor here. 
    console.log("AFTER user.save() update (should have updated notes array)")
    console.log(userDoc)
    res.json("Your notes have updated successfully!")
  })
  .catch((err)=>{
     console.log(err)
     res.json(err)
   })
 
  })


// app.post("/api/addNotes",(req, res) => {
  
//    console.log("req.body is:")
//    console.log(req.body)
//    let notes = req.body //this is an array of objects. This is correct
//   PracticeModel.deleteMany({},(err,data)=>{
//      err && console.log(err)
//   })
//   .then(function(){
//    let updated = new PracticeModel({
//       allNotes: notes
//    })
//    console.log("updated:")
//    console.log(updated)
//    updated.save()

//   })
 
//   })


//END Practice Requests

 
app.listen(PORT, () => {
   console.log(app.get("env").toUpperCase() + " Server started on port " + (PORT));
});