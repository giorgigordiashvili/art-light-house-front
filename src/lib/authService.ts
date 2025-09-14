<<<<<<< Updated upstream
import apiClient from "./api";
=======
import { signIn, signOut } from "next-auth/react";
>>>>>>> Stashed changes

export interface RegisterRequest {
  first_name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user: {
    id: number;
    first_name: string;
    email: string;
<<<<<<< Updated upstream
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
  };
  access_token?: string;
  token_type?: string;
=======
    created_at: string;
    updated_at: string;
  };
  access_token: string;
  token_type: string;
  redirect: string;
>>>>>>> Stashed changes
}

export interface LoginResponse {
  success: boolean;
  message: string;
<<<<<<< Updated upstream
  user: {
    id: number;
    first_name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
  };
  access_token?: string;
  token_type?: string;
=======
  data: {
    token: string;
    token_type: string;
    user: {
      id: number;
      first_name: string;
      email: string;
      email_verified: boolean;
    };
  };
>>>>>>> Stashed changes
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

export class AuthService {
  /**
<<<<<<< Updated upstream
   * Register a new user with retry logic for Cloudflare challenges
   */
  static async register(
    userData: RegisterRequest,
    retryCount: number = 0
  ): Promise<RegisterResponse> {
    try {
      console.log(`Registration attempt ${retryCount + 1}:`, {
        first_name: userData.first_name,
        email: userData.email,
        // Don't log passwords
      });

      const response = await apiClient.post("/en/register", userData);

      console.log("Registration successful:", {
        status: response.status,
        data: response.data,
      });

      return response.data;
    } catch (error: any) {
      console.error(`Registration attempt ${retryCount + 1} failed:`, error);

      // Retry logic for Cloudflare challenges (403, 429) or network issues
      if (
        retryCount < 2 &&
        (error.response?.status === 403 ||
          error.response?.status === 429 ||
          error.code === "ECONNABORTED" ||
          error.code === "NETWORK_ERROR")
      ) {
        console.log(`Retrying registration in ${(retryCount + 1) * 1000}ms...`);
        await new Promise((resolve) => setTimeout(resolve, (retryCount + 1) * 1000));
        return this.register(userData, retryCount + 1);
      }

      // Handle axios error
      if (error.response?.data) {
        throw {
          message: error.response.data.message || "Registration failed",
          errors: error.response.data.errors || {},
          status: error.response.status,
        } as ApiError;
      } else if (error.request) {
        throw {
          message: "Network error. Please check your internet connection and try again.",
          status: 0,
        } as ApiError;
      } else {
        throw {
          message: error.message || "An unexpected error occurred",
          status: 500,
        } as ApiError;
      }
=======
   * Register a new user and store token in localStorage
   */
  static async register(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log("🔍 Registration API Response:", data);

        // Store token in localStorage
        if (typeof window !== "undefined") {
          console.log("🔐 Storing registration tokens:", {
            access_token: data.access_token
              ? data.access_token.substring(0, 10) + "..."
              : "undefined",
            token_type: data.token_type,
          });

          if (data.access_token) {
            localStorage.setItem("access_token", data.access_token);
          } else {
            console.warn("⚠️ access_token is undefined in registration response");
          }

          if (data.token_type) {
            localStorage.setItem("token_type", data.token_type);
          } else {
            console.warn("⚠️ token_type is undefined in registration response");
          }

          // Store user data if available
          if (data.user) {
            localStorage.setItem("api_user", JSON.stringify(data.user));
            console.log(
              "👤 Registration user data stored:",
              data.user.first_name || data.user.email
            );
          }

          // Clear any existing custom session tokens
          localStorage.removeItem("custom_session_token");
          localStorage.removeItem("session_token");

          // Verify storage
          const storedToken = localStorage.getItem("access_token");
          console.log(
            "✅ Token verification after storage:",
            storedToken ? "stored successfully" : "storage failed"
          );
        } else {
          console.warn("⚠️ Window is undefined during registration token storage");
        }

        return data;
      } else {
        throw {
          message: data.error || "Registration failed",
          errors: data.errors || {},
          status: response.status,
        } as ApiError;
      }
    } catch (error: any) {
      if (error.status) {
        throw error;
      }
      throw {
        message: "Network error. Please check your internet connection and try again.",
        status: 0,
      } as ApiError;
>>>>>>> Stashed changes
    }
  }

  /**
<<<<<<< Updated upstream
   * Login user with retry logic for Cloudflare challenges
   */
  static async login(credentials: LoginRequest, retryCount: number = 0): Promise<LoginResponse> {
    try {
      console.log(`Login attempt ${retryCount + 1}:`, {
        email: credentials.email,
        // Don't log passwords
      });

      const response = await apiClient.post("/en/login", credentials);

      console.log("Login successful:", {
        status: response.status,
        data: response.data,
      });

      return response.data;
    } catch (error: any) {
      console.error(`Login attempt ${retryCount + 1} failed:`, error);

      // Retry logic for Cloudflare challenges (403, 429) or network issues
      if (
        retryCount < 2 &&
        (error.response?.status === 403 ||
          error.response?.status === 429 ||
          error.code === "ECONNABORTED" ||
          error.code === "NETWORK_ERROR")
      ) {
        console.log(`Retrying login in ${(retryCount + 1) * 1000}ms...`);
        await new Promise((resolve) => setTimeout(resolve, (retryCount + 1) * 1000));
        return this.login(credentials, retryCount + 1);
      }

      // Handle axios error
      if (error.response?.data) {
        throw {
          message: error.response.data.message || "Login failed",
          errors: error.response.data.errors || {},
          status: error.response.status,
        } as ApiError;
      } else if (error.request) {
        throw {
          message: "Network error. Please check your internet connection and try again.",
          status: 0,
        } as ApiError;
      } else {
        throw {
          message: error.message || "An unexpected error occurred",
          status: 500,
        } as ApiError;
      }
    }
  }
=======
   * Login user using next-auth
   */
  static async login(credentials: LoginRequest): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await signIn("credentials", {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });

      if (result?.error) {
        return { success: false, error: result.error };
      }

      // After successful NextAuth signIn, make direct API call to get tokens
      if (typeof window !== "undefined") {
        try {
          const response = await fetch("https://api.artlighthouse.ge/en/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
          });

          const data = await response.json();

          if (response.ok && data.success) {
            const { token, token_type, user } = data.data;

            // Store tokens in localStorage
            localStorage.setItem("access_token", token);
            localStorage.setItem("token_type", token_type);

            // Store user data in localStorage
            if (user) {
              localStorage.setItem("api_user", JSON.stringify(user));
              console.log("👤 User data stored in localStorage:", user.first_name || user.email);
            }

            console.log("🔐 Login tokens stored in localStorage:", {
              token_type,
              token: token?.substring(0, 10) + "...",
            });
          }
        } catch (error) {
          console.warn("Failed to store login tokens:", error);
        }

        // Clear any existing custom session tokens
        localStorage.removeItem("custom_session_token");
        localStorage.removeItem("session_token");
      }

      return { success: true };
    } catch {
      return { success: false, error: "Login failed" };
    }
  }

  /**
   * Logout user using next-auth
   */
  static async logout(): Promise<void> {
    if (typeof window !== "undefined") {
      // Clear tokens from localStorage
      localStorage.removeItem("access_token");
      localStorage.removeItem("token_type");
      localStorage.removeItem("custom_session_token");
      localStorage.removeItem("session_token");
    }

    await signOut({ redirect: false });
  }

  /**
   * Get stored access token
   */
  static getAccessToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("access_token");
    }
    return null;
  }

  /**
   * Get stored token type
   */
  static getTokenType(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token_type");
    }
    return null;
  }

  /**
   * Check if user is authenticated (has valid token)
   */
  static isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
>>>>>>> Stashed changes
}
