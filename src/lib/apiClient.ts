import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { clearAuth, getAuthTokens, useAuthStore } from "../stores/authStore";
import type { AuthTokens, RefreshRequest } from "../types/api";

const baseURL =
  import.meta.env.VITE_API_BASE_URL?.toString() || "http://localhost:8080";
// 디버깅용: 실제 요청이 나가는 baseURL을 확인
console.info("[apiClient] baseURL =", baseURL);

const api: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let refreshQueue: ((token: string | null) => void)[] = [];

const processQueue = (token: string | null) => {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
};

const requestRefresh = async (
  refreshToken: string
): Promise<AuthTokens | null> => {
  try {
    const body: RefreshRequest = { refreshToken };
    const res = await axios.post<AuthTokens>(
      `${baseURL}/api/auth/refresh`,
      body,
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data;
  } catch {
    return null;
  }
};

api.interceptors.request.use((config) => {
  const tokens = getAuthTokens();
  if (tokens?.accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;

    if (status !== 401 || original?._retry) {
      return Promise.reject(error);
    }

    const tokens = getAuthTokens();
    const refreshToken = tokens?.refreshToken;
    if (!refreshToken) {
      clearAuth();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push((newToken) => {
          if (!newToken) return reject(error);
          original.headers = original.headers ?? {};
          original.headers.Authorization = `Bearer ${newToken}`;
          original._retry = true;
          resolve(api(original));
        });
      });
    }

    isRefreshing = true;
    original._retry = true;

    const newTokens = await requestRefresh(refreshToken);
    isRefreshing = false;

    if (!newTokens) {
      clearAuth();
      processQueue(null);
      return Promise.reject(error);
    }

    useAuthStore.getState().setTokens(newTokens);
    processQueue(newTokens.accessToken);

    original.headers = original.headers ?? {};
    original.headers.Authorization = `Bearer ${newTokens.accessToken}`;
    return api(original);
  }
);

export default api;
