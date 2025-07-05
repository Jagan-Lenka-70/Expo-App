import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePickup } from '@/contexts/PickupContext';
import { useAuth } from '@/contexts/AuthContext';
import { ScrapItem } from '@/types/pickup';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react-native';

export default function PickupDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state: pickupState, updatePickupStatus, addItems } = usePickup();
  const { state: authState } = useAuth();
  const router = useRouter();

  const [items, setItems] = useState<ScrapItem[]>([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: '', price: '' });

  const request = pickupState.requests.find(req => req.id === id);
  const isPartner = authState.user?.type === 'partner';

  useEffect(() => {
    if (request?.items) {
      setItems(request.items);
    }
  }, [request]);

  const addNewItem = () => {
    if (!newItem.name.trim() || !newItem.quantity || !newItem.price) {
      Alert.alert('Error', 'Please fill in all item details');
      return;
    }

    const item: ScrapItem = {
      id: Date.now().toString(),
      name: newItem.name.trim(),
      quantity: parseInt(newItem.quantity),
      price: parseFloat(newItem.price),
    };

    setItems([...items, item]);
    setNewItem({ name: '', quantity: '', price: '' });
  };

  const removeItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const getTotalAmount = () => {
    return items.reduce((total, item) => total + (item.quantity * item.price), 0);
  };

  const handleSubmitForApproval = async () => {
    if (items.length === 0) {
      Alert.alert('Error', 'Please add at least one item');
      return;
    }

    try {
      await addItems(id!, items, getTotalAmount());
      await updatePickupStatus(id!, 'pending-approval');
      Alert.alert('Success', 'Items submitted for customer approval!');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to submit items for approval');
    }
  };

  if (!request) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Pickup request not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#10B981', '#059669']}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pickup Details</Text>
        <Text style={styles.headerSubtitle}>
          {new Date(request.pickupDate).toLocaleDateString()}
        </Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Customer Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name:</Text>
            <Text style={styles.infoValue}>{request.customerName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>{request.customerPhone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address:</Text>
            <Text style={styles.infoValue}>{request.address}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Time Slot:</Text>
            <Text style={styles.infoValue}>{request.timeSlot}</Text>
          </View>
        </View>

        {isPartner && request.status === 'in-process' && (
          <View style={styles.itemsSection}>
            <Text style={styles.sectionTitle}>Add Scrap Items</Text>
            
            <View style={styles.addItemForm}>
              <TextInput
                style={styles.input}
                placeholder="Item name"
                value={newItem.name}
                onChangeText={(text) => setNewItem({ ...newItem, name: text })}
              />
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Quantity"
                  value={newItem.quantity}
                  onChangeText={(text) => setNewItem({ ...newItem, quantity: text })}
                  keyboardType="numeric"
                />
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Price per unit"
                  value={newItem.price}
                  onChangeText={(text) => setNewItem({ ...newItem, price: text })}
                  keyboardType="numeric"
                />
              </View>
              <TouchableOpacity style={styles.addButton} onPress={addNewItem}>
                <Plus size={20} color="#FFFFFF" />
                <Text style={styles.addButtonText}>Add Item</Text>
              </TouchableOpacity>
            </View>

            {items.length > 0 && (
              <View style={styles.itemsList}>
                <Text style={styles.itemsTitle}>Added Items:</Text>
                {items.map((item) => (
                  <View key={item.id} style={styles.itemCard}>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemDetails}>
                        {item.quantity} × ₹{item.price} = ₹{item.quantity * item.price}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeItem(item.id)}
                    >
                      <Trash2 size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                ))}
                
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total Amount:</Text>
                  <Text style={styles.totalAmount}>₹{getTotalAmount()}</Text>
                </View>

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmitForApproval}
                >
                  <LinearGradient
                    colors={['#10B981', '#059669']}
                    style={styles.submitButtonGradient}
                  >
                    <Save size={20} color="#FFFFFF" />
                    <Text style={styles.submitButtonText}>Submit for Approval</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {request.items && request.items.length > 0 && (
          <View style={styles.itemsSection}>
            <Text style={styles.sectionTitle}>Collected Items</Text>
            <View style={styles.itemsList}>
              {request.items.map((item) => (
                <View key={item.id} style={styles.itemCard}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemDetails}>
                      {item.quantity} × ₹{item.price} = ₹{item.quantity * item.price}
                    </Text>
                  </View>
                </View>
              ))}
              
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Amount:</Text>
                <Text style={styles.totalAmount}>₹{request.totalAmount}</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  backButton: {
    marginBottom: 16,
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
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    flex: 1,
    textAlign: 'right',
  },
  itemsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  addItemForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  itemsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  itemDetails: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  removeButton: {
    padding: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  totalAmount: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
  },
  submitButton: {
    marginTop: 20,
    borderRadius: 12,
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
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 50,
  },
});