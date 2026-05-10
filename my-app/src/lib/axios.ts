import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import type { RefreshTokenResponse } from "@/types/auth";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      useAuthStore.getState().refreshToken
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;

        const response = await axios.post<RefreshTokenResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh`,
          { refreshToken }
        );

        useAuthStore
          .getState()
          .setTokens(response.data.accessToken, response.data.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().clearAuth();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;