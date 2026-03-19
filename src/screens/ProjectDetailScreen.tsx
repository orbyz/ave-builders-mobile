import { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import { getProjectDetail } from "../api/project.api";
import { RouteProp, useRoute } from "@react-navigation/native";
import { AdminStackParamList } from "../navigation/AdminStack";
import KpiCard from "../components/KpiCard";
import InvoiceList from "../components/InvoiceList";
import { toggleInvoiceStatus } from "../api/project.api";

export default function ProjectDetailScreen() {
  type RouteType = RouteProp<AdminStackParamList, "ProjectDetail">;
  const route = useRoute<RouteType>();
  const { id } = route.params;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      try {
        const result = await getProjectDetail(id);
        setData(result);
      } catch (err) {
        console.log("DETAIL ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading || !data) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const { project, finance } = data;

  const totalCost = finance.totalExpenses + finance.labourCost;
  const hasRisk =
    finance.realProfit < 0 ||
    finance.marginPercentage === null ||
    (finance.marginPercentage !== null && finance.marginPercentage < 5);
  const profitColor = finance.realProfit >= 0 ? "#1e8e3e" : "#d93025";
  const handleToggle = async (invoiceId: string, current: string) => {
    try {
      await toggleInvoiceStatus(invoiceId, current);

      // 🔄 Recalcular todo desde backend
      const updated = await getProjectDetail(id);
      setData(updated);
    } catch (err) {
      console.log("TOGGLE ERROR:", err);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{project.name}</Text>

      {/* INGRESOS Y COSTES */}
      <View style={styles.section}>
        <KpiCard
          label="Facturado"
          value={finance.totalIncome}
          color="#1e8e3e"
        />
        <KpiCard
          label="Gastos Facturas"
          value={finance.totalExpenses}
          color="#d93025"
        />
        <KpiCard
          label="Mano de Obra"
          value={finance.labourCost}
          color="#8e24aa"
        />
        <KpiCard label="Coste Total" value={totalCost} color="#ff6f00" />
      </View>

      {/* RESULTADO */}
      <View style={styles.resultContainer}>
        <Text style={styles.resultLabel}>Beneficio Real</Text>
        <Text
          style={[
            styles.resultValue,
            { color: finance.realProfit >= 0 ? "#1e8e3e" : "#d93025" },
          ]}
        >
          €{finance.realProfit.toLocaleString()}
        </Text>

        <Text style={styles.margin}>
          {finance.marginPercentage !== null
            ? `Margen: ${finance.marginPercentage.toFixed(1)}%`
            : "Sin facturación"}
        </Text>

        {hasRisk && (
          <Text style={styles.risk}>⚠ Proyecto en riesgo financiero</Text>
        )}
      </View>
      <InvoiceList invoices={data.invoices || []} onToggle={handleToggle} />
    </ScrollView>
  );
}
console.log(process.env.EXPO_PUBLIC_API_URL);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f6fa",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  half: {
    flex: 1,
  },
  profitContainer: {
    marginTop: 24,
    backgroundColor: "#fff",
    padding: 22,
    borderRadius: 16,
    elevation: 4,
  },
  profitLabel: {
    fontSize: 16,
    color: "#666",
  },
  profitValue: {
    fontSize: 26,
    fontWeight: "700",
    marginTop: 4,
  },
  margin: {
    fontSize: 14,
    color: "#888",
    marginTop: 6,
  },
  alert: {
    marginTop: 16,
    color: "#d93025",
    fontWeight: "600",
  },
  section: {
    gap: 12,
    marginBottom: 30,
  },
  resultContainer: {
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 18,
    elevation: 4,
  },
  resultLabel: {
    fontSize: 16,
    color: "#666",
  },
  resultValue: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 6,
  },
  risk: {
    marginTop: 12,
    color: "#d93025",
    fontWeight: "600",
  },
});
