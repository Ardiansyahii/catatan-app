import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import useAuth from "../src/hooks/useAuth";
import useTodos from "../src/hooks/useTodos";
import useThemeStore, { getThemeColors } from "../src/store/useThemeStore";
import ScreenHeader from "../src/components/ScreenHeader";
import EmptyState from "../src/components/EmptyState";

export default function TodoScreen({ navigation }) {
  const { isDark, toggleTheme } = useThemeStore();
  const colors = getThemeColors(isDark);
  const { user, checkAuth, logout } = useAuth(navigation);
  const { todos, remainingCount, addTodo, toggleTodo, removeTodo } =
    useTodos(user?.id);
  const [text, setText] = useState("");

  useEffect(() => {
    checkAuth();
  }, []);

  function handleAdd() {
    if (!text.trim()) return;
    addTodo(text);
    setText("");
  }

  function handleRemove(id) {
    const doRemove = () => removeTodo(id);

    if (Platform.OS === "web") {
      if (window.confirm("Yakin ingin hapus todo ini?")) doRemove();
    } else {
      Alert.alert("Hapus Todo", "Yakin ingin hapus?", [
        { text: "Batal", style: "cancel" },
        { text: "Hapus", style: "destructive", onPress: doRemove },
      ]);
    }
  }

  async function handleLogout() {
    await logout();
    navigation.replace("Login");
  }

  function renderItem({ item }) {
    return (
      <View style={[styles.todoCard, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          style={styles.todoContent}
          onPress={() => toggleTodo(item.id)}
        >
          <View
            style={[
              styles.checkbox,
              { borderColor: colors.border },
              item.done && {
                backgroundColor: colors.headerBg,
                borderColor: colors.headerBg,
              },
            ]}
          >
            {item.done && <Feather name="check" size={14} color="#fff" />}
          </View>
          <Text
            style={[
              styles.todoText,
              { color: colors.text },
              item.done && {
                textDecorationLine: "line-through",
                color: colors.textSec,
              },
            ]}
          >
            {item.text}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.deleteBtn, { backgroundColor: "#fee2e2" }]}
          onPress={() => handleRemove(item.id)}
        >
          <Feather name="trash-2" size={16} color="#ef4444" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScreenHeader
        title="To-Do List"
        icon="check-circle"
        rightActions={
          <>
            <TouchableOpacity style={[styles.themeBtn, { backgroundColor: "rgba(255,255,255,0.2)" }]} onPress={toggleTheme}>
              <Feather name={isDark ? "sun" : "moon"} size={18} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.logoutBtn, { backgroundColor: "rgba(255,255,255,0.2)" }]}
              onPress={handleLogout}
            >
              <Feather name="log-out" size={18} color="#fff" />
            </TouchableOpacity>
          </>
        }
      />

      <View
        style={[
          styles.remainingBar,
          { backgroundColor: colors.card, borderBottomColor: colors.border },
        ]}
      >
        <Text style={[styles.remainingText, { color: colors.textSec }]}>
          {remainingCount} tersisa
        </Text>
      </View>

      <View
        style={[
          styles.inputRow,
          { backgroundColor: colors.card, borderBottomColor: colors.border },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              backgroundColor: colors.inputBg,
              borderColor: colors.border,
            },
          ]}
          placeholder="Tambah todo baru..."
          placeholderTextColor={colors.placeholder}
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
        />
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: colors.headerBg }]}
          onPress={handleAdd}
        >
          <Feather name="plus" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {todos.length === 0 ? (
        <EmptyState
          icon="clipboard"
          title="Belum ada todo"
          subtitle="Ketik di atas dan tekan + untuk menambah"
        />
      ) : (
        <FlatList
          data={todos}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  remainingBar: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  remainingText: { fontSize: 14, fontWeight: "600" },
  inputRow: {
    flexDirection: "row",
    padding: 16,
    gap: 10,
    borderBottomWidth: 1,
  },
  input: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
  },
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  list: { padding: 16 },
  todoCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  todoContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  todoText: { fontSize: 15, flex: 1 },
  deleteBtn: {
    padding: 8,
    borderRadius: 8,
  },
  themeBtn: { padding: 10, borderRadius: 10 },
  logoutBtn: { padding: 10, borderRadius: 10 },
});
