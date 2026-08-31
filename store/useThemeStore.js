import { create } from "zustand";

const useThemeStore = create((set) => ({
  isDark: false,
  toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
}));

const lightColors = {
  bg: "#f1f5f9",
  card: "#ffffff",
  text: "#1e293b",
  textSec: "#64748b",
  border: "#e2e8f0",
  inputBg: "#f8fafc",
  placeholder: "#9ca3af",
  headerBg: "#2563eb",
};

const darkColors = {
  bg: "#0f172a",
  card: "#1e293b",
  text: "#f1f5f9",
  textSec: "#94a3b8",
  border: "#334155",
  inputBg: "#1e293b",
  placeholder: "#64748b",
  headerBg: "#1e40af",
};

export function getThemeColors(isDark) {
  return isDark ? darkColors : lightColors;
}

export default useThemeStore;
