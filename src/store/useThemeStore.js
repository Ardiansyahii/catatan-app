import { create } from "zustand";
import { getThemeColors } from "../constants/colors";

const useThemeStore = create((set) => ({
  isDark: false,
  toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
}));

export { getThemeColors };
export default useThemeStore;
