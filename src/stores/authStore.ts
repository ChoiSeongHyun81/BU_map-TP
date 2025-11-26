import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthTokens } from "../types/api";

type UserProfile = {
  student_id: string;
  nickname?: string;
};

type AuthState = {
  tokens: AuthTokens | null;
  user: UserProfile | null;
  setTokens: (tokens: AuthTokens) => void;
  setUser: (user: UserProfile | null) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      tokens: null,
      user: null,
      setTokens: (tokens) => set({ tokens }),
      setUser: (user) => set({ user }),
      clear: () => set({ tokens: null, user: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ tokens: state.tokens, user: state.user }),
    }
  )
);

export const getAuthTokens = () => useAuthStore.getState().tokens;
export const clearAuth = () => useAuthStore.getState().clear();
