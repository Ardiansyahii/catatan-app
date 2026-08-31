import { useState, useEffect } from "react";
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
import useAuth from "../src/hooks/useAuth";
import useNotes from "../src/hooks/useNotes";
import useThemeStore, { getThemeColors } from "../src/store/useThemeStore";
import ScreenHeader from "../src/components/ScreenHeader";
import EmptyState from "../src/components/EmptyState";

export default function NotesScreen({ navigation }) {
  const { isDark } = useThemeStore();
  const colors = getThemeColors(isDark);
  const { user, checkAuth } = useAuth(navigation);
  const { notes, loading, addNote, updateNote, deleteNote } = useNotes(user?.id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

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
      const { error } = await updateNote(editingNote.id, title, content);
      if (error) Alert.alert("Error", error.message);
    } else {
      const { error } = await addNote(title, content);
      if (error) Alert.alert("Error", error.message);
    }

    setModalVisible(false);
    setTitle("");
    setContent("");
    setEditingNote(null);
  }

  function handleDelete(id) {
    const doRemove = () => deleteNote(id);

    if (Platform.OS === "web") {
      if (window.confirm("Yakin ingin hapus catatan ini?")) doRemove();
    } else {
      Alert.alert("Hapus Catatan", "Yakin ingin hapus?", [
        { text: "Batal", style: "cancel" },
        { text: "Hapus", style: "destructive", onPress: doRemove },
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
          <Text
            style={[styles.noteText, { color: colors.textSec }]}
            numberOfLines={2}
          >
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
      <ScreenHeader title="Catatan Saya" icon="file-text" />

      {notes.length === 0 ? (
        <EmptyState
          icon="file-text"
          title="Belum ada catatan"
          subtitle="Tekan tombol + untuk menambah catatan"
        />
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
              <Text style={[styles.label, { color: colors.text }]}>
                Isi Catatan
              </Text>
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
  noteTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  noteText: { fontSize: 14, marginBottom: 8 },
  noteDate: { fontSize: 12 },
  noteActions: { flexDirection: "column", gap: 8, marginLeft: 12 },
  editBtn: { padding: 8, borderRadius: 8, alignItems: "center" },
  deleteBtn: { padding: 8, borderRadius: 8, alignItems: "center" },
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
  label: { fontSize: 13, fontWeight: "600", marginBottom: 6, marginLeft: 4 },
  modalInput: { borderWidth: 1.5, borderRadius: 12, padding: 14, fontSize: 15 },
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
