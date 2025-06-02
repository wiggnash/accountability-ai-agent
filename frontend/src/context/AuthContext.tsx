// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";

// API Configuration
const API_BASE_URL = "http://localhost:8000/api/v1";

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Types
interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Action Types
type AuthAction =
  | { type: "AUTH_START" }
  | { type: "AUTH_SUCCESS"; payload: { user: User; token: string } }
  | { type: "AUTH_FAILURE" }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; payload: boolean };

// Initial State
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: true,
};

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "AUTH_START":
      return {
        ...state,
        isLoading: true,
      };
    case "AUTH_SUCCESS":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
      };
    case "AUTH_FAILURE":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Props
interface AuthProviderProps {
  children: React.ReactNode;
}

// Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing token on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
          // Verify token with backend using your verify endpoint
          const response = await apiClient.post(
            "/auth/token/verify/",
            { token: accessToken },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );

          if (response.status === 200) {
            // Token is valid, get user data
            // You might need to make another call to get user details
            // or your verify endpoint might return user data
            const userResponse = await apiClient.get("/auth/user/", {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });

            const userData = userResponse.data;
            dispatch({
              type: "AUTH_SUCCESS",
              payload: {
                user: {
                  id: userData.id,
                  name:
                    userData.first_name && userData.last_name
                      ? `${userData.first_name} ${userData.last_name}`
                      : userData.username,
                  email: userData.email,
                  avatar: userData.username.slice(0, 2).toUpperCase(),
                },
                token: accessToken,
              },
            });
          }
        } else {
          dispatch({ type: "AUTH_FAILURE" });
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        // Token is invalid, clear storage
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        dispatch({ type: "AUTH_FAILURE" });
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    try {
      dispatch({ type: "AUTH_START" });

      const response = await apiClient.post("/auth/login/", {
        username_or_email: email,
        password: password,
      });

      const data = response.data;

      // Store tokens in localStorage
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);

      // Format user data to match our User interface
      const userData: User = {
        id: data.user.id,
        name:
          data.user.first_name && data.user.last_name
            ? `${data.user.first_name} ${data.user.last_name}`
            : data.user.username,
        email: data.user.email,
        avatar: data.user.username.slice(0, 2).toUpperCase(),
      };

      dispatch({
        type: "AUTH_SUCCESS",
        payload: {
          user: userData,
          token: data.access,
        },
      });
    } catch (error) {
      dispatch({ type: "AUTH_FAILURE" });

      // Handle axios error properly
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.detail ||
          error.response?.data?.error ||
          "Login failed";
        throw new Error(errorMessage);
      }
      throw new Error("Network error occurred");
    }
  };

  // Register function
  const register = async (
    name: string,
    email: string,
    password: string,
  ): Promise<void> => {
    try {
      dispatch({ type: "AUTH_START" });

      // Split name into first and last name
      const nameParts = name.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ") || firstName;

      // Generate username from email (you can modify this logic)
      const username = email
        .split("@")[0]
        .replace(/[^a-zA-Z0-9]/g, "")
        .toLowerCase();

      const response = await apiClient.post("/auth/register/", {
        username: username,
        email: email,
        password: password,
        password_confirm: password, // If your backend requires password confirmation
        first_name: firstName,
        last_name: lastName,
      });

      const data = response.data;

      // Check if backend auto-logs in the user (returns tokens)
      if (data.access && data.refresh) {
        // Auto-login: store tokens
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);

        // Format user data
        const userData: User = {
          id: data.user.id,
          name:
            data.user.first_name && data.user.last_name
              ? `${data.user.first_name} ${data.user.last_name}`
              : data.user.username,
          email: data.user.email,
          avatar: data.user.username.slice(0, 2).toUpperCase(),
        };

        dispatch({
          type: "AUTH_SUCCESS",
          payload: {
            user: userData,
            token: data.access,
          },
        });
      } else {
        // Registration successful but no auto-login
        dispatch({ type: "AUTH_FAILURE" });
      }
    } catch (error) {
      dispatch({ type: "AUTH_FAILURE" });

      // Handle axios error properly
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.detail ||
          error.response?.data?.error ||
          "Registration failed";
        throw new Error(errorMessage);
      }
      throw new Error("Network error occurred");
    }
  };

  // Logout function
  const logout = (): void => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    dispatch({ type: "LOGOUT" });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
