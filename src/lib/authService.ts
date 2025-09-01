import apiClient from "./api";

export interface RegisterRequest {
  first_name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  password_confirmation: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    first_name: string;
    email: string;
    created_at: string;
  };
  token?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    first_name: string;
    email: string;
    created_at: string;
  };
  token?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

export class AuthService {
  /**
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
    }
  }

  /**
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
}
