export const lightColors = {
  bg: "#f1f5f9",
  card: "#ffffff",
  text: "#1e293b",
  textSec: "#64748b",
  border: "#e2e8f0",
  inputBg: "#f8fafc",
  placeholder: "#9ca3af",
  headerBg: "#2563eb",
};

export const darkColors = {
  bg: "#0f172a",
  card: "#1e293b",
  text: "#f1f5f9",
  textSec: "#94a3b8",
  border: "#334155",
  inputBg: "#1e293b",
  placeholder: "#64748b",
  headerBg: "#1e40af",
};

export const accent = {
  danger: "#ef4444",
  dangerBg: "#fee2e2",
  white: "#fff",
  black: "#000",
  shadow: "rgba(0,0,0,0.06)",
  shadowHeavy: "rgba(0,0,0,0.35)",
  modalOverlay: "rgba(0,0,0,0.5)",
  headerBtnBg: "rgba(255,255,255,0.2)",
};

export function getThemeColors(isDark) {
  return isDark ? darkColors : lightColors;
}
