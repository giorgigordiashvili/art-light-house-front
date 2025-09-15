import axios from "axios";

// API base URL
const API_BASE_URL = "https://api.artlighthouse.ge";

// Function to get XSRF token from cookies
const getXSRFToken = (): string | null => {
  if (typeof window === "undefined") return null;

  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "XSRF-TOKEN") {
      return decodeURIComponent(value);
    }
  }
  return null;
};

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Increased timeout for Cloudflare challenges
  withCredentials: true, // Include cookies with requests (XSRF-TOKEN and laravel_session)
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "User-Agent": "ArtLightHouse-Frontend/1.0",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// Request interceptor for adding auth tokens and XSRF token
apiClient.interceptors.request.use(
  (config) => {
    // Add backend auth token if available
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      const tokenType = localStorage.getItem("token_type") || "Bearer";

      if (token) {
        config.headers.Authorization = `${tokenType} ${token}`;
      }

      // Add XSRF token from cookies
      const xsrfToken = getXSRFToken();
      if (xsrfToken) {
        config.headers["X-XSRF-TOKEN"] = xsrfToken;
      }
    }

    console.log(`Making ${config.method?.toUpperCase()} request to:`, config.url, {
      hasXSRF: !!config.headers["X-XSRF-TOKEN"],
      hasAuth: !!config.headers.Authorization,
      withCredentials: config.withCredentials,
    });
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors and Cloudflare challenges
apiClient.interceptors.response.use(
  (response) => {
    console.log(`Response ${response.status} from:`, response.config.url);
    return response;
  },
  (error) => {
    console.error("API Error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
    });

    if (error.response?.status === 401) {
      console.error(
        "❌ 401 Unauthorized - Missing or invalid authentication cookies (XSRF-TOKEN, laravel_session)"
      );
    }

    if (error.response?.status === 403 || error.response?.status === 429) {
      console.warn("Cloudflare challenge detected, retrying...");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
