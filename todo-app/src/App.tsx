import { useState } from 'react'
import './App.css'
import { Button, TextField, List, ListItem } from '@mui/material'

function App() {
const [inputValue , setInputValue]=useState('');
const [list, setList]=useState<string[]>([]);
const addToList = () => {
  if(inputValue.trim()){
    setList([...list,inputValue]);
    setInputValue('');
  }
}
  return (

    <>
      <h1>Todo App</h1>
      <TextField variant="outlined" label='Todo' value={inputValue} onChange={(e)=>setInputValue(e.target.value)}></TextField>
      <div className="card">
        <Button variant="contained" color="primary" onClick={addToList}>
          Add to list
        </Button>
      </div>

      <List sx={{width:'100%'}}>
        {list.map((item, index) => (
          <ListItem key={index}>{item}</ListItem>
        ))}
      </List>
    </>
  )
}

export default App
