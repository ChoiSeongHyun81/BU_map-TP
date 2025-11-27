import api from "./apiClient";
import type {
  AuthTokens,
  LoginRequest,
  RefreshRequest,
  SignupRequest,
} from "../types/api";

export const signup = async (body: SignupRequest) => {
  await api.post("/api/auth/signup", body);
};

export const login = async (body: LoginRequest): Promise<AuthTokens> => {
  const res = await api.post<AuthTokens>("/api/auth/login", body);
  return res.data;
};

export const refreshToken = async (body: RefreshRequest): Promise<AuthTokens> => {
  const res = await api.post<AuthTokens>("/api/auth/refresh", body);
  return res.data;
};

export const logout = async (refreshToken: string) => {
  await api.post("/api/auth/logout", { refreshToken });
};
