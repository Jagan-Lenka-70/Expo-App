import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { CircleCheck as CheckCircle, CircleAlert as AlertCircle, Info, X } from 'lucide-react-native';

interface ToastProps {
  visible: boolean;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onHide: () => void;
  duration?: number;
}

const { width } = Dimensions.get('window');

export function Toast({ visible, message, type, onHide, duration = 3000 }: ToastProps) {
  const { state: themeState } = useTheme();
  const { theme } = themeState;
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  const getToastColor = () => {
    switch (type) {
      case 'success': return theme.colors.success;
      case 'error': return theme.colors.error;
      case 'warning': return theme.colors.warning;
      case 'info': return theme.colors.info;
      default: return theme.colors.primary;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'error': return X;
      case 'warning': return AlertCircle;
      case 'info': return Info;
      default: return Info;
    }
  };

  const IconComponent = getIcon();
  const toastColor = getToastColor();

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 60,
      left: theme.spacing.md,
      right: theme.spacing.md,
      zIndex: 1000,
    },
    toast: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
      borderLeftWidth: 4,
      borderLeftColor: toastColor,
    },
    iconContainer: {
      marginRight: theme.spacing.sm,
    },
    message: {
      flex: 1,
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: theme.colors.text,
    },
  });

  if (!visible) return null;

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
        }
      ]}
    >
      <View style={styles.toast}>
        <View style={styles.iconContainer}>
          <IconComponent size={20} color={toastColor} />
        </View>
        <Text style={styles.message}>{message}</Text>
      </View>
    </Animated.View>
  );
}