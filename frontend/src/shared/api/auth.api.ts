/**
 * Authentication API client
 */
import { axiosInstance } from "./axios";
import type {
  UserCreateDTO,
  LoginRequestDTO,
  TokenResponse,
  User,
  UserRoleResponse,
} from "./types";

const AUTH_PREFIX = "/api/v1/auth";

export const authApi = {
  /**
   * Register new user (student or teacher)
   */
  register: async (data: UserCreateDTO): Promise<User> => {
    const response = await axiosInstance.post<User>(`${AUTH_PREFIX}/register`, data);
    return response.data;
  },

  /**
   * Login and get JWT token
   */
  login: async (credentials: LoginRequestDTO): Promise<TokenResponse> => {
    const response = await axiosInstance.post<TokenResponse>(
      `${AUTH_PREFIX}/login`,
      credentials
    );
    
    // Save token to localStorage
    if (response.data.access_token) {
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  /**
   * Logout user (clear local storage)
   */
  logout: (): void => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
  },

  /**
   * Get current authenticated user profile
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await axiosInstance.get<User>(`${AUTH_PREFIX}/me`);
    return response.data;
  },

  /**
   * Get current user's role
   */
  getCurrentUserRole: async (): Promise<UserRoleResponse> => {
    const response = await axiosInstance.get<UserRoleResponse>(`${AUTH_PREFIX}/me/role`);
    return response.data;
  },

  /**
   * Check if user is authenticated (has valid token)
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("access_token");
  },

  /**
   * Get stored user from localStorage
   */
  getStoredUser: (): User | null => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  },
};

