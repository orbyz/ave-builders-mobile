import { api } from "./axios";

export interface Project {
  _id: string;
  name: string;
  status?: string;
  budget?: number;
  createdAt: string;
}

export async function getProjects(): Promise<Project[]> {
  const response = await api.get("/mobile/projects");
  return response.data;
}
export async function getProjectDetail(id: string) {
  const response = await api.get(`/mobile/projects/${id}`);
  return response.data;
}
export async function toggleInvoiceStatus(id: string, current: string) {
  const newStatus = current === "paid" ? "pending" : "paid";

  const response = await api.patch(`/invoices/${id}`, {
    status: newStatus,
  });

  return response.data;
}
