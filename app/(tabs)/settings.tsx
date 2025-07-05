import { View, Text, StyleSheet, TouchableOpacity, Alert, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/contexts/ToastContext';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Phone, LogOut, Info, CircleHelp as HelpCircle, Moon, Sun, Palette } from 'lucide-react-native';

export default function SettingsScreen() {
  const { state, logout } = useAuth();
  const { state: themeState, toggleTheme } = useTheme();
  const { theme } = themeState;
  const { showToast } = useToast();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            showToast('Logged out successfully', 'info');
            router.replace('/auth');
          }
        }
      ]
    );
  };

  const handleThemeToggle = () => {
    toggleTheme();
    showToast(
      `Switched to ${themeState.isDark ? 'light' : 'dark'} mode`, 
      'success'
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingTop: 60,
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.lg,
    },
    headerTitle: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: '#FFFFFF',
      opacity: 0.9,
    },
    content: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
    },
    profileSection: {
      marginBottom: theme.spacing.xl,
    },
    profileCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    profileIcon: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.md,
    },
    profileInfo: {
      flex: 1,
    },
    profileName: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: theme.colors.text,
      marginBottom: 4,
    },
    profileType: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: theme.colors.primary,
    },
    section: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    infoCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    infoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    infoIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.sm,
    },
    infoContent: {
      flex: 1,
    },
    infoLabel: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: theme.colors.textSecondary,
      marginBottom: 2,
    },
    infoValue: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    menuIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.sm,
    },
    menuText: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: theme.colors.text,
      flex: 1,
    },
    themeToggleItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    themeToggleLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    logoutButton: {
      borderRadius: theme.borderRadius.lg,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    logoutButtonGradient: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
    },
    logoutButtonText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
      marginLeft: theme.spacing.sm,
    },
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.primary, '#388E3C']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Manage your account & preferences</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.profileCard}>
            <View style={styles.profileIcon}>
              <User size={32} color={theme.colors.primary} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{state.user?.name}</Text>
              <Text style={styles.profileType}>
                {state.user?.type === 'customer' ? 'Customer Account' : 'Partner Account'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <Phone size={20} color={theme.colors.textSecondary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone Number</Text>
                <Text style={styles.infoValue}>{state.user?.phone}</Text>
              </View>
            </View>
            
            <View style={[styles.infoItem, { borderBottomWidth: 0 }]}>
              <View style={styles.infoIcon}>
                <User size={20} color={theme.colors.textSecondary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Account Type</Text>
                <Text style={styles.infoValue}>
                  {state.user?.type === 'customer' ? 'Customer Account' : 'Partner Account'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.themeToggleItem}>
            <View style={styles.themeToggleLeft}>
              <View style={styles.menuIcon}>
                {themeState.isDark ? (
                  <Moon size={20} color={theme.colors.textSecondary} />
                ) : (
                  <Sun size={20} color={theme.colors.textSecondary} />
                )}
              </View>
              <Text style={styles.menuText}>
                {themeState.isDark ? 'Dark Mode' : 'Light Mode'}
              </Text>
            </View>
            <Switch
              value={themeState.isDark}
              onValueChange={handleThemeToggle}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={themeState.isDark ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => showToast('Help & Support coming soon!', 'info')}
          >
            <View style={styles.menuIcon}>
              <HelpCircle size={20} color={theme.colors.textSecondary} />
            </View>
            <Text style={styles.menuText}>Help & Support</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => showToast('About EcoPickup v1.0.0', 'info')}
          >
            <View style={styles.menuIcon}>
              <Info size={20} color={theme.colors.textSecondary} />
            </View>
            <Text style={styles.menuText}>About EcoPickup</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LinearGradient
              colors={[theme.colors.error, '#C62828']}
              style={styles.logoutButtonGradient}
            >
              <LogOut size={20} color="#FFFFFF" />
              <Text style={styles.logoutButtonText}>Logout</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}