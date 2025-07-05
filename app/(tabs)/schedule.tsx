import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { usePickup } from '@/contexts/PickupContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/contexts/ToastContext';
import { StatusTracker } from '@/components/StatusTracker';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Clock, MapPin, Plus, Link, CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const TIME_SLOTS = [
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:00 - 12:00',
  '12:00 - 13:00',
  '14:00 - 15:00',
  '15:00 - 16:00',
  '16:00 - 17:00',
  '17:00 - 18:00',
];

export default function ScheduleScreen() {
  const { state: authState } = useAuth();
  const { createPickupRequest, getCustomerRequests, updatePickupStatus } = usePickup();
  const { state: themeState } = useTheme();
  const { theme } = themeState;
  const { showToast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Form state
  const [pickupDate, setPickupDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [address, setAddress] = useState('');
  const [googleMapLink, setGoogleMapLink] = useState('');

  const isCustomer = authState.user?.type === 'customer';
  const userRequests = isCustomer
    ? getCustomerRequests(authState.user?.id || '')
    : [];

  const pendingApprovalRequests = userRequests.filter(req => req.status === 'pending-approval');

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setPickupDate(selectedDate);
    }
  };

  const handleSchedulePickup = async () => {
    if (!selectedTimeSlot || !address.trim()) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    setLoading(true);
    try {
      await createPickupRequest({
        customerId: authState.user?.id || '',
        customerName: authState.user?.name || '',
        customerPhone: authState.user?.phone || '',
        address: address.trim(),
        googleMapLink: googleMapLink.trim() || undefined,
        pickupDate: pickupDate.toISOString(),
        timeSlot: selectedTimeSlot,
      });

      showToast('Pickup request scheduled successfully!', 'success');
      
      // Reset form
      setPickupDate(new Date());
      setSelectedTimeSlot('');
      setAddress('');
      setGoogleMapLink('');
      
      router.push('/(tabs)');
    } catch (error) {
      showToast('Failed to schedule pickup request', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (requestId: string, approve: boolean) => {
    try {
      if (approve) {
        await updatePickupStatus(requestId, 'completed');
        showToast('Pickup request approved successfully!', 'success');
      } else {
        await updatePickupStatus(requestId, 'accepted');
        showToast('Pickup request rejected. It has been sent back to the partner.', 'info');
      }
    } catch (error) {
      showToast('Failed to process approval', 'error');
    }
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
    approvalSection: {
      marginBottom: theme.spacing.lg,
    },
    approvalCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.error,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    approvalHeader: {
      marginBottom: theme.spacing.sm,
    },
    approvalDate: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
      marginBottom: 4,
    },
    approvalAddress: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
    },
    itemsList: {
      marginBottom: theme.spacing.md,
    },
    itemsTitle: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    itemRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 4,
    },
    itemName: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
    },
    itemDetails: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: theme.colors.text,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: theme.spacing.sm,
      marginTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    totalLabel: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
    },
    totalAmount: {
      fontSize: 16,
      fontFamily: 'Inter-Bold',
      color: theme.colors.primary,
    },
    approvalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    approvalButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.sm,
      marginHorizontal: 4,
    },
    rejectButton: {
      backgroundColor: theme.colors.error + '20',
    },
    approveButton: {
      backgroundColor: theme.colors.success + '20',
    },
    rejectButtonText: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.error,
      marginLeft: theme.spacing.sm,
    },
    approveButtonText: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.success,
      marginLeft: theme.spacing.sm,
    },
    formSection: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    sectionTitle: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    sectionSubtitle: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: 40,
    },
    formGroup: {
      marginBottom: theme.spacing.lg,
    },
    label: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    dateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.sm,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.background,
    },
    dateButtonText: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: theme.colors.text,
      marginLeft: theme.spacing.sm,
    },
    timeSlotGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -4,
    },
    timeSlotButton: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '48%',
      margin: 4,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: theme.colors.background,
    },
    timeSlotButtonActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    timeSlotText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.sm,
    },
    timeSlotTextActive: {
      color: '#FFFFFF',
    },
    textInput: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.sm,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: theme.colors.text,
      backgroundColor: theme.colors.background,
      textAlignVertical: 'top',
    },
    submitButton: {
      marginTop: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    submitButtonGradient: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
    },
    submitButtonText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
      marginLeft: theme.spacing.sm,
    },
  });

  if (!isCustomer) {
    // Partner view - show pickup history
    return (
      <ScrollView style={styles.container}>
        <LinearGradient
          colors={[theme.colors.primary, '#388E3C']}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Pickup History</Text>
          <Text style={styles.headerSubtitle}>Track your completed pickups</Text>
        </LinearGradient>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Coming Soon</Text>
          <Text style={styles.sectionSubtitle}>
            Partner history and analytics will be available soon
          </Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={[theme.colors.primary, '#388E3C']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Schedule Pickup</Text>
        <Text style={styles.headerSubtitle}>Book your scrap collection</Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Pending Approval Section */}
        {pendingApprovalRequests.length > 0 && (
          <View style={styles.approvalSection}>
            <Text style={styles.sectionTitle}>Pending Approval</Text>
            {pendingApprovalRequests.map((request) => (
              <View key={request.id}>
                <StatusTracker currentStatus={request.status} />
                <View style={styles.approvalCard}>
                  <View style={styles.approvalHeader}>
                    <Text style={styles.approvalDate}>
                      {new Date(request.pickupDate).toLocaleDateString()}
                    </Text>
                    <Text style={styles.approvalAddress}>{request.address}</Text>
                  </View>
                  
                  {request.items && (
                    <View style={styles.itemsList}>
                      <Text style={styles.itemsTitle}>Items Collected:</Text>
                      {request.items.map((item) => (
                        <View key={item.id} style={styles.itemRow}>
                          <Text style={styles.itemName}>{item.name}</Text>
                          <Text style={styles.itemDetails}>
                            {item.quantity} × ₹{item.price}
                          </Text>
                        </View>
                      ))}
                      <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total Amount:</Text>
                        <Text style={styles.totalAmount}>₹{request.totalAmount}</Text>
                      </View>
                    </View>
                  )}

                  <View style={styles.approvalButtons}>
                    <TouchableOpacity
                      style={[styles.approvalButton, styles.rejectButton]}
                      onPress={() => handleApproval(request.id, false)}
                    >
                      <XCircle size={20} color={theme.colors.error} />
                      <Text style={styles.rejectButtonText}>Reject</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.approvalButton, styles.approveButton]}
                      onPress={() => handleApproval(request.id, true)}
                    >
                      <CheckCircle size={20} color={theme.colors.success} />
                      <Text style={styles.approveButtonText}>Approve</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Schedule Form */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Schedule New Pickup</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Pickup Date *</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Calendar size={20} color={theme.colors.textSecondary} />
              <Text style={styles.dateButtonText}>
                {pickupDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={pickupDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Time Slot *</Text>
            <View style={styles.timeSlotGrid}>
              {TIME_SLOTS.map((slot) => (
                <TouchableOpacity
                  key={slot}
                  style={[
                    styles.timeSlotButton,
                    selectedTimeSlot === slot && styles.timeSlotButtonActive
                  ]}
                  onPress={() => setSelectedTimeSlot(slot)}
                >
                  <Clock size={16} color={selectedTimeSlot === slot ? '#FFFFFF' : theme.colors.textSecondary} />
                  <Text style={[
                    styles.timeSlotText,
                    selectedTimeSlot === slot && styles.timeSlotTextActive
                  ]}>
                    {slot}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Pickup Address *</Text>
            <TextInput
              style={styles.textInput}
              value={address}
              onChangeText={setAddress}
              placeholder="Enter your pickup address"
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Google Map Link (Optional)</Text>
            <TextInput
              style={styles.textInput}
              value={googleMapLink}
              onChangeText={setGoogleMapLink}
              placeholder="Paste Google Maps link here"
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSchedulePickup}
            disabled={loading}
          >
            <LinearGradient
              colors={[theme.colors.primary, '#388E3C']}
              style={styles.submitButtonGradient}
            >
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>
                {loading ? 'Scheduling...' : 'Schedule Pickup'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}