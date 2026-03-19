import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { getWorklogWeeks } from "../api/worklogs.api";
import { useNavigation } from "@react-navigation/native";

export default function WorkLogsScreen() {
  const [weeks, setWeeks] = useState<any[]>([]);
  const navigation = useNavigation<any>();

  useEffect(() => {
    loadWeeks();
  }, []);

  async function loadWeeks() {
    try {
      const data = await getWorklogWeeks();
      setWeeks(data);
    } catch (err) {
      console.log("WORKLOG WEEKS ERROR:", err);
    }
  }

  function openWeek(item: any) {
    navigation.navigate("WeekDetail", {
      weekStart: item.weekStart,
      employeeId: item.employee.id,
    });
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={weeks}
        keyExtractor={(item) => item.employee.id + item.weekStart}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => openWeek(item)}>
            <Text style={styles.employee}>{item.employee.name}</Text>

            <Text style={styles.project}>{item.project.name}</Text>

            <Text style={styles.week}>
              Semana: {new Date(item.weekStart).toLocaleDateString()}
            </Text>

            <Text style={styles.total}>€ {item.total}</Text>

            <Text
              style={[
                styles.status,
                item.status === "closed" ? styles.closed : styles.open,
              ]}
            >
              {item.status}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },

  employee: {
    fontWeight: "700",
    fontSize: 16,
  },

  project: {
    color: "#666",
  },

  week: {
    marginTop: 4,
  },

  total: {
    marginTop: 8,
    fontWeight: "700",
  },

  status: {
    marginTop: 4,
  },

  closed: {
    color: "green",
  },

  open: {
    color: "orange",
  },
});
