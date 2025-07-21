import api from './api';

export interface User {
  id: string;
  _id?: string; // MongoDB _id field for compatibility
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  readingGoal: {
    yearly: number;
    current: number;
  };
  preferences: {
    favoriteGenres: string[];
    privacySettings: {
      profilePublic: boolean;
      showReadingProgress: boolean;
    };
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/register', credentials);
    return response.data;
  }

  async getCurrentUser(): Promise<{ user: User }> {
    const response = await api.get('/auth/me');
    return response.data;
  }

  async refreshToken(): Promise<{ token: string }> {
    const response = await api.post('/auth/refresh');
    return response.data;
  }

  async getProfile(): Promise<any> {
    const response = await api.get('/user/profile');
    return response.data;
  }

  async updateProfile(data: any): Promise<any> {
    const response = await api.put('/user/profile', data);
    return response.data;
  }

  async uploadAvatar(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post('/user/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async getDashboard(): Promise<any> {
    const response = await api.get('/user/dashboard');
    return response.data;
  }

  async getAllUsers(): Promise<any> {
    const response = await api.get('/user/all');
    return response.data;
  }

  async getFriends(): Promise<any> {
    const response = await api.get('/user/friends');
    return response.data;
  }

  async searchUsers(query: string): Promise<any> {
    const response = await api.get('/user/search', { params: { q: query } });
    return response.data;
  }

  async addFriend(friendId: string): Promise<any> {
    const response = await api.post('/user/friends', { friendId });
    return response.data;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}

export const authService = new AuthService();
export default authService;
