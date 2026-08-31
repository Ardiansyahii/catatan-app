import { useState, useEffect, useCallback } from "react";
import * as todoService from "../services/todoService";

export default function useTodos(userId) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTodos = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data } = await todoService.fetchTodos(userId);
    setTodos(data);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  async function addTodo(text) {
    if (!text.trim() || !userId) return;

    const { data, error } = await todoService.addTodo(userId, text.trim());
    if (!error && data) {
      setTodos((prev) => [data, ...prev]);
    }
  }

  async function toggleTodo(id) {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const newDone = !todo.done;
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: newDone } : t))
    );

    await todoService.toggleTodo(id, newDone);
  }

  async function removeTodo(id) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    await todoService.removeTodo(id);
  }

  const remainingCount = todos.filter((t) => !t.done).length;

  return { todos, loading, remainingCount, addTodo, toggleTodo, removeTodo };
}
