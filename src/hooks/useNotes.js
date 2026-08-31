import { useState, useEffect, useCallback } from "react";
import * as noteService from "../services/noteService";

export default function useNotes(userId) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotes = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data } = await noteService.fetchNotes(userId);
    setNotes(data);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  async function addNote(title, content) {
    if (!title.trim() || !userId) return;

    const { data, error } = await noteService.addNote(
      userId,
      title.trim(),
      content.trim()
    );
    if (!error && data) {
      setNotes((prev) => [data, ...prev]);
    }
    return { error };
  }

  async function updateNote(id, title, content) {
    const { error } = await noteService.updateNote(
      id,
      title.trim(),
      content.trim()
    );
    if (!error) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, title: title.trim(), content: content.trim() } : n
        )
      );
    }
    return { error };
  }

  async function deleteNote(id) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    await noteService.deleteNote(id);
  }

  return { notes, loading, addNote, updateNote, deleteNote };
}
