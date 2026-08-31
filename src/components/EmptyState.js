import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { getThemeColors } from "../constants/colors";
import useThemeStore from "../store/useThemeStore";

export default function EmptyState({ icon, title, subtitle }) {
  const { isDark } = useThemeStore();
  const colors = getThemeColors(isDark);

  return (
    <View style={styles.emptyContainer}>
      <Feather name={icon} size={64} color={colors.border} />
      <Text style={[styles.emptyText, { color: colors.textSec }]}>{title}</Text>
      <Text style={[styles.emptySubtext, { color: colors.placeholder }]}>
        {subtitle}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  emptyText: { fontSize: 18, fontWeight: "600" },
  emptySubtext: { fontSize: 14 },
});
