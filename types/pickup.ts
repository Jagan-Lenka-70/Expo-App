export interface PickupRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  address: string;
  googleMapLink?: string;
  pickupDate: string;
  timeSlot: string;
  status: 'pending' | 'accepted' | 'in-process' | 'pending-approval' | 'completed';
  pickupCode?: string;
  partnerId?: string;
  partnerName?: string;
  items?: ScrapItem[];
  totalAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ScrapItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface User {
  id: string;
  phone: string;
  name: string;
  type: 'customer' | 'partner';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface PickupState {
  requests: PickupRequest[];
  isLoading: boolean;
  error: string | null;
}