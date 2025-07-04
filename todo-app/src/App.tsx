// Import React hooks and necessary components
import { useEffect, useRef, useState } from 'react';
import './App.css';
import { Button, TextField, List, ListItem } from '@mui/material';

// This is your main App component
function App() {
  // State to store current text input from the user
  const [inputValue, setInputValue] = useState('');

  // State to store the list of to-do items (array of strings)
  const [list, setList] = useState<string[]>([]);

  // useRef is used to track whether the component has already mounted (used to avoid overwriting localStorage on first render)
  const hasMounted = useRef(false);

  // Function to add the current input value to the list
  const addToList = () => {
    if (inputValue.trim()) { // check if input is not empty
      setList([...list, inputValue]); // add new item to list (using spread to keep it immutable)
      setInputValue(''); // clear the input box after adding
    }
  };

  // Load the saved to-do list from localStorage when the component first mounts
  useEffect(() => {
    const storedList = localStorage.getItem('todoList');
    if (storedList) {
      setList(JSON.parse(storedList)); // restore the list from localStorage
    }
  }, []); // empty dependency array = run only once when component mounts

  // Save the list to localStorage whenever it changes (but not on initial load)
  useEffect(() => {
    if (hasMounted.current) {
      // If it's not the first render, save the updated list
      localStorage.setItem('todoList', JSON.stringify(list));
    } else {
      // First render: set the flag to true and skip saving
      hasMounted.current = true;
    }
  }, [list]); // runs whenever the 'list' state changes

  // The JSX you return is what renders on the page
  return (
    <>
      {/* Title of the app */}
      <h1>Todo App</h1>

      {/* Input field for entering a to-do item */}
      <TextField
        variant="outlined"
        label="Todo"
        value={inputValue} // bind to state
        onChange={(e) => setInputValue(e.target.value)} // update state when user types
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            addToList(); // Call addToList when Enter is pressed
          }
        }}
      />

      {/* Button to add item to list */}
      <div className="card">
        <Button variant="contained" color="primary" onClick={addToList}>
          Add to list
        </Button>
      </div>

      {/* Render the list of to-do items */}
      <List sx={{ width: '100%' }}>
        {list.map((item, index) => (
          // key is required for each item in a list (helps React optimize rendering)
          <ListItem key={index}>{item}</ListItem>
        ))}
      </List>
    </>
  );
}

// Export your component so it can be used in index.tsx
export default App;
