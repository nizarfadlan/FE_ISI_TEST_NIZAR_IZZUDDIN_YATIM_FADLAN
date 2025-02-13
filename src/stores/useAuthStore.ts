import { api, apiCall } from "@/lib/axios";
import type { ProfileResponseDTO } from "@/server/users/type";
import type { ApiResponse } from "@/types";
import { HttpStatus } from "@/types/httpStatus.enum";
import { ClientError } from "@/utils/error";
import { create } from "zustand";

interface LoadingState {
  auth: boolean;
  profile: boolean;
}

interface AuthState {
  user: ProfileResponseDTO | null;
  loading: LoadingState;
  error: string | null;
  isAuthenticated: boolean;
  initialize: () => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: {
    auth: false,
    profile: false,
  },
  error: null,
  isAuthenticated: false,

  initialize: async () => {
    set({ isAuthenticated: false, loading: { ...get().loading, auth: true } });
    try {
      const response = (await apiCall(
        api.get("/api/auth/status"),
      )) as ApiResponse<{
        isAuthenticated: boolean;
      }>;

      if (!response.success) {
        throw new ClientError(response.error.message, response.error.status);
      }

      if (response) {
        try {
          await get().fetchProfile();
          set({ isAuthenticated: response.data?.isAuthenticated });
        } catch {
          get().logout();
        } finally {
          set({ loading: { ...get().loading, auth: false } });
        }
      } else {
        set({ loading: { ...get().loading, auth: false } });
      }
    } catch {
      set({ error: "Failed to initialize auth" });
    } finally {
      set({ loading: { ...get().loading, auth: false } });
    }
  },

  login: async (username, password) => {
    set({ error: null, loading: { ...get().loading, auth: true } });
    try {
      await apiCall(api.post("/api/auth/login", { username, password }));
      await get().fetchProfile();
      set({
        error: null,
        isAuthenticated: true,
      });
    } catch (err) {
      if (err instanceof ClientError) {
        return set({ error: err.message });
      }

      set({ error: "Login failed" });
    } finally {
      set({ loading: { ...get().loading, auth: false } });
    }
  },

  logout: async () => {
    set({ error: null, loading: { ...get().loading, auth: true } });
    try {
      await apiCall(api.post("/api/auth/logout"));
      set({
        user: null,
        error: null,
        isAuthenticated: false,
      });
    } catch (err) {
      if (err instanceof ClientError) {
        return set({ error: err.message });
      }

      set({ error: "Logout failed" });
    } finally {
      set({ loading: { ...get().loading, auth: false } });
    }
  },

  fetchProfile: async () => {
    set({ loading: { ...get().loading, profile: true } });
    try {
      const response = (await apiCall(
        api.get("/api/users/me"),
      )) as ApiResponse<ProfileResponseDTO>;

      if (!response.success) {
        throw new ClientError(response.error.message, response.error.status);
      }

      set({ user: response.data, error: null });
    } catch (err) {
      if (err instanceof ClientError) {
        if (err.toJson().error.status === HttpStatus.UNAUTHORIZED) {
          get().logout();
          return set({ error: "Unauthorized" });
        }
        return set({ error: err.message });
      }

      set({
        error: "Failed to fetch profile",
      });
    } finally {
      set({ loading: { ...get().loading, profile: false } });
    }
  },
}));

export const initializeAuth = async () => {
  const authStore = useAuthStore.getState();
  await authStore.initialize();
};
