import axios from "axios";

// API base URL
const API_BASE_URL = "https://api.artlighthouse.ge";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Increased timeout for Cloudflare challenges
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "User-Agent": "ArtLightHouse-Frontend/1.0",
  },
});

// Request interceptor for adding auth tokens if needed
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    console.log(`Making ${config.method?.toUpperCase()} request to:`, config.url);
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

    // Handle Cloudflare challenges
    if (error.response?.status === 403 || error.response?.status === 429) {
      console.warn("Cloudflare challenge detected, retrying...");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
