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
import { supabase } from "../lib/supabase";
import useTodoStore from "../store/useTodoStore";
import useThemeStore, { getThemeColors } from "../store/useThemeStore";

export default function TodoScreen({ navigation }) {
  const [text, setText] = useState("");
  const { todos, setUserId, fetchTodos, addTodo, toggleTodo, removeTodo } =
    useTodoStore();
  const { isDark, toggleTheme } = useThemeStore();
  const colors = getThemeColors(isDark);

  const remainingCount = todos.filter((t) => !t.done).length;

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        navigation.replace("Login");
        return;
      }
      setUserId(user.id);
      await fetchTodos();
    })();
  }, []);

  function handleAdd() {
    if (!text.trim()) return;
    addTodo(text);
    setText("");
  }

  function handleToggle(id) {
    toggleTodo(id);
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
    await supabase.auth.signOut();
    navigation.replace("Login");
  }

  function renderItem({ item }) {
    return (
      <View style={[styles.todoCard, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          style={styles.todoContent}
          onPress={() => handleToggle(item.id)}
        >
          <View
            style={[
              styles.checkbox,
              { borderColor: colors.border },
              item.done && { backgroundColor: colors.headerBg, borderColor: colors.headerBg },
            ]}
          >
            {item.done && <Feather name="check" size={14} color="#fff" />}
          </View>
          <Text
            style={[
              styles.todoText,
              { color: colors.text },
              item.done && { textDecorationLine: "line-through", color: colors.textSec },
            ]}
          >
            {item.text}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleRemove(item.id)}
        >
          <Feather name="trash-2" size={16} color="#ef4444" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <View style={styles.headerLeft}>
          <Feather name="check-circle" size={22} color="#fff" />
          <Text style={styles.headerTitle}>To-Do List</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.themeBtn}
            onPress={toggleTheme}
          >
            <Feather
              name={isDark ? "sun" : "moon"}
              size={18}
              color="#fff"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Feather name="log-out" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.remainingBar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.remainingText, { color: colors.textSec }]}>
          {remainingCount} tersisa
        </Text>
      </View>

      <View style={[styles.inputRow, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TextInput
          style={[styles.input, { color: colors.text, backgroundColor: colors.inputBg, borderColor: colors.border }]}
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
        <View style={styles.emptyContainer}>
          <Feather name="clipboard" size={64} color={colors.border} />
          <Text style={[styles.emptyText, { color: colors.textSec }]}>
            Belum ada todo
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.placeholder }]}>
            Ketik di atas dan tekan + untuk menambah
          </Text>
        </View>
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
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  themeBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 10,
    borderRadius: 10,
  },
  logoutBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 10,
    borderRadius: 10,
  },
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
    backgroundColor: "#fee2e2",
    padding: 8,
    borderRadius: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  emptyText: { fontSize: 18, fontWeight: "600" },
  emptySubtext: { fontSize: 14 },
});
