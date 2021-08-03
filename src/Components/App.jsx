import React, {useState, useContext} from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import NoteEditor from "./NoteEditor"

//Alternatively, you could make this an anonymous function INSIDE th App() component


function App() {
  //State Declarations
 

  const[notes,setNotes] = useState([]) 
  
  // LOOK HERE...try something with this. Call setEditedNote to equal chnaged input values
const [editedNote, setEditedNote] = useState({
  editedId: "",
  editedTitle: "",
  editedContent: "",
})
 
  function addNote(newNote){
    console.log("test")
  setNotes(prevNotes=>{
    return [...prevNotes, newNote]
  });
  }

  function deleteNote(id){
 setNotes(prevNotes=>{
   return prevNotes.filter((noteItem,index)=>{
     return index !== id
   })
  })
  }

  
//title and content are mixed up- event causes title to become content value, and old title deletes....
  //EXPORT title and content- then IMPORT into NoteEditor.jsx. The nyou can set those values in
  //NoteEditor function, set props, 
function editNote(id,title,content){
    console.log(title)
    console.log(content)
    console.log(id)
    setEditedNote(()=>{
      return {
        editedId:id,
        editedTitle: title,
        editedContent: content
      }
    })
    
    console.log(editedNote)
    
    //add a prop to CreateArea component that you canreference/set state HERE-
    //i.e props.CreateAreaTitle and props.CreateAreaContent that you can set 
    //to equal the title and content that you are logging here.
    //THEN you can set state on those
    //OR you can try making the format of the rendered notes notes be an input and texarea just
    //like the CteateNote component. Then you may be able to use contentEditable
    //and THEREFORE the logged values for title and content WOULD update dynamically
    //if the 
  }
  function editComplete(edited){
    console.log(edited)
    setNotes(prevNotes =>{
     notes.map(function(entry,index){
if(index === edited.id){
notes[index] = entry
}
      })

    })
  }
//Functional Components rendering
  return (
    <div>
      <Header />
      <CreateArea 
      onAdd={addNote}
       /> 
      {notes.map((noteItem,index)=>{
        return <Note 
        key={index}
        id={index}
        title={noteItem.title}
         content={noteItem.content}
         onDelete={deleteNote}
         onEdit={editNote}
         />
      })
      }
      <Footer />
    </div>
  );
}

export default App;
