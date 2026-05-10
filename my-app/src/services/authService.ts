import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import type {
  LoginRequest,
  LoginResponse,
  LoginData,
  UpdatePasswordRequest,
  UpdatePasswordResponse,
  AuthUser,
} from "@/types/auth";

function normalizeUser(user: LoginData["user"]): AuthUser {
  return {
    userId: user.userId ?? user.id ?? "",
    email: user.email,
    displayName: user.displayName,
    role: user.role,
    mustChangePassword: user.mustChangePassword,
    gender: user.gender,
    dateOfBirth: user.dateOfBirth,
    specialization: user.specialization,
    department: user.department,
  };
}

export async function login(payload: LoginRequest) {
  const response = await api.post<LoginResponse>("/auth/login", payload);

  const loginData = response.data.data;

  const normalizedUser = normalizeUser(loginData.user);

  useAuthStore
    .getState()
    .setAuth(
      normalizedUser,
      loginData.accessToken,
      loginData.refreshToken
    );

  return {
    ...loginData,
    user: normalizedUser,
  };
}

export async function updatePassword(payload: UpdatePasswordRequest) {
  const response = await api.patch<UpdatePasswordResponse>(
    "/auth/update-password",
    payload
  );

  const user: AuthUser = {
    userId: response.data.user.userId,
    displayName: response.data.user.displayName,
    role: response.data.user.role,
    email: useAuthStore.getState().user?.email ?? "",
    mustChangePassword: response.data.user.mustChangePassword,
  };

  useAuthStore
    .getState()
    .setAuth(user, response.data.accessToken, response.data.refreshToken);

  return response.data;
}

export async function logout() {
  try {
    await api.post("/auth/logout");
  } finally {
    useAuthStore.getState().clearAuth();
  }
}

export async function getCurrentUser() {
  const response = await api.get<AuthUser>("/auth/me");

  useAuthStore.getState().setUser(response.data);

  return response.data;
}