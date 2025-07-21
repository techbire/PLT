import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import authService, { User } from '../services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthAction {
  type: 'LOGIN_START' | 'LOGIN_SUCCESS' | 'LOGIN_FAILURE' | 'LOGOUT' | 'SET_LOADING' | 'CLEAR_ERROR' | 'UPDATE_USER';
  payload?: any;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initializeAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const { user } = await authService.getCurrentUser();
          dispatch({ type: 'LOGIN_SUCCESS', payload: { user } });
        } catch (error) {
          authService.logout();
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    };

    initializeAuth();

    // Listen for user data updates
    const handleUserDataUpdate = (event: any) => {
      dispatch({ type: 'UPDATE_USER', payload: event.detail });
    };

    window.addEventListener('userDataUpdated', handleUserDataUpdate);
    return () => {
      window.removeEventListener('userDataUpdated', handleUserDataUpdate);
    };
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const response = await authService.login({ email, password });
      
      authService.setToken(response.token);
      authService.setUser(response.user);
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user: response.user } });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const register = async (userData: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }): Promise<void> => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const response = await authService.register(userData);
      
      authService.setToken(response.token);
      authService.setUser(response.user);
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user: response.user } });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const logout = (): void => {
    authService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const updateUser = (user: User): void => {
    dispatch({ type: 'UPDATE_USER', payload: user });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
