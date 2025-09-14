/**
<<<<<<< Updated upstream
 * Simple API authentication state manager
 * Handles local storage of API tokens and user data
=======
 * API authentication state manager for next-auth integration
 * Uses backend tokens stored in localStorage
>>>>>>> Stashed changes
 */

export interface ApiUser {
  id: number;
  first_name: string;
  email: string;
<<<<<<< Updated upstream
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export class ApiAuthManager {
  private static readonly TOKEN_KEY = "api_token";
  private static readonly USER_KEY = "api_user";

  /**
   * Store authentication token
   */
  static setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.TOKEN_KEY, token);
      console.log("🔐 API token stored");
=======
  email_verified?: boolean;
  created_at?: string;
  updated_at?: string;
}

export class ApiAuthManager {
  private static readonly TOKEN_KEY = "access_token";
  private static readonly TOKEN_TYPE_KEY = "token_type";
  private static readonly USER_KEY = "api_user";

  /**
   * Store authentication token (backend provided)
   */
  static setToken(token: string, tokenType: string = "Bearer"): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.TOKEN_TYPE_KEY, tokenType);
      console.log("🔐 Backend API token stored");
>>>>>>> Stashed changes
    }
  }

  /**
   * Get authentication token
   */
  static getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  /**
<<<<<<< Updated upstream
   * Remove authentication token
=======
   * Get token type
   */
  static getTokenType(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(this.TOKEN_TYPE_KEY) || "Bearer";
    }
    return "Bearer";
  }

  /**
   * Remove authentication tokens
>>>>>>> Stashed changes
   */
  static removeToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.TOKEN_KEY);
<<<<<<< Updated upstream
      console.log("🔐 API token removed");
=======
      localStorage.removeItem(this.TOKEN_TYPE_KEY);
      // Also clean up old custom tokens
      localStorage.removeItem("api_token");
      localStorage.removeItem("custom_session_token");
      localStorage.removeItem("session_token");
      console.log("🔐 All API tokens removed");
>>>>>>> Stashed changes
    }
  }

  /**
   * Store user data
   */
  static setUser(user: ApiUser): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      console.log("👤 API user data stored");
    }
  }

  /**
   * Get user data
   */
  static getUser(): ApiUser | null {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem(this.USER_KEY);
      if (userData) {
        try {
          return JSON.parse(userData);
        } catch (error) {
          console.error("Error parsing user data:", error);
          this.removeUser();
          return null;
        }
      }
    }
    return null;
  }

  /**
   * Remove user data
   */
  static removeUser(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.USER_KEY);
      console.log("👤 API user data removed");
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return this.getToken() !== null && this.getUser() !== null;
  }

  /**
   * Logout (clear all data)
   */
  static logout(): void {
    this.removeToken();
    this.removeUser();
    console.log("🚪 User logged out from API");
  }

  /**
   * Get auth header for API requests
   */
  static getAuthHeader(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}
