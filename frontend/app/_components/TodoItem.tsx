import {
  ListItem,
  ListItemText,
  IconButton,
  Checkbox,
  Typography,
  ListItemIcon,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ITodo } from "@/interfaces/ITodo";
import { useAppDispatch } from "@/store/hooks";
import { deleteTodo, updateTodo } from "@/store/slices/todosSlice";

interface TodoItemProps {
  todo: ITodo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const dispatch = useAppDispatch();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleToggleComplete = () => {
    dispatch(updateTodo({ ...todo, completed: !todo.completed }));
  };

  const handleDelete = () => {
    dispatch(deleteTodo(todo._id));
  };

  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      {...attributes}
      disablePadding
      secondaryAction={
        <IconButton edge="end" onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      }
    >
      <ListItemIcon {...listeners} sx={{ cursor: "grab" }}>
        <DragIndicatorIcon />
      </ListItemIcon>
      <Checkbox checked={todo.completed} onChange={handleToggleComplete} />
      <ListItemText
        primary={
          <Typography
            variant="body1"
            sx={{
              textDecoration: todo.completed ? "line-through" : "none",
            }}
          >
            {todo.title}
          </Typography>
        }
      />
    </ListItem>
  );
};

export default TodoItem;
