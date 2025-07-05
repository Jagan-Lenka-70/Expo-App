import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/contexts/ToastContext';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

export default function AuthScreen() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [userType, setUserType] = useState<'customer' | 'partner'>('customer');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { state: themeState } = useTheme();
  const { theme } = themeState;
  const { showToast } = useToast();
  const router = useRouter();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePhoneSubmit = () => {
    if (phone.length < 10) {
      showToast('Please enter a valid phone number', 'error');
      return;
    }
    setStep('otp');
    showToast('OTP sent successfully! Use 123456', 'success');
  };

  const handleOtpSubmit = async () => {
    if (otp.length !== 6) {
      showToast('Please enter a valid 6-digit OTP', 'error');
      return;
    }
    
    setLoading(true);
    scale.value = withSpring(0.95);
    
    const success = await login(phone, otp, userType);
    
    if (success) {
      showToast('Login successful!', 'success');
      router.replace('/(tabs)');
    } else {
      showToast('Invalid OTP. Please use 123456', 'error');
      scale.value = withSpring(1);
    }
    
    setLoading(false);
  };

  const handleUserTypeChange = (type: 'customer' | 'partner') => {
    setUserType(type);
    scale.value = withSpring(0.95);
    setTimeout(() => scale.value = withSpring(1), 100);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    keyboardView: {
      flex: 1,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.lg,
    },
    heroImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
      marginBottom: theme.spacing.lg,
    },
    title: {
      fontSize: 28,
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: '#FFFFFF',
      opacity: 0.9,
      textAlign: 'center',
      marginBottom: 40,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      width: '100%',
      maxWidth: 400,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    },
    cardTitle: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.lg,
      textAlign: 'center',
    },
    userTypeContainer: {
      flexDirection: 'row',
      marginBottom: theme.spacing.lg,
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.lg,
      padding: 4,
    },
    userTypeButton: {
      flex: 1,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.sm,
      alignItems: 'center',
    },
    userTypeButtonActive: {
      backgroundColor: theme.colors.primary,
    },
    userTypeText: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: theme.colors.textSecondary,
    },
    userTypeTextActive: {
      color: '#FFFFFF',
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: 14,
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: theme.colors.text,
      marginBottom: theme.spacing.lg,
      backgroundColor: theme.colors.background,
    },
    submitButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.lg,
      paddingVertical: theme.spacing.md,
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    submitButtonText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
    backButton: {
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
    },
    backButtonText: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: theme.colors.primary,
    },
    otpSubtitle: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: 4,
    },
    otpHint: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: theme.colors.primary,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
    },
  });

  return (
    <LinearGradient
      colors={[theme.colors.primary, '#388E3C']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <Animated.View style={[styles.content, animatedStyle]}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg?auto=compress&cs=tinysrgb&w=400' }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <Text style={styles.title}>Welcome to EcoScrap</Text>
          <Text style={styles.subtitle}>Your sustainable scrap collection partner</Text>

          <View style={styles.card}>
            {step === 'phone' ? (
              <>
                <Text style={styles.cardTitle}>Enter Phone Number</Text>
                
                <View style={styles.userTypeContainer}>
                  <TouchableOpacity
                    style={[styles.userTypeButton, userType === 'customer' && styles.userTypeButtonActive]}
                    onPress={() => handleUserTypeChange('customer')}
                  >
                    <Text style={[styles.userTypeText, userType === 'customer' && styles.userTypeTextActive]}>
                      Customer
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.userTypeButton, userType === 'partner' && styles.userTypeButtonActive]}
                    onPress={() => handleUserTypeChange('partner')}
                  >
                    <Text style={[styles.userTypeText, userType === 'partner' && styles.userTypeTextActive]}>
                      Partner
                    </Text>
                  </TouchableOpacity>
                </View>

                <TextInput
                  style={styles.input}
                  placeholder="Enter your phone number"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  maxLength={10}
                />

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handlePhoneSubmit}
                  disabled={loading}
                >
                  <Text style={styles.submitButtonText}>Send OTP</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.cardTitle}>Enter OTP</Text>
                <Text style={styles.otpSubtitle}>
                  We've sent a 6-digit code to {phone}
                </Text>
                <Text style={styles.otpHint}>
                  (Use 123456 for demo)
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Enter 6-digit OTP"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="numeric"
                  maxLength={6}
                />

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleOtpSubmit}
                  disabled={loading}
                >
                  <Text style={styles.submitButtonText}>
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => setStep('phone')}
                >
                  <Text style={styles.backButtonText}>Back to Phone</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}