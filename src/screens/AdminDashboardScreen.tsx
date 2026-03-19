import { View, Text, Button, StyleSheet } from "react-native";
import { useAuthStore } from "../store/auth.store";
import { useNavigation } from "@react-navigation/native";

export default function AdminDashboardScreen() {
  const logout = useAuthStore((s) => s.logout);
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panel Administrativo</Text>

      <Button
        title="Ver Proyectos"
        onPress={() => navigation.navigate("Projects")}
      />
      <Button
        title="Work Logs"
        onPress={() => navigation.navigate("WorkLogs")}
      />

      <View style={{ marginTop: 20 }}>
        <Button title="Cerrar sesión" onPress={logout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: "600",
  },
});
