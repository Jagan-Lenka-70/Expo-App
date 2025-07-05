import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

const lightTheme: Theme = {
  colors: {
    primary: '#4CAF50',
    secondary: '#FFC107',
    accent: '#2196F3',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    text: '#212121',
    textSecondary: '#757575',
    border: '#E0E0E0',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
};

const darkTheme: Theme = {
  colors: {
    primary: '#66BB6A',
    secondary: '#FFD54F',
    accent: '#42A5F5',
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#333333',
    success: '#66BB6A',
    warning: '#FFB74D',
    error: '#EF5350',
    info: '#42A5F5',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
};

type ThemeAction = 
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' };

interface ThemeState {
  isDark: boolean;
  theme: Theme;
}

interface ThemeContextType {
  state: ThemeState;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeReducer = (state: ThemeState, action: ThemeAction): ThemeState => {
  switch (action.type) {
    case 'TOGGLE_THEME':
      return {
        isDark: !state.isDark,
        theme: !state.isDark ? darkTheme : lightTheme,
      };
    case 'SET_THEME':
      return {
        isDark: action.payload === 'dark',
        theme: action.payload === 'dark' ? darkTheme : lightTheme,
      };
    default:
      return state;
  }
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(themeReducer, {
    isDark: false,
    theme: lightTheme,
  });

  const toggleTheme = async () => {
    const newTheme = state.isDark ? 'light' : 'dark';
    dispatch({ type: 'TOGGLE_THEME' });
    await AsyncStorage.setItem('theme', newTheme);
  };

  const setTheme = async (theme: 'light' | 'dark') => {
    dispatch({ type: 'SET_THEME', payload: theme });
    await AsyncStorage.setItem('theme', theme);
  };

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme === 'dark' || savedTheme === 'light') {
          dispatch({ type: 'SET_THEME', payload: savedTheme });
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    loadTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ state, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};