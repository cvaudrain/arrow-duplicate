require("dotenv").config();
const express  = require("express");
const mongoose = require("mongoose");
// const cors     = require("cors"); //may need cors to replace proxy in production build
const path     = require("path");
const { response } = require("express");
const app      = express();
 
const PORT     = process.env.PORT || 4747;
const DB_URI   = "mongodb://localhost:27017/"; // recall that mongo runs locally on port 27017 by default
const DB       = "NotesDB";
const PRACTICEDB = "PracticeDB" 
// const serverAddress = "http://localhost:4747/api/notes"
const serverAddress = "http://localhost:4747/api/practiceNotes"
const addNoteAddress = "http://localhost:4747/api/addNotes"
//used full address instead of proxy to launch w/o issue in production build
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors());
 
// Establish DB connection
mongoose.connect(DB_URI + PRACTICEDB, {
   useUnifiedTopology: true,
   useNewUrlParser: true,
   useCreateIndex: true,
   useFindAndModify: false,
   connectTimeoutMS: 10000
});
 
const db = mongoose.connection; //the currently specified db in mongoose.connect()
 db.on("error",(error)=>console.log(error))
// Event listeners
db.once('open', () => console.log(`Connected to ${PRACTICEDB} database`));
 
//PRACTICE requests
let PracticeSchema = new mongoose.Schema(
   {
      cloudId: Number,
      cloudTitle: String,
      cloudNotes: String
   },
   {collection: "practiceCollection"} //THE COLLECTION
)
let PracticeModel = db.model("PracticeModel",PracticeSchema)
//so based on schema, PracticeModel.cloudNotes = [the notes array]

app.get("/api/practiceNotes", (req, res) => { //REQ to client for res (notes arr)
  
PracticeModel.find({}, /*{__v: 0},*/ (err, docs) => { //_v:0 is a second search param meaning versionKey=0 i.e, first version of document. Not necessary but good practice with complex collections
      
      if (!err) {
         console.log(docs)
         res.json(docs.cloudNotes); //DOCS IS THE RETURNED QUERY
      } else {
         res.status(400).json({"error": err});
      }
   });
})

app.post("/api/addNotes",(req, res) => {
   console.log(req.body)
   
let notes = new PracticeModel(req.body); //receive updated array &
   console.log(notes)
              // create new db model for insertion as doc
   notes.save((err, result) => {
      if (!err) { //!false simle query bc this practice only holds one doc
         delete result._doc.__v;
         //res.json(result._doc); //returns array, not entire doc obj
      } else {
         res.status(400).json({"error": err});
      }
   });
})



//END Practice Requests




// Create Schema
let UserSchema = new mongoose.Schema(
   {
      name: String,
      email: String,
      password: String,
      notes: Array
   },
   {collection: "notesUsers"}
//    { collection: "people" }
);
 
// Create Model
let UserModel = db.model("UserModel", UserSchema);
 
// Route to Get all People, responds with all docs from query

// app.get(serverAddress, (req, res) => {
//    UserModel.find({}, {__v: 0}, (err, docs) => {
//       if (!err) {
//          res.json(docs);
//       } else {
//          res.status(400).json({"error": err});
//       }
//    });
// })
 
// Route to Add a Person

// app.post(serverAddress, (req, res) => {
//    let user = new UserModel(req.body);
   
//    user.save((err, result) => {
//       if (!err) {
//          delete result._doc.__v;
//          res.json(result._doc);
//       } else {
//          res.status(400).json({"error": err});
//       }
//    });
// })
 
app.listen(PORT, () => {
   console.log(app.get("env").toUpperCase() + " Server started on port " + (PORT));
});