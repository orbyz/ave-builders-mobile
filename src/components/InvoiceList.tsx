import { View, Text, StyleSheet } from "react-native";

interface Invoice {
  _id: string;
  concept: string;
  amount: number;
  type: "income" | "expense";
  status: "paid" | "pending";
  dueDate?: string;
}

export default function InvoiceList({
  invoices,
  onToggle,
}: {
  invoices: Invoice[];
  onToggle: (id: string, current: string) => void;
}) {
  if (!invoices.length) {
    return <Text style={styles.empty}>No hay facturas registradas.</Text>;
  }

  return (
    <View style={styles.container}>
      {invoices.map((inv) => {
        const color = inv.type === "income" ? "#1e8e3e" : "#d93025";

        return (
          <View key={inv._id} style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.concept}>{inv.concept}</Text>
              <Text style={[styles.amount, { color }]}>
                €{inv.amount.toLocaleString()}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.meta}>
                {inv.type === "income" ? "Ingreso" : "Gasto"}
              </Text>
              <Text
                style={[
                  styles.meta,
                  {
                    color: inv.status === "paid" ? "#1e8e3e" : "#f9a825",
                  },
                ]}
              >
                {inv.status === "paid" ? "Pagado" : "Pendiente"}
              </Text>
            </View>
            <Text
              style={styles.toggle}
              onPress={() => onToggle(inv._id, inv.status)}
            >
              Cambiar estado
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    gap: 12,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 14,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  concept: {
    fontWeight: "600",
    fontSize: 14,
  },
  amount: {
    fontWeight: "700",
  },
  meta: {
    fontSize: 12,
    marginTop: 6,
  },
  empty: {
    marginTop: 20,
    color: "#666",
  },
  toggle: {
    marginTop: 8,
    fontSize: 12,
    color: "#1976d2",
    fontWeight: "600",
  },
});
