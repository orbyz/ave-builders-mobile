import { api } from "./axios";

export async function getWorklogWeeks() {
  const res = await api.get("/mobile/worklogs/weeks");
  return res.data;
}

export async function addWorklogDay(payload: {
  employeeId: string;
  projectId: string;
  date: string;
  weekStart: string;
}) {
  const res = await api.post("/mobile/worklogs/add-day", payload);
  return res.data;
}

export async function getWeekDetail(weekStart: string, employeeId: string) {
  const res = await api.get(
    `/mobile/worklogs/weeks/${weekStart}?employeeId=${employeeId}`,
  );
  return res.data;
}

export async function closeWorklogWeek(employeeId: string, weekStart: string) {
  const res = await api.post("/mobile/worklogs/close-week", {
    employeeId,
    weekStart,
  });

  return res.data;
}

export async function deleteWorklog(id: string) {
  const res = await api.delete(`/mobile/worklogs/${id}`);
  return res.data;
}
