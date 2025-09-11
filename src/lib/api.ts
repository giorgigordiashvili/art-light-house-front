import axios from "axios";

// API base URL
const API_BASE_URL = "https://api.artlighthouse.ge";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Increased timeout for Cloudflare challenges
  withCredentials: true, // Include cookies with requests (XSRF-TOKEN and laravel_session)
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "User-Agent": "ArtLightHouse-Frontend/1.0",
    // Accept cookies and CSRF tokens
    "X-Requested-With": "XMLHttpRequest",
  },
});

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

// Request interceptor for adding auth tokens and CSRF tokens
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      // Add XSRF token from cookies
      const xsrfToken = getXSRFToken();
      if (xsrfToken) {
        config.headers["X-XSRF-TOKEN"] = xsrfToken;
      }

      // Add auth token if available
      const token = localStorage.getItem("api_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
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
    // Handle global errors here
    console.error("API Error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
    });

    // Handle 401 Unauthorized specifically
    if (error.response?.status === 401) {
      console.error(
        "❌ 401 Unauthorized - Missing or invalid authentication cookies (XSRF-TOKEN, laravel_session)"
      );
    }

    // Handle Cloudflare challenges
    if (error.response?.status === 403 || error.response?.status === 429) {
      console.warn("Cloudflare challenge detected, retrying...");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
