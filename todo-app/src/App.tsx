// import { useState } from 'react'
import './App.css'
import { Button, TextField } from '@mui/material'

function App() {

  return (
    <>

      <h1>Todo App</h1>
      <TextField variant="outlined"  label='Todo'></TextField>
      <div className="card">
        <Button variant="contained" color="primary">
          Add to list
        </Button>
      </div>
    </>
  )
}

export default App
