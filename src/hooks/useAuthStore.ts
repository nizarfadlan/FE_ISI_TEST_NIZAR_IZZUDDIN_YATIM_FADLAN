import { api, apiCall } from "@/lib/axios";
import type { GetUserResponseDTO } from "@/server/users/type";
import type { ApiResponse } from "@/types";
import { HttpStatus } from "@/types/httpStatus.enum";
import { ClientError } from "@/utils/error";
import { toast } from "sonner";
import { create } from "zustand";

interface LoadingState {
  auth: boolean;
  profile: boolean;
}

interface AuthState {
  user: GetUserResponseDTO | null;
  loading: LoadingState;
  error: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  initialize: () => Promise<void>;
  login: (username: string, password: string) => Promise<boolean>;
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
  isInitialized: false,

  initialize: async () => {
    set({ loading: { ...get().loading, auth: true } });
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
          if (response.data?.isAuthenticated && !get().user) {
            await get().fetchProfile();
          }
          set({ isAuthenticated: response.data?.isAuthenticated });
        } catch (error) {
          if (
            error instanceof ClientError &&
            error.toJson().error.status === HttpStatus.UNAUTHORIZED
          ) {
            get().logout();
          }
        } finally {
          set({ loading: { ...get().loading, auth: false } });
        }
      } else {
        set({
          isAuthenticated: false,
          loading: { ...get().loading, auth: false },
          user: null,
        });
      }
    } catch {
      set({
        isAuthenticated: false,
        error: "Failed to initialize auth",
        user: null,
      });
      toast.error("Failed to initialize auth");
    } finally {
      set({ loading: { ...get().loading, auth: false }, isInitialized: true });
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

      return true;
    } catch (err) {
      if (err instanceof ClientError) {
        toast.error("Failed to login", {
          description: err.message,
        });
        set({ error: err.message });
        return false;
      }

      toast.error("Failed to login", {
        description: "Please check your credentials",
      });
      set({ error: "Login failed" });
      return false;
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

      setTimeout(() => {
        window.location.href = "/login";
      }, 100);
    } catch (err) {
      if (err instanceof ClientError) {
        toast.error("Failed to logout", {
          description: err.message,
        });
        return set({ error: err.message });
      }

      toast.error("Failed to logout", {
        description: "Please try again",
      });
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
      )) as ApiResponse<GetUserResponseDTO>;

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

        toast.error("Failed to fetch profile", {
          description: err.message,
        });
        return set({ error: err.message });
      }

      toast.error("Failed to fetch profile", {
        description: "Please try again",
      });
      set({
        error: "Failed to fetch profile",
      });
    } finally {
      set({ loading: { ...get().loading, profile: false } });
    }
  },
}));

export const initializeAuth = async () => {
  try {
    const authStore = useAuthStore.getState();

    if (authStore.isInitialized) return;

    await authStore.initialize();
    return true;
  } catch (error) {
    console.error("Initialize auth error:", error);
    throw error;
  }
};
