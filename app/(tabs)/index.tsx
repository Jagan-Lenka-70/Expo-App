import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { usePickup } from '@/contexts/PickupContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/contexts/ToastContext';
import { StatusTracker } from '@/components/StatusTracker';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, MapPin, Clock, Plus, Package, TrendingUp, Leaf } from 'lucide-react-native';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const { state: authState } = useAuth();
  const { state: pickupState, getCustomerRequests, getPartnerRequests } = usePickup();
  const { state: themeState } = useTheme();
  const { theme } = themeState;
  const { showToast } = useToast();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const isCustomer = authState.user?.type === 'customer';
  const userRequests = isCustomer
    ? getCustomerRequests(authState.user?.id || '')
    : getPartnerRequests(authState.user?.id);

  const onRefresh = async () => {
    setRefreshing(true);
    showToast('Data refreshed successfully!', 'success');
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return theme.colors.warning;
      case 'accepted': return theme.colors.info;
      case 'in-process': return '#8B5CF6';
      case 'pending-approval': return theme.colors.error;
      case 'completed': return theme.colors.success;
      default: return theme.colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'accepted': return 'Accepted';
      case 'in-process': return 'In Process';
      case 'pending-approval': return 'Pending Approval';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const recentRequests = userRequests.slice(0, 3);
  const completedRequests = userRequests.filter(req => req.status === 'completed');
  const pendingRequests = userRequests.filter(req => req.status !== 'completed');

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
    headerContent: {
      alignItems: 'center',
    },
    greeting: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
      marginBottom: 4,
    },
    userInfo: {
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
    heroSection: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    heroImage: {
      width: '100%',
      height: 120,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.md,
    },
    heroTitle: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    heroSubtitle: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.lg,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      alignItems: 'center',
      marginHorizontal: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    statIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    statNumber: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: theme.colors.text,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: theme.colors.textSecondary,
    },
    actionButton: {
      marginBottom: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    actionButtonGradient: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
    },
    actionButtonText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
      marginLeft: theme.spacing.sm,
    },
    section: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    requestCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    requestHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    requestDate: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
    },
    statusBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 4,
      borderRadius: theme.borderRadius.sm,
    },
    statusText: {
      fontSize: 12,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
    requestInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    requestAddress: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.sm,
      flex: 1,
    },
    requestTime: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.sm,
    },
    pickupCodeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing.sm,
      padding: theme.spacing.sm,
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.sm,
    },
    pickupCodeLabel: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: theme.colors.textSecondary,
    },
    pickupCode: {
      fontSize: 14,
      fontFamily: 'Inter-Bold',
      color: theme.colors.primary,
      marginLeft: theme.spacing.sm,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 40,
    },
    emptyStateText: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    emptyStateSubtext: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  });

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <LinearGradient
        colors={[theme.colors.primary, '#388E3C']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>
            {isCustomer ? 'Welcome back!' : 'Ready to help!'}
          </Text>
          <Text style={styles.userInfo}>
            {authState.user?.name} • {authState.user?.phone}
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg?auto=compress&cs=tinysrgb&w=800' }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <Text style={styles.heroTitle}>
            <Leaf size={20} color={theme.colors.primary} /> EcoScrap Platform
          </Text>
          <Text style={styles.heroSubtitle}>
            Join the sustainable revolution! Turn your scrap into value while helping the environment. 
            Every pickup makes a difference in building a greener future.
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: theme.colors.success }]}>
              <Package size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.statNumber}>{completedRequests.length}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: theme.colors.warning }]}>
              <Clock size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.statNumber}>{pendingRequests.length}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: theme.colors.info }]}>
              <TrendingUp size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.statNumber}>{userRequests.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>

        {isCustomer && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/schedule')}
          >
            <LinearGradient
              colors={[theme.colors.primary, '#388E3C']}
              style={styles.actionButtonGradient}
            >
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Schedule New Pickup</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {recentRequests.length > 0 ? (
            recentRequests.map((request) => (
              <View key={request.id}>
                <StatusTracker currentStatus={request.status} />
                <TouchableOpacity
                  style={styles.requestCard}
                  onPress={() => router.push(`/pickup/${request.id}`)}
                >
                  <View style={styles.requestHeader}>
                    <Text style={styles.requestDate}>
                      {new Date(request.pickupDate).toLocaleDateString()}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(request.status) }]}>
                      <Text style={styles.statusText}>{getStatusText(request.status)}</Text>
                    </View>
                  </View>
                  <View style={styles.requestInfo}>
                    <MapPin size={16} color={theme.colors.textSecondary} />
                    <Text style={styles.requestAddress}>{request.address}</Text>
                  </View>
                  <View style={styles.requestInfo}>
                    <Clock size={16} color={theme.colors.textSecondary} />
                    <Text style={styles.requestTime}>{request.timeSlot}</Text>
                  </View>
                  {request.pickupCode && (
                    <View style={styles.pickupCodeContainer}>
                      <Text style={styles.pickupCodeLabel}>Pickup Code:</Text>
                      <Text style={styles.pickupCode}>{request.pickupCode}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Calendar size={48} color={theme.colors.textSecondary} />
              <Text style={styles.emptyStateText}>
                {isCustomer ? 'No pickup requests yet' : 'No assigned pickups yet'}
              </Text>
              <Text style={styles.emptyStateSubtext}>
                {isCustomer ? 'Schedule your first pickup to get started' : 'Check back later for new assignments'}
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}