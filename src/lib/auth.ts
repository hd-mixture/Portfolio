"use client";

const TOKEN_KEY = "hd_portfolio_admin_token";
const USER_KEY = "hd_portfolio_admin_user";

export interface AdminUser {
    id: string;
    username: string;
    email: string;
    name: string;
    avatar?: string;
    role: string;
}

export interface LoginResponse {
    success: boolean;
    message?: string;
    token?: string;
    admin?: AdminUser;
}

export const authService = {
    // Get stored token from localStorage
    getToken(): string | null {
        if (typeof window === "undefined") return null;
        return localStorage.getItem(TOKEN_KEY);
    },

    // Get stored admin info
    getStoredAdmin(): AdminUser | null {
        if (typeof window === "undefined") return null;
        const data = localStorage.getItem(USER_KEY);
        if (!data) return null;
        try {
            return JSON.parse(data);
        } catch {
            return null;
        }
    },

    // Check if client has active token
    isAuthenticated(): boolean {
        return !!this.getToken();
    },

    // Save session
    saveSession(token: string, admin: AdminUser, rememberMe = false) {
        if (typeof window === "undefined") return;
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(admin));
        if (rememberMe) {
            localStorage.setItem("hd_portfolio_remember", "true");
        } else {
            localStorage.removeItem("hd_portfolio_remember");
        }
    },

    // Clear session / Logout
    logout() {
        if (typeof window === "undefined") return;
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem("hd_portfolio_remember");
        window.location.href = "/admin/login";
    },

    // API Login
    async login(emailOrUsername: string, password: string, rememberMe = false): Promise<LoginResponse> {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ emailOrUsername, password, rememberMe }),
            });

            const data = await res.json();

            if (res.ok && data.token) {
                this.saveSession(data.token, data.admin, rememberMe);
                return {
                    success: true,
                    token: data.token,
                    admin: data.admin,
                };
            } else {
                return {
                    success: false,
                    message: data.message || "Invalid email or password.",
                };
            }
        } catch (error) {
            console.error("Login API request failed:", error);
            return {
                success: false,
                message: "Unable to connect to server. Please check your network and try again.",
            };
        }
    },

    // Verify session with server
    async verifySession(): Promise<boolean> {
        const token = this.getToken();
        if (!token) return false;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.ok) {
                const data = await res.json();
                if (data.admin) {
                    localStorage.setItem(USER_KEY, JSON.stringify(data.admin));
                    return true;
                }
            }
            // If token invalid, clear
            this.logout();
            return false;
        } catch {
            // Keep local session if server is momentarily unreachable
            return true;
        }
    },
};
