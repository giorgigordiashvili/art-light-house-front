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

      // Add origin header for CORS
      if (typeof window !== "undefined" && config.headers) {
        config.headers.Origin = window.location.origin;
      }

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
        // Handle unauthorized access
        if (typeof window !== "undefined") {
          localStorage.removeItem("echodesk_auth_token");
          localStorage.removeItem("echodesk_user_data");
          localStorage.removeItem("echodesk_tenant_data");
          window.location.href = "/";
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
