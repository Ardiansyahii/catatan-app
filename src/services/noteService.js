import { supabase } from "../../lib/supabase";

export async function fetchNotes(userId) {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return { data: error ? [] : data, error };
}

export async function addNote(userId, title, content) {
  const { data, error } = await supabase
    .from("notes")
    .insert({ title, content, user_id: userId })
    .select()
    .single();

  return { data, error };
}

export async function updateNote(id, title, content) {
  const { error } = await supabase
    .from("notes")
    .update({ title, content })
    .eq("id", id);

  return { error };
}

export async function deleteNote(id) {
  const { error } = await supabase.from("notes").delete().eq("id", id);
  return { error };
}
