import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import TodoScreen from "./TodoScreen";
import NotesScreen from "./NotesScreen";
import useThemeStore, { getThemeColors } from "../store/useThemeStore";

const Tab = createBottomTabNavigator();

export default function MainTab() {
  const { isDark } = useThemeStore();
  const colors = getThemeColors(isDark);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.headerBg,
        tabBarInactiveTintColor: colors.placeholder,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tab.Screen
        name="Todo"
        component={TodoScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="check-circle" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Catatan"
        component={NotesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="file-text" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
