import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Modal,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";
import useThemeStore, { getThemeColors } from "../store/useThemeStore";

export default function NotesScreen({ navigation }) {
  const { isDark } = useThemeStore();
  const colors = getThemeColors(isDark);

  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [userId, setUserId] = useState(null);

  const loadNotes = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      navigation.replace("Login");
      return;
    }
    setUserId(user.id);

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error) setNotes(data);
    setLoading(false);
  }, [navigation]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  function openAddModal() {
    setEditingNote(null);
    setTitle("");
    setContent("");
    setModalVisible(true);
  }

  function openEditModal(note) {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setModalVisible(true);
  }

  async function handleSave() {
    if (!title.trim()) {
      Alert.alert("Error", "Judul wajib diisi");
      return;
    }

    if (editingNote) {
      const { error } = await supabase
        .from("notes")
        .update({ title: title.trim(), content: content.trim() })
        .eq("id", editingNote.id);
      if (error) Alert.alert("Error", error.message);
    } else {
      const { error } = await supabase
        .from("notes")
        .insert({
          title: title.trim(),
          content: content.trim(),
          user_id: userId,
        });
      if (error) Alert.alert("Error", error.message);
    }

    setModalVisible(false);
    setTitle("");
    setContent("");
    setEditingNote(null);
    loadNotes();
  }

  async function handleDelete(id) {
    const confirmAction = async () => {
      const { error } = await supabase.from("notes").delete().eq("id", id);

      if (error) {
        if (Platform.OS === "web") alert("Gagal hapus: " + error.message);
        else Alert.alert("Error", error.message);
      } else {
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
      }
    };

    if (Platform.OS === "web") {
      const confirmDelete = window.confirm("Yakin ingin hapus catatan ini?");
      if (confirmDelete) confirmAction();
    } else {
      Alert.alert("Hapus Catatan", "Yakin ingin hapus?", [
        { text: "Batal", style: "cancel" },
        { text: "Hapus", style: "destructive", onPress: confirmAction },
      ]);
    }
  }

  function renderItem({ item }) {
    return (
      <View style={[styles.noteCard, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          style={styles.noteContent}
          onPress={() => openEditModal(item)}
        >
          <Text style={[styles.noteTitle, { color: colors.text }]}>
            {item.title}
          </Text>
          <Text style={[styles.noteText, { color: colors.textSec }]} numberOfLines={2}>
            {item.content}
          </Text>
          <Text style={[styles.noteDate, { color: colors.placeholder }]}>
            {new Date(item.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </Text>
        </TouchableOpacity>
        <View style={styles.noteActions}>
          <TouchableOpacity
            style={[styles.editBtn, { backgroundColor: colors.headerBg + "20" }]}
            onPress={() => openEditModal(item)}
          >
            <Feather name="edit-2" size={16} color={colors.headerBg} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.deleteBtn, { backgroundColor: "#fee2e2" }]}
            onPress={() => handleDelete(item.id)}
          >
            <Feather name="trash-2" size={16} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.bg }]}>
        <ActivityIndicator size="large" color={colors.headerBg} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <View style={styles.headerLeft}>
          <Feather name="file-text" size={22} color="#fff" />
          <Text style={styles.headerTitle}>Catatan Saya</Text>
        </View>
      </View>

      {notes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="file-text" size={64} color={colors.border} />
          <Text style={[styles.emptyText, { color: colors.textSec }]}>
            Belum ada catatan
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.placeholder }]}>
            Tekan tombol + untuk menambah catatan
          </Text>
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.headerBg }]}
        onPress={openAddModal}
      >
        <Feather name="plus" size={28} color="#fff" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {editingNote ? "Edit Catatan" : "Tambah Catatan"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Feather name="x" size={22} color={colors.textSec} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Judul</Text>
              <TextInput
                style={[
                  styles.modalInput,
                  {
                    color: colors.text,
                    backgroundColor: colors.inputBg,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="Masukkan judul catatan"
                placeholderTextColor={colors.placeholder}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Isi Catatan</Text>
              <TextInput
                style={[
                  styles.modalInput,
                  styles.contentInput,
                  {
                    color: colors.text,
                    backgroundColor: colors.inputBg,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="Tulis catatanmu di sini..."
                placeholderTextColor={colors.placeholder}
                value={content}
                onChangeText={setContent}
                multiline
                textAlignVertical="top"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: colors.border }]}
                onPress={() => setModalVisible(false)}
              >
                <Feather name="x" size={16} color={colors.textSec} />
                <Text style={[styles.cancelBtnText, { color: colors.textSec }]}>
                  Batal
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: colors.headerBg }]}
                onPress={handleSave}
              >
                <Feather name="check" size={16} color="#fff" />
                <Text style={styles.saveBtnText}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  list: { padding: 16 },
  noteCard: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  noteContent: { flex: 1 },
  noteTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  noteText: { fontSize: 14, marginBottom: 8 },
  noteDate: { fontSize: 12 },
  noteActions: {
    flexDirection: "column",
    gap: 8,
    marginLeft: 12,
  },
  editBtn: {
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteBtn: {
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  emptyText: { fontSize: 18, fontWeight: "600" },
  emptySubtext: { fontSize: 14 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold" },
  inputGroup: { marginBottom: 16 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
    marginLeft: 4,
  },
  modalInput: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
  },
  contentInput: { height: 130, textAlignVertical: "top" },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 4,
  },
  modalBtn: {
    flex: 1,
    flexDirection: "row",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  cancelBtnText: { fontWeight: "600" },
  saveBtnText: { color: "#fff", fontWeight: "600" },
});
