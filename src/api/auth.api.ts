import { api } from "./axios";

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: "admin" | "empleado" | "cliente";
  };
}

export async function loginRequest(email: string, password: string) {
  const response = await api.post<LoginResponse>("/mobile/login", {
    email,
    password,
  });

  return response.data;
}
