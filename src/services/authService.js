import { supabase } from "../../lib/supabase";

export async function signUp(email, password, name) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });
  return { data, error };
}

export async function signIn(email, password) {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { error };
}

export async function getUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function signOut() {
  await supabase.auth.signOut();
}
