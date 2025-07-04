import { useEffect, useRef, useState } from 'react';
import './App.css';
import { Button, TextField, List, ListItem } from '@mui/material';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [list, setList] = useState<string[]>([]);
  const hasMounted = useRef(false); 

  const addToList = () => {
    if (inputValue.trim()) {
      setList([...list, inputValue]);
      setInputValue('');
    }
  };

  useEffect(() => {
    const storedList = localStorage.getItem('todoList');
    if (storedList) {
      setList(JSON.parse(storedList));
    }
  }, []);


  useEffect(() => {
    if (hasMounted.current) {
      localStorage.setItem('todoList', JSON.stringify(list));
    } else {
      hasMounted.current = true;
    }
  }, [list]);

  return (
    <>
      <h1>Todo App</h1>
      <TextField
        variant="outlined"
        label="Todo"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <div className="card">
        <Button variant="contained" color="primary" onClick={addToList}>
          Add to list
        </Button>
      </div>

      <List sx={{ width: '100%' }}>
        {list.map((item, index) => (
          <ListItem key={index}>{item}</ListItem>
        ))}
      </List>
    </>
  );
}

export default App;
