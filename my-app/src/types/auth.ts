export type StaffRole =
    | "ADMIN"
    | "DOCTOR"
    | "NURSE"
    | "RECEPTIONIST"
    | "RADIOLOGIST"
    | "LAB_STAFF";

export interface AuthUser {
    userId: string;
    displayName: string;
    role: StaffRole;
    email: string;
    mustChangePassword?: boolean;
    gender?: "MALE" | "FEMALE";
    dateOfBirth?: string;
    specialization?: string;
    department?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginData {
    accessToken: string;
    refreshToken: string;
    message: string;
    mustChangePassword: boolean;
    user: {
        id?: string;
        userId?: string;
        email: string;
        displayName: string;
        role: StaffRole;
        mustChangePassword: boolean;
        gender?: "MALE" | "FEMALE";
        dateOfBirth?: string;
        specialization?: string;
        department?: string;
    };
}

export interface LoginResponse {
    success: boolean;
    data: LoginData;
    timestamp: string;
}

export interface UpdatePasswordRequest {
    currentPassword: string;
    newPassword: string;
    newPasswordConfirm: string;
    confirmPassword: string;
}

export interface UpdatePasswordResponse {
    message: string;
    accessToken: string;
    refreshToken: string;
    user: {
        userId: string;
        displayName: string;
        role: StaffRole;
        mustChangePassword: boolean;
    };
}

export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
    message: string;
}