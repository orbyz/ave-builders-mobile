import { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { loginRequest } from "../api/auth.api";
import { useAuthStore } from "../store/auth.store";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const setAuth = useAuthStore((s) => s.setAuth);

  const handleLogin = async () => {
    try {
      setError(null);
      const data = await loginRequest(email, password);
      await setAuth(data.user, data.token);
    } catch (err: any) {
      console.log("LOGIN ERROR FULL:", err);
      console.log("LOGIN ERROR RESPONSE:", err?.response?.data);
      console.log("LOGIN ERROR STATUS:", err?.response?.status);

      setError("Error al iniciar sesión");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AVE Builders</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <Button title="Iniciar Sesión" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 6,
  },
  error: { color: "red", marginBottom: 10 },
});
