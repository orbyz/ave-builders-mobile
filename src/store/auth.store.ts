import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

interface User {
  id: string;
  role: "admin" | "empleado" | "cliente";
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => Promise<void>;
  loadAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,

  setAuth: async (user, token) => {
    await SecureStore.setItemAsync("token", token);
    await SecureStore.setItemAsync("user", JSON.stringify(user));
    set({ user, token });
  },

  loadAuth: async () => {
    const token = await SecureStore.getItemAsync("token");
    const user = await SecureStore.getItemAsync("user");

    if (token && user) {
      set({ token, user: JSON.parse(user) });
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("user");
    set({ user: null, token: null });
  },
}));
