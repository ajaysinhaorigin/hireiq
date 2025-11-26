import { apiClient } from '../lib/api-client';
import type {
  LoginDto,
  RegisterDto,
  AuthResponse,
  RegisterResponse,
  User,
} from '../types/auth.types';

/**
 * Auth Service - Handles all authentication related API calls
 */
export const authService = {
  /**
   * Register a new user
   */
  async register(data: RegisterDto): Promise<RegisterResponse> {
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('role', data.role);

    if (data.companyName) {
      formData.append('companyName', data.companyName);
    }

    if (data.profileImage) {
      formData.append('profileImage', data.profileImage);
    }

    return apiClient.post<RegisterResponse>('/api/v1/user/register', formData);
  },

  /**
   * Login user
   */
  async login(data: LoginDto): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/api/v1/user/login', data);
  },

  /**
   * Logout user
   */
  async logout(): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>('/api/v1/user/logout');
  },

  /**
   * Get current user profile
   */
  async getProfile(): Promise<{ data: User; message: string }> {
    return apiClient.get<{ data: User; message: string }>(
      '/api/v1/user/profile'
    );
  },

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<{
    data: { accessToken: string; refreshToken: string };
    message: string;
  }> {
    return apiClient.post<{
      data: { accessToken: string; refreshToken: string };
      message: string;
    }>('/api/v1/user/refresh-token');
  },

  /**
   * Change password
   */
  async changePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>('/api/v1/user/change-password', {
      oldPassword,
      newPassword,
    });
  },

  /**
   * Update profile
   */
  async updateProfile(data: {
    name?: string;
    email?: string;
    bio?: string;
  }): Promise<{ data: User; message: string }> {
    return apiClient.post<{ data: User; message: string }>(
      '/api/v1/user/update-profile',
      data
    );
  },

  /**
   * Update profile image
   */
  async updateProfileImage(
    file: File
  ): Promise<{ data: User; message: string }> {
    const formData = new FormData();
    formData.append('profileImage', file);

    return apiClient.post<{ data: User; message: string }>(
      '/api/v1/user/profile-image',
      formData
    );
  },
};
