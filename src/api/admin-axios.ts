import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";

// Function to get the API URL
const getApiUrl = (): string => {
  if (typeof window === "undefined") {
    return "https://testapi.artlighthouse.ge"; // fallback for SSR
  }
  return "https://testapi.artlighthouse.ge";
};

// Create axios instance specifically for admin operations
const createAdminAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  // Request interceptor to add admin auth token
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Set base URL
      if (!config.baseURL) {
        config.baseURL = getApiUrl();
      }

      // Log API calls in development
      if (process.env.NODE_ENV === "development") {
        console.log(
          `🔐 Admin API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
        );
      }

      // Use admin token instead of regular user token
      const adminToken =
        typeof window !== "undefined" ? localStorage.getItem("admin_access_token") : null;
      if (adminToken && config.headers) {
        config.headers.Authorization = `Bearer ${adminToken}`;
      }

      // Set Accept-Language header
      try {
        let lang = "ka";
        if (typeof window !== "undefined") {
          const seg = (window.location.pathname.split("/")[1] || "").toLowerCase();
          if (seg === "en") lang = "en";
          else lang = "ka";
        }
        if (config.headers) {
          (config.headers as any)["Accept-Language"] = lang;
        }
      } catch {
        // noop
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for admin-specific error handling
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        // Handle unauthorized access for admin
        if (typeof window !== "undefined") {
          console.warn("🔒 Admin access token expired or invalid - logging out admin");

          // Clear admin tokens
          localStorage.removeItem("admin_access_token");
          localStorage.removeItem("admin_refresh_token");
          localStorage.removeItem("admin_user");

          // Dispatch admin logout event
          const adminLogoutEvent = new CustomEvent("adminForceLogout", {
            detail: { reason: "tokenExpired" },
          });
          window.dispatchEvent(adminLogoutEvent);

          // Redirect to admin login
          if (window.location.pathname.startsWith("/admin")) {
            window.location.href = "/admin";
          }
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// Admin axios instance
const adminAxios = createAdminAxiosInstance();

export default adminAxios;
export { createAdminAxiosInstance };
