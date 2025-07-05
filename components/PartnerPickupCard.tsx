import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { PickupRequest } from '@/types/pickup';
import { usePickup } from '@/contexts/PickupContext';
import { useAuth } from '@/contexts/AuthContext';
import { MapPin, Phone, Calendar, Clock, User, CircleCheck as CheckCircle, Play, Package } from 'lucide-react-native';

interface PartnerPickupCardProps {
  request: PickupRequest;
  onPress?: () => void;
}

export function PartnerPickupCard({ request, onPress }: PartnerPickupCardProps) {
  const { updatePickupStatus, addPickupCode } = usePickup();
  const { state } = useAuth();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'accepted': return '#3B82F6';
      case 'in-process': return '#8B5CF6';
      case 'pending-approval': return '#EF4444';
      case 'completed': return '#10B981';
      default: return '#6B7280';
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

  const handleAccept = async () => {
    try {
      await updatePickupStatus(request.id, 'accepted', state.user?.id, state.user?.name);
      await addPickupCode(request.id, Math.floor(100000 + Math.random() * 900000).toString());
      Alert.alert('Success', 'Pickup request accepted successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to accept pickup request');
    }
  };

  const handleStartPickup = () => {
    Alert.prompt(
      'Start Pickup',
      'Enter the pickup code provided by the customer:',
      async (code) => {
        if (code && code === request.pickupCode) {
          try {
            await updatePickupStatus(request.id, 'in-process');
            Alert.alert('Success', 'Pickup started successfully!');
          } catch (error) {
            Alert.alert('Error', 'Failed to start pickup');
          }
        } else {
          Alert.alert('Error', 'Invalid pickup code');
        }
      }
    );
  };

  const getActionButton = () => {
    switch (request.status) {
      case 'pending':
        return (
          <TouchableOpacity style={styles.actionButton} onPress={handleAccept}>
            <CheckCircle size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Accept</Text>
          </TouchableOpacity>
        );
      case 'accepted':
        return (
          <TouchableOpacity style={[styles.actionButton, styles.startButton]} onPress={handleStartPickup}>
            <Play size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Start Pickup</Text>
          </TouchableOpacity>
        );
      case 'in-process':
        return (
          <TouchableOpacity style={[styles.actionButton, styles.processButton]} onPress={onPress}>
            <Package size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Add Items</Text>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.dateContainer}>
          <Calendar size={16} color="#6B7280" />
          <Text style={styles.date}>
            {new Date(request.pickupDate).toLocaleDateString()}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(request.status) }]}>
          <Text style={styles.statusText}>{getStatusText(request.status)}</Text>
        </View>
      </View>

      <View style={styles.customerInfo}>
        <View style={styles.infoRow}>
          <User size={16} color="#6B7280" />
          <Text style={styles.customerName}>{request.customerName}</Text>
        </View>
        <View style={styles.infoRow}>
          <Phone size={16} color="#6B7280" />
          <Text style={styles.customerPhone}>{request.customerPhone}</Text>
        </View>
      </View>

      <View style={styles.pickupDetails}>
        <View style={styles.infoRow}>
          <MapPin size={16} color="#6B7280" />
          <Text style={styles.address}>{request.address}</Text>
        </View>
        <View style={styles.infoRow}>
          <Clock size={16} color="#6B7280" />
          <Text style={styles.timeSlot}>{request.timeSlot}</Text>
        </View>
      </View>

      {request.pickupCode && (
        <View style={styles.pickupCodeContainer}>
          <Text style={styles.pickupCodeLabel}>Pickup Code:</Text>
          <Text style={styles.pickupCode}>{request.pickupCode}</Text>
        </View>
      )}

      {getActionButton()}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  customerInfo: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  customerName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginLeft: 8,
  },
  customerPhone: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 8,
  },
  pickupDetails: {
    marginBottom: 12,
  },
  address: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 8,
    flex: 1,
  },
  timeSlot: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 8,
  },
  pickupCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  pickupCodeLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  pickupCode: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
    marginLeft: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  startButton: {
    backgroundColor: '#3B82F6',
  },
  processButton: {
    backgroundColor: '#8B5CF6',
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});