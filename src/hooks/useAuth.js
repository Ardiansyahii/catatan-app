import { useState, useEffect } from "react";
import * as authService from "../services/authService";

export default function useAuth(navigation) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  async function checkAuth() {
    const currentUser = await authService.getUser();
    if (currentUser) {
      setUser(currentUser);
    } else if (navigation) {
      navigation.replace("Login");
    }
    return currentUser;
  }

  async function register(name, email, password) {
    setLoading(true);
    const { data, error } = await authService.signUp(email, password, name);
    setLoading(false);

    if (error) return { error };
    if (data.user && !data.session) {
      return { needsLogin: true };
    }
    setUser(data.user);
    return { success: true };
  }

  async function login(email, password) {
    setLoading(true);
    const { error } = await authService.signIn(email, password);
    setLoading(false);

    if (error) return { error };

    const currentUser = await authService.getUser();
    setUser(currentUser);
    return { success: true };
  }

  async function logout() {
    await authService.signOut();
    setUser(null);
  }

  return { user, loading, checkAuth, register, login, logout };
}
