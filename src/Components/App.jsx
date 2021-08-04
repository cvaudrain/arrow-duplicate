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
  const [selectedNote, setSelectedNote] = useState({
    selectedTitle: "",
    selectedContent: ""
  })
 
  const[notes,setNotes] = useState([]) 

 
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

  
//called when note is clicked
function editNote(id,title,content){
  
    console.log(title)
    console.log(content)
    console.log(id)
    setSelectedNote((previousValue)=>{
      return {
      selectedTitle: title,
      selectedContent: content
    }
  }
    )
    console.log(selectedNote) 
    setEditModeStatus(true)
     
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

function conditionalRender(){
  if(editModeStatus){
    console.log("edit mode switched on")
    return <div>
    <Header
      headerText="Edit Note"
    />
    <NoteEditor 
    context={selectedNote}
    populateTitle={selectedNote.selectedTitle}
    populateContent={selectedNote.selectedContent}
  />
  </div>
  }else{
return <div>
<Header 
  headerText="React Notes"
/>
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
  }
}

return conditionalRender()

}

export default App;
