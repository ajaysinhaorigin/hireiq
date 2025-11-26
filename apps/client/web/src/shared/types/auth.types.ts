export enum Role {
  EMPLOYEE = 'EMPLOYEE',
  RECRUITER = 'RECRUITER',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  profileImage?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role: Role;
  companyName?: string;
  profileImage?: File;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  message: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

