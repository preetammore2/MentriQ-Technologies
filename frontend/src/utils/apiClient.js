import axios from 'axios'

const staticProdURL = 'https://mentriq-technologies.onrender.com/api';

const resolvedBaseURL =
  (import.meta.env.VITE_API_BASE_URL && !import.meta.env.VITE_API_BASE_URL.includes('localhost')) || import.meta.env.DEV
    ? (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api')
    : staticProdURL;

if (import.meta.env.DEV) {
  console.log('🚀 MentriQ API Base URL:', resolvedBaseURL);
}

const MAX_RETRIES = Number(import.meta.env.VITE_API_RETRY_COUNT || 2);
const RETRY_DELAY_MS = Number(import.meta.env.VITE_API_RETRY_DELAY_MS || 700);

export const apiClient = axios.create({
  baseURL: resolvedBaseURL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT_MS || 60000), // Increased to 60s for Render cold starts
  headers: {
    'Content-Type': 'application/json'
  }
})

// Production Link Monitor
if (!import.meta.env.DEV) {
  apiClient.interceptors.response.use(
    res => res,
    err => {
      console.warn(`[Sync Monitor] ${err.config?.url} failed: ${err.message}`);
      return Promise.reject(err);
    }
  );
}

apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token')
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config || {};
    const method = (config.method || "get").toLowerCase();
    const status = error?.response?.status;
    const isNetworkError = !error?.response;
    const isTransientServerError = status >= 500;
    const isSafeMethod = ["get", "head", "options"].includes(method);
    const isAuthRoute = typeof config.url === "string" && config.url.startsWith("/auth/");

    config.__retryCount = config.__retryCount || 0;
    const shouldRetry =
      !isAuthRoute &&
      isSafeMethod &&
      config.__retryCount < MAX_RETRIES &&
      (isNetworkError || isTransientServerError);

    if (!shouldRetry) {
      return Promise.reject(error);
    }

    config.__retryCount += 1;
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS * config.__retryCount));
    return apiClient(config);
  }
)
