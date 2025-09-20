
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { Api } from "./env";
import Cookies from "js-cookie";
import { backend_path } from "./enum";

// Axios instance for handling token refresh to prevent infinite loops
const refreshAxios = axios.create({
  baseURL: Api,
  timeout: 5000,
});

const CallApi = axios.create({
  baseURL: Api,
  timeout: 10000,
});

// Request interceptor
CallApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get("accessToken") || localStorage.getItem("accessToken");
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
CallApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If the error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Get refresh token from storage
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Call refresh token endpoint using separate axios instance
        const response = await refreshAxios.post(backend_path.REFRESH_TOKEN, {
          refresh: refreshToken,
        });

        const { access: newAccessToken } = response.data;

        // Update tokens
        localStorage.setItem("accessToken", newAccessToken);
        Cookies.set("accessToken", newAccessToken, { expires: 1 }); // 1 day expiry

        // Update Authorization header
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Return modified request without Authorization header to prevent duplicates
        delete originalRequest.headers['Authorization'];

        // Retry the original request
        return CallApi(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear all tokens and redirect to login
        localStorage.clear();
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default CallApi;