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

mongoose.connect(process.env.DATABASE_URL + DB, {
   useUnifiedTopology: true,
   useNewUrlParser: true,
   useCreateIndex: true,
   useFindAndModify: false,
   connectTimeoutMS: 10000
});

//local ONLY testing connection to Mongo
// mongoose.connect(process.env.URI_CONNECTION + DB, {
//    useUnifiedTopology: true,
//    useNewUrlParser: true,
//    useCreateIndex: true,
//    useFindAndModify: false,
//    connectTimeoutMS: 10000
// });
 
const db = mongoose.connection; //the currently specified db in mongoose.connect()
 db.on("error",(error)=>{console.log(error)})
// Event listeners
db.once('open', () => console.log(`Connected to ${DB} database`));

const UserSchema = new mongoose.Schema( //1st Schema
   {
      username: String,
      email: String,
      password: String,
      notesArray: Array
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
             
//MAIN APP GET/POST
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
  .then((userDoc)=>{ //userDoc IS the result of successful query.
     
   userDoc.notesArray = notes
    userDoc.save() //const  user = the returned query value. 
    
    res.json("Your notes have updated successfully!")
  })
  .catch((err)=>{
     console.log(err)
     res.json(err)
   })
 
  })

app.listen(PORT, () => {
   console.log(app.get("env").toUpperCase() + " Server started on port " + (PORT));
});