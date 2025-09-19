import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";

// Function to get the API URL based on current subdomain or path
const getApiUrl = (): string => {
  if (typeof window === "undefined") {
    return "https://testapi.artlighthouse.ge"; // fallback for SSR
  }

  // Default fallback
  const fallbackUrl = "https://testapi.artlighthouse.ge";

  if (process.env.NODE_ENV === "development") {
    console.log(`⚠️  Fallback mode -> API URL: ${fallbackUrl}`);
  }

  return fallbackUrl;
};

// Create axios instance with base configuration
const createAxiosInstance = (baseURL?: string): AxiosInstance => {
  const instance = axios.create({
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  // Request interceptor to add auth token and dynamic base URL
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Set dynamic base URL if not provided
      if (!config.baseURL && !baseURL) {
        config.baseURL = getApiUrl();
      } else if (baseURL) {
        config.baseURL = baseURL;
      }

      // Log API calls in development
      if (process.env.NODE_ENV === "development") {
        console.log(
          `🌐 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
        );
      }

      const token =
        typeof window !== "undefined" ? localStorage.getItem("auth_access_token") : null;
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Do not set 'Origin' header manually; browser controls it for CORS

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        // Handle unauthorized access - token expired or invalid
        if (typeof window !== "undefined") {
          console.warn("🔒 Access token expired or invalid - logging out user");

          // Clear all authentication tokens and user data
          localStorage.removeItem("auth_access_token");
          localStorage.removeItem("auth_refresh_token");
          localStorage.removeItem("auth_user");

          // Clear any filter state to avoid issues after logout
          localStorage.removeItem("artLightHouse_filters");

          // Dispatch a custom event to notify AuthContext about the forced logout
          const logoutEvent = new CustomEvent("forceLogout", {
            detail: { reason: "tokenExpired" },
          });
          window.dispatchEvent(logoutEvent);

          // Redirect to login/home page
          if (window.location.pathname !== "/" && !window.location.pathname.startsWith("/auth")) {
            window.location.href = "/";
          }
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// Default instance that dynamically detects subdomain
const axiosInstance = createAxiosInstance();

export default axiosInstance;
export { createAxiosInstance, getApiUrl };
