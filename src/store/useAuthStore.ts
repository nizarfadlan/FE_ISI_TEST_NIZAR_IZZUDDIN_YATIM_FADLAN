import { api } from "@/lib/axios";
import type { ProfileResponseDTO } from "@/server/users/type";
import type { ApiResponse } from "@/types";
import { ClientError } from "@/utils/error";
import { create } from "zustand";

interface AuthState {
  user: ProfileResponseDTO | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  error: null,

  login: async (username, password) => {
    set({ error: null, loading: true });
    try {
      await api.post("/api/auth/login", { username, password });
      await get().fetchProfile();
      set({ error: null });
    } catch (err) {
      if (err instanceof ClientError) {
        return set({ error: err.message });
      }

      set({ error: "Login failed" });
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    set({ error: null, loading: true });
    try {
      await api.post("/api/auth/logout");
      set({ user: null, error: null });
    } catch (err) {
      if (err instanceof ClientError) {
        return set({ error: err.message });
      }

      set({ error: "Logout failed" });
    } finally {
      set({ loading: false });
    }
  },

  fetchProfile: async () => {
    set({ loading: true });
    try {
      const response = (await api.get(
        "/api/users/me",
      )) as ApiResponse<ProfileResponseDTO>;

      if (!response.success) {
        throw new ClientError(response.error.message, response.error.status);
      }

      set({ user: response.data, error: null });
    } catch (err) {
      if (err instanceof ClientError) {
        return set({ error: err.message });
      }

      set({
        error: "Failed to fetch profile",
      });
    } finally {
      set({ loading: false });
    }
  },
}));
