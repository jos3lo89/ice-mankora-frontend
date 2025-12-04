import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface User {
  userId: string;
  name: string;
  role: "ADMIN" | "MOZO" | "CAJERO";
  allowedFloorIds: string[];
}

interface AuthState {
  user: User | null;
  isAuth: boolean;
  setLogin: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuth: false,
      setLogin: (user) => set({ user, isAuth: true }),
      logout: () => set({ user: null, isAuth: false }),
    }),
    { name: "auth-storage", storage: createJSONStorage(() => localStorage) }
  )
);
