export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignUpCredentials {
    email: string;
    password: string;
    confirmPassword?: string;
    displayName?: string;
}

export interface AuthError {
    code: string;
    message: string;
}

export interface AuthUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    emailVerified: boolean;
}
