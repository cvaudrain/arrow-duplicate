import React, {useState, useContext} from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import noteValue from "./CreateArea";
import NoteEditor from "./NoteEditor";



function App() {
  //State Declarations
 
  const [editModeStatus,setEditModeStatus] = useState(false)
  // const [selectedNote, setSelectedNote] = useState({
  //   selectedTitle: "",
  //   selectedContent: ""
  // })
  const [selectedNoteTitle, setSelectedNoteTitle] = useState("")
  const [selectedNoteContent, setSelectedNoteContent] = useState("")
 const [selectedNoteId, setSelectedNoteId] = useState("")
  const [notes,setNotes] = useState([]) 

 
  function addNote(newNote){
    
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

  
//called when NOTE is clicked- look in <Note /> not NoteEditor
function editNote(id,title,content){
  console.log("editNote called")
    console.log(title) //these ARE logging successfully when editor opens...
    console.log(content)
    console.log(id)
    
    setSelectedNoteTitle(title)
    setSelectedNoteContent(content) //THESE can't set their states. Why?
    setSelectedNoteId(id)
    console.log("selectedNote values are now: ")  //returning blank
    console.log(selectedNoteTitle)
    console.log(selectedNoteContent)
    setEditModeStatus(true)
     
  }
//called when <NotedEditor add button is pressed.
  function editComplete(edited){ //edited here will be 
    console.log(edited) //edited IS logging and shows changes made in editor
    console.log("editComplete called")
    console.log(edited.id) //IS now capturing id value
    setNotes(prevNotes =>{
      let tempNotesArr = prevNotes
      return tempNotesArr.map(function(entry,index){ //NOT UPDATING NOTES STATE SUCCESSFULLY.
if(index === edited.id){
tempNotesArr[index] = edited
}else{
  return entry
}
      })
    })
    setEditModeStatus(false)
    console.log(notes) //THIS IS NOW UPDATING!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  }
//Functional Components rendering



  return <div>

  {editModeStatus &&
  <div>
  <Header
    headerText="Edit Note"
  />
  <NoteEditor 
  // context={selectedNote}
  // populateTitle={selectedNote.selectedTitle}
  // populateContent={selectedNote.selectedContent}
  populateId= {selectedNoteId} //THIS wasn't included before, causing map function to fail.
  populateTitle={selectedNoteTitle}
  populateContent={selectedNoteContent} //THESE are getting pulled from the editedNote state via props from NoteEditor
  onEditSubmit={editComplete} // this calls editComplete, passing in the context from NoteEditor
/>
</div>
  }

{!editModeStatus &&
<div>
<Header 
headerText="React Notes"
/>
<CreateArea 
onAdd={addNote} 
/> 
{notes.map((noteItem,index)=>{
  console.log(notes)
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
}
</div>

}

export default App;
