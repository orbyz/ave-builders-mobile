import { View, Text, StyleSheet } from "react-native";

interface Props {
  label: string;
  value: number;
  color: string;
}

export default function KpiCard({ label, value, color }: Props) {
  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color }]}>€{value.toLocaleString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 14,
    marginBottom: 16,
    borderLeftWidth: 6,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    color: "#777",
    marginBottom: 6,
  },
  value: {
    fontSize: 20,
    fontWeight: "600",
  },
});
