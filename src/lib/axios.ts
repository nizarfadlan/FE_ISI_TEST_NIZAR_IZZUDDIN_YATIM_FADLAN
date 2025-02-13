import type { ApiResponse } from "@/types";
import { HttpStatus } from "@/types/httpStatus.enum";
import { ClientError } from "@/utils/error";
import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

class ApiClient {
  private static instance: ApiClient;
  private api: AxiosInstance;
  private refreshPromise: Promise<string | null> | null = null;

  private constructor() {
    this.api = this.createAxiosInstance("application/json");
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private createAxiosInstance(contentType: string): AxiosInstance {
    const instance = axios.create({
      headers: {
        "Content-Type": contentType,
      },
    });

    this.setupInstanceInterceptors(instance);
    return instance;
  }

  private async handleTokenRefresh(
    originalRequest: InternalAxiosRequestConfig & { _retry?: boolean },
  ): Promise<AxiosResponse> {
    try {
      if (!this.refreshPromise) {
        this.refreshPromise = this.refreshTokenRequest();
      }

      const newAccessToken = await this.refreshPromise;

      this.refreshPromise = null;

      if (!newAccessToken) {
        throw new ClientError(
          "Gagal memperbarui sesi",
          HttpStatus.UNAUTHORIZED,
        );
      }

      return this.api(originalRequest);
    } catch (error) {
      this.refreshPromise = null;

      if (error instanceof ClientError) {
        throw error;
      }

      throw new ClientError("Gagal memperbarui sesi", HttpStatus.UNAUTHORIZED);
    }
  }

  private async refreshTokenRequest(): Promise<string | null> {
    const response = await this.api.post("/api/auth/refresh");

    if (response.status !== HttpStatus.OK || !response.data) {
      return null;
    }

    const { access_token } = response.data;

    return access_token;
  }

  private setupInstanceInterceptors(instance: AxiosInstance): void {
    // Response interceptor
    instance.interceptors.response.use(
      (response: AxiosResponse) => {
        const data = response.data as ApiResponse<unknown>;
        if ("success" in data && !data.success) {
          throw new ClientError(
            data.error.message || "Terjadi kesalahan",
            data.error.status,
            data.error.details,
          );
        }

        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        if (
          error.response?.status === HttpStatus.UNAUTHORIZED &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          return this.handleTokenRefresh(originalRequest);
        }

        return Promise.reject(this.handleApiError(error));
      },
    );
  }

  public getApi(): AxiosInstance {
    return this.api;
  }

  private handleApiError(error: AxiosError): ClientError {
    if (error.response) {
      const data = error.response.data as ApiResponse<unknown>;

      if ("success" in data && !data.success) {
        return new ClientError(
          data.error.message || "Terjadi kesalahan",
          data.error.status,
          data.error.details,
        );
      }
    }

    return new ClientError(
      "Terjadi kesalahan yang tidak diketahui",
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export const api = ApiClient.getInstance().getApi();
