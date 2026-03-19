import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "../store/auth.store";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

/* =========================
   REQUEST INTERCEPTOR
   ========================= */

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("token");

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return config;
});

/* =========================
   RESPONSE INTERCEPTOR
   ========================= */

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log("AUTO LOGOUT: Token inválido o expirado");

      const logout = useAuthStore.getState().logout;
      await logout();
    }

    return Promise.reject(error);
  },
);
