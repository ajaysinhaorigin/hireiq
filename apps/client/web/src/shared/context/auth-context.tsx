'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth.service';
import type {
  User,
  LoginDto,
  RegisterDto,
  ApiError,
} from '../types/auth.types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (data: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authService.getProfile();
      setUser(response.data);
    } catch (err) {
      // User is not authenticated
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginDto) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Attempting login with data:', data);
      const response = await authService.login(data);
      setUser(response.user);
      router.push('/dashboard');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Login failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterDto) => {
    try {
      setLoading(true);
      setError(null);
      await authService.register(data);
      // After successful registration, log the user in
      await login({ email: data.email, password: data.password });
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Registration failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      router.push('/login');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Logout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
