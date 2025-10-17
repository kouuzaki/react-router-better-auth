import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from "axios";

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public error: string,
    message: string,
    public data?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Create configured axios instance
 */
export const createAxiosInstance = (config?: AxiosRequestConfig): AxiosInstance => {
  const instance = axios.create({
    baseURL: "/api", // Use Vite proxy - will proxy to VITE_BACKEND_BASE_URL
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true, // Important for cookies/sessions
    ...config,
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      // You can add auth tokens here if needed
      // const token = localStorage.getItem('token');
      // if (token) {
      //   config.headers.Authorization = `Bearer ${token}`;
      // }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError<any>) => {
      // Handle errors in a standardized way
      if (error.response) {
        // Server responded with error status
        const { status, data } = error.response;
        
        throw new ApiError(
          status,
          data?.error || "API Error",
          data?.message || error.message || "An error occurred",
          data
        );
      } else if (error.request) {
        // Request made but no response received
        throw new ApiError(
          503,
          "Network Error",
          "No response from server. Please check your connection.",
        );
      } else {
        // Something else happened
        throw new ApiError(
          500,
          "Request Error",
          error.message || "Failed to make request",
        );
      }
    }
  );

  return instance;
};

/**
 * Default axios instance for general API calls
 */
export const axiosClient = createAxiosInstance();

/**
 * Type-safe error response
 */
export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  data?: any;
}

/**
 * Convert ApiError to ErrorResponse
 */
export const toErrorResponse = (error: unknown): ErrorResponse => {
  if (error instanceof ApiError) {
    return {
      error: error.error,
      message: error.message,
      statusCode: error.statusCode,
      data: error.data,
    };
  }

  if (error instanceof Error) {
    return {
      error: "Unknown Error",
      message: error.message,
      statusCode: 500,
    };
  }

  return {
    error: "Unknown Error",
    message: "An unexpected error occurred",
    statusCode: 500,
  };
};
