/**
 * Simple API authentication state manager
 * Handles local storage of API tokens and user data
 */

export interface ApiUser {
  id: string;
  first_name: string;
  email: string;
  created_at: string;
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
   * Remove authentication token
   */
  static removeToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.TOKEN_KEY);
      console.log("🔐 API token removed");
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
