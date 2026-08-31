import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { getThemeColors } from "../constants/colors";
import useThemeStore from "../store/useThemeStore";

export default function ScreenHeader({ title, icon, rightActions }) {
  const { isDark } = useThemeStore();
  const colors = getThemeColors(isDark);

  return (
    <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
      <View style={styles.headerLeft}>
        <Feather name={icon} size={22} color="#fff" />
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
      {rightActions && <View style={styles.headerRight}>{rightActions}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
