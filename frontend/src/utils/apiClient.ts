// src/utils/apiClient.ts
import axios, { AxiosInstance, AxiosResponse } from "axios";

// Types for API responses
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  date_joined: string;
}

export interface Profile {
  id: number;
  user: User;
  full_name: string;
  linkedin_profile_url?: string;
  linkedin_access_token?: string;
  linkedin_connected: boolean;
  preferred_tone:
    | "professional"
    | "casual"
    | "motivational"
    | "technical"
    | "funny";
  email_notifications: boolean;
  daily_reminders: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  message?: string;
  user: User;
  tokens?: {
    access: string;
    refresh: string;
  };
  // For backwards compatibility
  access?: string;
  refresh?: string;
  profile?: Profile;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password_confirm: string; // Backend requires password confirmation
  first_name?: string;
  last_name?: string;
}

export interface LoginData {
  username_or_email: string; // Backend accepts both username and email
  password: string;
}

export interface ApiError {
  detail?: string;
  non_field_errors?: string[];
  [key: string]: any;
}

const API_BASE_URL =
  import.meta.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api/v1";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling and token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration (401) and retry with refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const response = await axios.post(
            `${API_BASE_URL}/auth/token/refresh/`,
            {
              refresh: refreshToken,
            },
          );

          const { access } = response.data;
          localStorage.setItem("accessToken", access);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

// Auth API functions
export const authAPI = {
  register: async (userData: RegisterData): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post<LoginResponse>(
        "/auth/register/",
        userData,
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  login: async (loginData: LoginData): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post<LoginResponse>(
        "/auth/login/",
        loginData,
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  logout: async (): Promise<void> => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await apiClient.post("/auth/logout/", {
          refresh: refreshToken,
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Continue with local logout even if API fails
    } finally {
      // Always clear local storage
      logout();
    }
  },

  refreshToken: async (refreshToken: string): Promise<{ access: string }> => {
    try {
      const response = await apiClient.post<{ access: string }>(
        "/auth/token/refresh/",
        {
          refresh: refreshToken,
        },
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  verifyToken: async (): Promise<{ token: string }> => {
    try {
      const response = await apiClient.get<{ token: string }>(
        "/auth/token/verify/",
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getProfile: async (): Promise<Profile> => {
    try {
      const response = await apiClient.get<Profile>("/auth/profile/");
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateProfile: async (profileData: Partial<Profile>): Promise<Profile> => {
    try {
      const response = await apiClient.put<Profile>(
        "/auth/profile/",
        profileData,
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  changePassword: async (passwordData: {
    old_password: string;
    new_password: string;
  }): Promise<{ message: string }> => {
    try {
      const response = await apiClient.post<{ message: string }>(
        "/auth/change-password/",
        passwordData,
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  healthCheck: async (): Promise<{ status: string; timestamp: string }> => {
    try {
      const response = await apiClient.get<{
        status: string;
        timestamp: string;
      }>("/auth/health/");
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// Error handling helper
const handleApiError = (error: any): Error => {
  if (error.response) {
    const { data, status } = error.response;

    // Handle different error formats from Django REST Framework
    if (data.detail) {
      return new Error(data.detail);
    } else if (data.non_field_errors && Array.isArray(data.non_field_errors)) {
      return new Error(data.non_field_errors[0]);
    } else if (typeof data === "object") {
      // Handle field-specific errors
      const firstErrorKey = Object.keys(data)[0];
      const firstError = data[firstErrorKey];
      const errorMessage = Array.isArray(firstError)
        ? firstError[0]
        : firstError;
      return new Error(errorMessage);
    }

    return new Error(`Request failed with status ${status}`);
  } else if (error.request) {
    return new Error(
      "Network error. Please check your connection and try again.",
    );
  } else {
    return new Error(error.message || "An unexpected error occurred");
  }
};

// Utility functions
export const logout = (): void => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  localStorage.removeItem("profile");
  window.location.href = "/login";
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("accessToken");
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp > currentTime;
  } catch {
    return false;
  }
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

export const getCurrentProfile = (): Profile | null => {
  const profileStr = localStorage.getItem("profile");
  return profileStr ? JSON.parse(profileStr) : null;
};

export const setAuthData = (
  data:
    | LoginResponse
    | {
        access: string;
        refresh: string;
        user: User;
        profile?: Profile | null;
      },
): void => {
  const accessToken = "tokens" in data ? data.tokens?.access : data.access;
  const refreshToken = "tokens" in data ? data.tokens?.refresh : data.refresh;

  if (accessToken && refreshToken) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(data.user));

    if (data.profile) {
      localStorage.setItem("profile", JSON.stringify(data.profile));
    }
  }
};

export default apiClient;
