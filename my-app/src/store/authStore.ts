import { create } from "zustand";

interface User {
  userId: string;
  displayName: string;
  role: "DOCTOR" | "NURSE" | "ADMIN" | "RECEPTIONIST" | "PATIENT";
  email: string;
}

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  setUser: (user: User, token: string) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  // ========================================================
  // user: {
  //   userId: 'mock-admin-001',
  //   displayName: 'Admin Mona',
  //   role: 'ADMIN',
  //   email: 'admin@careflow.com',
  // },

  // user: {
  //   userId: "mock-receptionist-001",
  //   displayName: "Receptionist John",
  //   role: "RECEPTIONIST",
  //   email: "receptionist@careflow.com",
  // },

  // user: {
  //   userId: "mock-nurse-001",
  //   displayName: "Nurse Sarah",
  //   role: "NURSE",
  //   email: "nurse@careflow.com",
  // },

  user: {
    userId: "mock-doctor-001",
    displayName: "Dr. Sara Ahmed",
    role: "DOCTOR",
    email: "sara@careflow.com",
  },

  accessToken: "mock-token",
  // ========================================================
  setUser: (user, accessToken) => set({ user, accessToken }),
  clearUser: () => set({ user: null, accessToken: null }),
}));
