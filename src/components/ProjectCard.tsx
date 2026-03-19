import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Project } from "../api/project.api";

interface Props {
  project: Project;
}

export default function ProjectCard({ project }: Props) {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("ProjectDetail", { id: project._id })}
    >
      <View style={styles.card}>
        <Text style={styles.title}>{project.name}</Text>

        <Text style={styles.meta}>
          Creado: {new Date(project.createdAt).toLocaleDateString()}
        </Text>

        {project.budget && (
          <Text style={styles.meta}>
            Presupuesto: €{project.budget.toLocaleString()}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },
  meta: {
    fontSize: 14,
    color: "#555",
  },
});
