export type UserRole = 'ADMIN' | 'EDITOR';
export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatarUrl?: string;
    createdAt: string;
    updatedAt: string;
}
export interface AuthSession {
    token: string;
    user: User;
    expiresAt: string;
}
export interface LoginCredentials {
    email: string;
    password: string;
}
//# sourceMappingURL=user.d.ts.map