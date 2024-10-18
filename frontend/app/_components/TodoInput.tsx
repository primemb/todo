import React, { useState, KeyboardEvent, ChangeEvent } from "react";
import { TextField, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useAppDispatch } from "@/store/hooks";
import { addTodo } from "@/store/slices/todosSlice";

const TodoInput: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const dispatch = useAppDispatch();

  const handleAddTodo = () => {
    if (inputValue.trim() !== "") {
      dispatch(addTodo(inputValue.trim()));
      setInputValue("");
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddTodo();
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <TextField
      fullWidth
      variant="outlined"
      label="Add a new task"
      value={inputValue}
      onChange={handleInputChange}
      onKeyUp={handleKeyPress}
      InputProps={{
        endAdornment: (
          <IconButton color="primary" onClick={handleAddTodo}>
            <AddIcon />
          </IconButton>
        ),
      }}
      sx={{ mb: 2 }}
    />
  );
};

export default TodoInput;
