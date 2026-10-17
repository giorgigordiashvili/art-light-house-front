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

// Endpoints that must be called WITHOUT Authorization header (and never trigger a refresh)
const authFreePaths = [
  "/api/ecommerce/clients/login/",
  "/api/ecommerce/clients/register/",
  "/api/ecommerce/clients/verify/",
  "/api/ecommerce/clients/password-reset/request/",
  "/api/ecommerce/clients/password-reset/confirm/",
];

// Single in-flight token refresh shared by every axios instance, so concurrent 401s
// don't each send their own refresh (which breaks with refresh-token rotation)
let refreshPromise: Promise<string> | null = null;

const clearAuthAndLogout = () => {
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
  if (!currentPath.startsWith("/ge") && !currentPath.startsWith("/en") && currentPath !== "/") {
    window.location.href = "/";
  }
};

const refreshAccessToken = (): Promise<string> => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = localStorage.getItem("auth_refresh_token");
      if (!refreshToken) {
        throw new Error("No refresh token");
      }

      // Call ecommerce client refresh token endpoint
      const response = await axios.post(
        `${getApiUrl()}/api/ecommerce/clients/refresh-token/`,
        { refresh: refreshToken },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const access: string | undefined = response.data?.access;
      if (!access) {
        throw new Error("Refresh response did not include an access token");
      }

      // Store new access token
      localStorage.setItem("auth_access_token", access);

      // If a new refresh token is provided, update it as well
      if (response.data.refresh) {
        localStorage.setItem("auth_refresh_token", response.data.refresh);
      }

      return access;
    })()
      .catch((refreshError) => {
        // Only log out when the refresh token was actually rejected; network errors,
        // timeouts and 5xx keep the session. Runs once per refresh, not per request.
        const status = axios.isAxiosError(refreshError) ? refreshError.response?.status : undefined;
        if (status === 400 || status === 401) {
          clearAuthAndLogout();
        }
        throw refreshError;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
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

      const urlPath = (config.url || "").toString();
      const isAuthFree = authFreePaths.some((p) => urlPath.includes(p));

      const token =
        typeof window !== "undefined" ? localStorage.getItem("auth_access_token") : null;
      // Only add Authorization header if we have a valid token (not "cookie-based" placeholder)
      if (!isAuthFree && token && token !== "cookie-based" && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Ensure Authorization header is not present for auth-free endpoints
      if (isAuthFree && config.headers && (config.headers as any).Authorization) {
        delete (config.headers as any).Authorization;
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

      // Never try to refresh for auth endpoints (login, register, etc.)
      const requestPath = (originalRequest?.url || "").toString();
      if (!originalRequest || authFreePaths.some((p) => requestPath.includes(p))) {
        return Promise.reject(error);
      }

      // Check if error is 401 and we haven't already tried to refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        // Try to refresh the token
        if (typeof window !== "undefined") {
          const refreshToken = localStorage.getItem("auth_refresh_token");
          const accessToken = localStorage.getItem("auth_access_token");

          // Only attempt refresh if we have both tokens and access token is not "cookie-based"
          if (refreshToken && accessToken && accessToken !== "cookie-based") {
            // If another refresh already finished, retry with the current token right away
            const sentAuth = originalRequest.headers?.Authorization;
            if (!refreshPromise && sentAuth && sentAuth !== `Bearer ${accessToken}`) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return instance(originalRequest);
            }

            try {
              const newAccess = await refreshAccessToken();

              // Update the failed request with new token and retry it
              originalRequest.headers.Authorization = `Bearer ${newAccess}`;
              return instance(originalRequest);
            } catch (refreshError) {
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
