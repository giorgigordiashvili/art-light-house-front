import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";

// Function to get the API URL from environment variable
const getApiUrl = (): string => {
  // Use API_URL from environment variable or fallback
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    "https://artlighthouse.api.echodesk.ge";
  return apiUrl;
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

      const token =
        typeof window !== "undefined" ? localStorage.getItem("auth_access_token") : null;
      // Only add Authorization header if we have a valid token (not "cookie-based" placeholder)
      if (token && token !== "cookie-based" && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Do not set 'Origin' header manually; browser controls it for CORS

      // Set Accept-Language header based on current route locale
      try {
        let lang = "ka";
        if (typeof window !== "undefined") {
          const seg = (window.location.pathname.split("/")[1] || "").toLowerCase();
          if (seg === "en") lang = "en";
          else lang = "ka"; // 'ge' route maps to 'ka' for backend
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

  // Response interceptor for error handling and token refresh
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // Check if error is 401 and we haven't already tried to refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        // Try to refresh the token
        if (typeof window !== "undefined") {
          const refreshToken = localStorage.getItem("auth_refresh_token");
          const accessToken = localStorage.getItem("auth_access_token");

          // Only attempt refresh if we have both tokens and access token is not "cookie-based"
          if (refreshToken && accessToken && accessToken !== "cookie-based") {
            try {
              // Call refresh token endpoint
              const response = await axios.post(
                `${getApiUrl()}/api/auth/token/refresh/`,
                { refresh: refreshToken },
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );

              if (response.data.access) {
                // Store new access token
                localStorage.setItem("auth_access_token", response.data.access);

                // Update the failed request with new token
                originalRequest.headers.Authorization = `Bearer ${response.data.access}`;

                // Retry the original request
                return instance(originalRequest);
              }
            } catch (refreshError) {
              // Refresh token failed or expired - force logout only if user was authenticated
              if (accessToken && accessToken !== "cookie-based") {
                localStorage.removeItem("auth_access_token");
                localStorage.removeItem("auth_refresh_token");
                localStorage.removeItem("auth_user");
                localStorage.removeItem("artLightHouse_filters");

                // Dispatch a custom event to notify AuthContext about the forced logout
                const logoutEvent = new CustomEvent("forceLogout", {
                  detail: { reason: "tokenExpired" },
                });
                window.dispatchEvent(logoutEvent);

                // Only redirect if we're on a protected page
                const currentPath = window.location.pathname;
                if (
                  !currentPath.startsWith("/ge") &&
                  !currentPath.startsWith("/en") &&
                  currentPath !== "/"
                ) {
                  window.location.href = "/";
                }
              }

              return Promise.reject(refreshError);
            }
          } else {
            // No valid tokens - just return the error without redirecting
            // This allows unauthenticated users to browse public pages
            return Promise.reject(error);
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
