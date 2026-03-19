import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import {
  getWeekDetail,
  closeWorklogWeek,
  deleteWorklog,
} from "../api/worklogs.api";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Button } from "react-native";
import { addWorklogDay } from "../api/worklogs.api";
import { Alert } from "react-native";

export default function WeekDetailScreen() {
  const route = useRoute<RouteProp<any>>();
  const { weekStart, employeeId } = route.params;

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    loadWeek();
  }, []);

  async function loadWeek() {
    try {
      const result = await getWeekDetail(weekStart, employeeId);
      setData(result);
    } catch (err) {
      console.log("WEEK DETAIL ERROR:", err);
    }
  }
  async function closeWeek() {
    try {
      await closeWorklogWeek(data.employee.id, data.weekStart);

      alert("Semana cerrada correctamente");

      loadWeek(); // refresca datos
    } catch (err) {
      console.log("CLOSE WEEK ERROR:", err);
    }
  }

  function removeDay(id: string) {
    Alert.alert(
      "Eliminar día",
      "¿Seguro que deseas eliminar este día trabajado?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteWorklog(id);
              loadWeek();
            } catch (err) {
              console.log("DELETE DAY ERROR:", err);
            }
          },
        },
      ],
    );
  }

  function addDay(date: Date) {
    Alert.alert(
      "Añadir día",
      `¿Agregar jornada para ${date.toLocaleDateString()}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Añadir",
          onPress: async () => {
            try {
              await addWorklogDay({
                projectId: data.project._id,
                employeeId: data.employee._id,
                date: date.toISOString(),
                weekStart: data.weekStart,
              });

              loadWeek();
            } catch (err: any) {
              const message = err?.response?.data?.error;

              if (message === "Ya existe un día para esa fecha") {
                alert("Ese día ya está registrado");
              } else {
                console.log("ADD DAY ERROR:", err);
              }
            }
          },
        },
      ],
    );
  }

  if (!data) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const start = new Date(data.weekStart);
  const end = new Date(start);
  end.setDate(start.getDate() + 4);

  //  console.log(data.days);

  const isClosed = data.days.every((d: any) => d.status === "closed");
  const weekDays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  const fullWeek = weekDays.map((_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);

    const existing = data.days.find((d: any) => {
      const dDate = new Date(d.date);
      return dDate.toDateString() === date.toDateString();
    });

    return {
      date,
      log: existing || null,
    };
  });

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <Text style={styles.title}>{data.employee.name}</Text>

      <Text style={styles.project}>{data.project.name}</Text>

      <Text style={styles.week}>
        Semana{" "}
        {start.toLocaleDateString(undefined, {
          day: "numeric",
          month: "short",
        })}
        {" - "}
        {end.toLocaleDateString(undefined, { day: "numeric", month: "short" })}
      </Text>

      <Text style={[styles.status, isClosed ? styles.closed : styles.open]}>
        {isClosed ? "Semana cerrada" : "Semana abierta"}
      </Text>

      {/* SECTION TITLE */}
      <Text style={styles.section}>Días trabajados</Text>

      {/* DAYS */}
      {fullWeek.map((day, index) => {
        const label = day.date.toLocaleDateString(undefined, {
          weekday: "short",
          day: "numeric",
          month: "short",
        });

        return (
          <View key={index} style={styles.day}>
            <Text style={styles.dayLabel}>{label}</Text>

            <View style={styles.right}>
              {day.log ? (
                <>
                  <Text style={styles.rate}>€ {day.log.rate}</Text>

                  {!isClosed && (
                    <Text
                      style={styles.delete}
                      onPress={() => removeDay(day.log.id)}
                    >
                      ✕
                    </Text>
                  )}
                </>
              ) : (
                <Text style={styles.add} onPress={() => addDay(day.date)}>
                  ＋
                </Text>
              )}
            </View>
          </View>
        );
      })}

      {/* TOTAL */}
      <Text style={styles.total}>Total semana: € {data.total}</Text>
      {!isClosed && <Button title="Cerrar semana" onPress={closeWeek} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  section: {
    marginTop: 20,
    marginBottom: 6,
    fontWeight: "600",
    color: "#666",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
  },

  project: {
    marginBottom: 16,
    color: "#666",
  },

  total: {
    marginTop: 16,
    fontWeight: "700",
  },
  day: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  add: {
    color: "#1e8e3e",
    fontWeight: "700",
    fontSize: 18,
  },
  delete: {
    color: "#d93025",
    fontWeight: "700",
    fontSize: 16,
  },

  dayLabel: {
    fontWeight: "600",
  },

  rate: {
    fontWeight: "600",
  },

  week: {
    marginBottom: 10,
    color: "#666",
  },
  empty: {
    color: "#bbb",
    fontStyle: "italic",
  },
});
