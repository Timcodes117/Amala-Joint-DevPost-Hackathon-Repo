import axios from "axios";
import { useRouter } from "next/navigation";

const headers = {
  "Content-Type": "application/json",
};

// Flask backend server URL - set via env NEXT_PUBLIC_API_BASE_URL, fallback to localhost
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");

// Function to handle 401 responses and redirect to login
const handleUnauthorized = () => {
  // Clear any stored tokens
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    
    // Show a brief message to user (optional)
    console.log("Session expired. Redirecting to login...");
    
    // Redirect to login page
    // Use window.location.href for a full page reload to clear any cached state
    window.location.href = "/auth/login";
  }
};

// Create axios instance with response interceptor
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers,
});

// Add request interceptor to include JWT token
apiClient.interceptors.request.use(
  (config) => {
    // Add JWT token to requests if available
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      handleUnauthorized();
    }
    return Promise.reject(error);
  }
);

export const axiosPost = async (
  endpoint: string,
  data: FormData | Record<string, string | number> = {},
  additionalHeaders?: Record<string, string>
) => {
  return apiClient.post(`${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`, data, {
    headers: { ...headers, ...additionalHeaders },
  });
};

export const axiosPostMultiPart = async (
  endpoint: string,
  file: FormData,
  additionalHeaders?: Record<string, string>
) => {
  // Remove Content-Type from headers to let axios set it automatically with boundary
  const { "Content-Type": _, ...headersWithoutContentType } = headers;
  return apiClient.post(`${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`, file, {
    headers: { ...headersWithoutContentType, ...additionalHeaders },
  });
};

export const axiosGet = async (
  endpoint: string,
  additionalHeaders?: Record<string, string>
) => {
  return apiClient.get(`${endpoint.startsWith('http') ? endpoint : `${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`}`, {
    headers: { ...headers, ...additionalHeaders },
  });
};

export const axiosDelete = async (
  endpoint: string,
  additionalHeaders?: Record<string, string>
) => {
  return apiClient.delete(`${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`, {
    headers: { ...headers, ...additionalHeaders },
  });
};

// Export the unauthorized handler for manual use if needed
export const triggerUnauthorized = handleUnauthorized;
