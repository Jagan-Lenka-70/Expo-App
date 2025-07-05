import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState, User } from '@/types/pickup';

type AuthAction = 
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'RESTORE_SESSION'; payload: User | null };

interface AuthContextType {
  state: AuthState;
  login: (phone: string, otp: string, userType: 'customer' | 'partner') => Promise<boolean>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true };
    case 'LOGIN_SUCCESS':
      return { 
        user: action.payload, 
        isAuthenticated: true, 
        isLoading: false 
      };
    case 'LOGIN_FAILURE':
      return { 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      };
    case 'LOGOUT':
      return { 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      };
    case 'RESTORE_SESSION':
      return {
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false
      };
    default:
      return state;
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  const login = async (phone: string, otp: string, userType: 'customer' | 'partner'): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });
    
    // Mock OTP validation (accept 123456)
    if (otp === '123456') {
      const user: User = {
        id: Date.now().toString(),
        phone,
        name: userType === 'customer' ? 'Customer User' : 'Partner User',
        type: userType
      };
      
      try {
        await AsyncStorage.setItem('user', JSON.stringify(user));
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        return true;
      } catch (error) {
        dispatch({ type: 'LOGIN_FAILURE' });
        return false;
      }
    } else {
      dispatch({ type: 'LOGIN_FAILURE' });
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const restoreSession = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;
      dispatch({ type: 'RESTORE_SESSION', payload: user });
    } catch (error) {
      dispatch({ type: 'RESTORE_SESSION', payload: null });
    }
  };

  useEffect(() => {
    restoreSession();
  }, []);

  return (
    <AuthContext.Provider value={{ state, login, logout, restoreSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};