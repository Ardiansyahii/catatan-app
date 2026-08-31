import { create } from "zustand";
import { supabase } from "../lib/supabase";

const useTodoStore = create((set, get) => ({
  todos: [],
  userId: null,

  setUserId: (id) => set({ userId: id }),

  fetchTodos: async () => {
    const { userId } = get();
    if (!userId) return;

    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      set({ todos: data });
    }
  },

  addTodo: async (text) => {
    const { userId, todos } = get();
    if (!text.trim()) return;

    if (userId) {
      const { data, error } = await supabase
        .from("todos")
        .insert({ text: text.trim(), done: false, user_id: userId })
        .select()
        .single();

      if (!error && data) {
        set({ todos: [data, ...todos] });
      }
    } else {
      const newTodo = {
        id: Date.now().toString(),
        text: text.trim(),
        done: false,
        created_at: new Date().toISOString(),
      };
      set({ todos: [newTodo, ...todos] });
    }
  },

  toggleTodo: async (id) => {
    const { todos, userId } = get();
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const newDone = !todo.done;
    set({
      todos: todos.map((t) => (t.id === id ? { ...t, done: newDone } : t)),
    });

    if (userId) {
      await supabase.from("todos").update({ done: newDone }).eq("id", id);
    }
  },

  removeTodo: async (id) => {
    const { todos, userId } = get();
    set({ todos: todos.filter((t) => t.id !== id) });

    if (userId) {
      await supabase.from("todos").delete().eq("id", id);
    }
  },

  get remainingCount() {
    return get().todos.filter((t) => !t.done).length;
  },
}));

export default useTodoStore;
