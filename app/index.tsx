import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withRepeat, withSequence } from 'react-native-reanimated';

export default function SplashScreen() {
  const { state } = useAuth();
  const router = useRouter();
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    // Start animations
    scale.value = withSpring(1, { damping: 15 });
    opacity.value = withSequence(
      withSpring(1, { damping: 15 }),
      withRepeat(withSpring(0.7), -1, true)
    );

    const timer = setTimeout(() => {
      if (state.isAuthenticated && state.user) {
        router.replace('/(tabs)');
      } else {
        router.replace('/auth');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [state.isAuthenticated, state.user]);

  return (
    <LinearGradient
      colors={['#10B981', '#059669', '#047857']}
      style={styles.container}
    >
      <Animated.View style={[styles.content, animatedStyle]}>
        <Text style={styles.title}>EcoPickup</Text>
        <Text style={styles.subtitle}>Sustainable Scrap Collection</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    opacity: 0.9,
  },
});