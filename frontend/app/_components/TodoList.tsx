"use client";

import React, { useEffect } from "react";
import { CircularProgress, Container, List, Typography } from "@mui/material";
import TodoInput from "./TodoInput";
import TodoItem from "./TodoItem";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchTodos, updatePosition } from "@/store/slices/todosSlice";

const TodoList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { todos, loading, error } = useAppSelector((state) => state.todos);

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = todos.findIndex((todo) => todo._id === active.id);
      const newIndex = todos.findIndex((todo) => todo._id === over?.id);
      dispatch(updatePosition({ oldIndex, newIndex }));

      // Here you might want to update the order in the backend as well
      // For simplicity, we're just updating the local state
    }
  };

  if (loading) {
    return (
      <Container
        maxWidth="sm"
        sx={{ mt: 5, display: "flex", justifyContent: "center" }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 5,
        p: 3,
        backgroundColor: "#fafafa",
        borderRadius: "8px",
        boxShadow: 3,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom align="center">
        My Todo List
      </Typography>
      <TodoInput />
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={todos.map((todo) => todo._id)}
          strategy={verticalListSortingStrategy}
        >
          <List>
            {todos.map((todo) => (
              <TodoItem key={todo._id} todo={todo} />
            ))}
          </List>
        </SortableContext>
      </DndContext>
    </Container>
  );
};

export default TodoList;
