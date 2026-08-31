import { supabase } from "../../lib/supabase";

export async function fetchTodos(userId) {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return { data: error ? [] : data, error };
}

export async function addTodo(userId, text) {
  const { data, error } = await supabase
    .from("todos")
    .insert({ text, done: false, user_id: userId })
    .select()
    .single();

  return { data, error };
}

export async function toggleTodo(id, done) {
  const { error } = await supabase
    .from("todos")
    .update({ done })
    .eq("id", id);

  return { error };
}

export async function removeTodo(id) {
  const { error } = await supabase.from("todos").delete().eq("id", id);
  return { error };
}
