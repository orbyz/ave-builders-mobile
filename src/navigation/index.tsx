import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthStore } from "../store/auth.store";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import LoginScreen from "../screens/LoginScreen";
import AdminDashboardScreen from "../screens/AdminDashboardScreen";
import ProjectsScreen from "../screens/ProjectsScreen";
import AdminStack from "./AdminStack";

const Stack = createNativeStackNavigator();

export default function RootNavigation() {
  const { user, loadAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await loadAuth();
      setLoading(false);
    };
    init();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="Admin"
            component={AdminStack}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
