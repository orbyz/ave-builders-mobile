import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProjectsScreen from "../screens/ProjectsScreen";
import AdminDashboardScreen from "../screens/AdminDashboardScreen";
import ProjectDetailScreen from "../screens/ProjectDetailScreen";
import WorkLogsScreen from "../screens/WorkLogsScreen";
import WeekDetailScreen from "../screens/WeekDetailScreen";

export type AdminStackParamList = {
  Dashboard: undefined;
  Projects: undefined;
  ProjectDetail: { id: string };
};
const Stack = createNativeStackNavigator<AdminStackParamList>();

export default function AdminStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Dashboard" component={AdminDashboardScreen} />
      <Stack.Screen name="Projects" component={ProjectsScreen} />
      <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} />
      <Stack.Screen
        name="WorkLogs"
        component={WorkLogsScreen}
        options={{ title: "Work Logs" }}
      />
      <Stack.Screen
        name="WeekDetail"
        component={WeekDetailScreen}
        options={{ title: "Week Detail" }}
      />
    </Stack.Navigator>
  );
}
