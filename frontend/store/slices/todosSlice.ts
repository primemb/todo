import { ITodo } from "@/interfaces/ITodo";
import { arrayMove } from "@dnd-kit/sortable";
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  Dispatch,
} from "@reduxjs/toolkit";
import axios from "axios";

interface TodosState {
  todos: ITodo[];
  previousTodos: ITodo[];
  loading: boolean;
  error: string | null;
}

const initialState: TodosState = {
  todos: [],
  previousTodos: [],
  loading: false,
  error: null,
};

// API endpoint (you can replace this with your actual API)
const API_URL = `${process.env.NEXT_PUBLIC_API}/todo`;

// Async thunk for fetching todos
export const fetchTodos = createAsyncThunk("todos/fetchTodos", async () => {
  const response = await axios.get<ITodo[]>(`${API_URL}`);
  return response.data;
});

// Async thunk for adding a new todo
export const addTodo = createAsyncThunk(
  "todos/addTodo",
  async (text: string) => {
    const newTodo = {
      title: text,
      completed: false,
    };
    const response = await axios.post<ITodo>(API_URL, newTodo);
    return response.data;
  }
);

// Async thunk for updating a todo
export const updateTodo = createAsyncThunk(
  "todos/updateTodo",
  async (todo: ITodo) => {
    const response = await axios.put<ITodo>(`${API_URL}/${todo._id}`, todo);
    return response.data;
  }
);

// Async thunk for deleting a todo
export const deleteTodo = createAsyncThunk(
  "todos/deleteTodo",
  async (id: string) => {
    await axios.delete(`${API_URL}/${id}`);
    return id;
  }
);

// Async thunk for updating the position of a todo
export const updatePosition = createAsyncThunk<
  void,
  { oldIndex: number; newIndex: number },
  { state: { todos: TodosState }; dispatch: Dispatch }
>(
  "todos/updatePosition",
  async ({ oldIndex, newIndex }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as {
        todos: {
          previousTodos: ITodo[];
        };
      };

      const tempTodos = [...state.todos.previousTodos];
      // Reorder the todos
      const reOrder = arrayMove(tempTodos, oldIndex, newIndex);
      const ids = reOrder.map((todo) => todo._id);
      await axios.put(`${API_URL}/reorder`, { ids });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Todos
    builder.addCase(fetchTodos.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchTodos.fulfilled,
      (state, action: PayloadAction<ITodo[]>) => {
        state.loading = false;
        state.todos = action.payload;
      }
    );
    builder.addCase(fetchTodos.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch todos";
    });

    // Add Todo
    builder.addCase(
      addTodo.fulfilled,
      (state, action: PayloadAction<ITodo>) => {
        state.todos.push(action.payload);
      }
    );

    // Update Todo
    builder.addCase(
      updateTodo.fulfilled,
      (state, action: PayloadAction<ITodo>) => {
        const index = state.todos.findIndex(
          (todo) => todo._id === action.payload._id
        );
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
      }
    );

    // Delete Todo
    builder.addCase(
      deleteTodo.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.todos = state.todos.filter((todo) => todo._id !== action.payload);
      }
    );

    builder.addCase(updatePosition.pending, (state, action) => {
      const { oldIndex, newIndex } = action.meta.arg;
      state.previousTodos = state.todos.slice();
      state.todos = arrayMove(state.todos, oldIndex, newIndex);
    });

    builder.addCase(updatePosition.rejected, (state, action) => {
      // Restore the previous state
      state.todos = state.previousTodos;
      state.error = action.payload as string;
    });
  },
});

export default todosSlice.reducer;
