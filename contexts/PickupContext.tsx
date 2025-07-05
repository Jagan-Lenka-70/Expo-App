import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PickupRequest, PickupState, ScrapItem } from '@/types/pickup';

type PickupAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_REQUESTS'; payload: PickupRequest[] }
  | { type: 'ADD_REQUEST'; payload: PickupRequest }
  | { type: 'UPDATE_REQUEST'; payload: PickupRequest }
  | { type: 'SET_ERROR'; payload: string };

interface PickupContextType {
  state: PickupState;
  createPickupRequest: (request: Omit<PickupRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<void>;
  updatePickupStatus: (id: string, status: PickupRequest['status'], partnerId?: string, partnerName?: string) => Promise<void>;
  addPickupCode: (id: string, code: string) => Promise<void>;
  addItems: (id: string, items: ScrapItem[], totalAmount: number) => Promise<void>;
  loadPickupRequests: () => Promise<void>;
  getCustomerRequests: (customerId: string) => PickupRequest[];
  getPartnerRequests: (partnerId?: string) => PickupRequest[];
}

const PickupContext = createContext<PickupContextType | undefined>(undefined);

const pickupReducer = (state: PickupState, action: PickupAction): PickupState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_REQUESTS':
      return { ...state, requests: action.payload, isLoading: false };
    case 'ADD_REQUEST':
      return { 
        ...state, 
        requests: [...state.requests, action.payload], 
        isLoading: false 
      };
    case 'UPDATE_REQUEST':
      return {
        ...state,
        requests: state.requests.map(req => 
          req.id === action.payload.id ? action.payload : req
        ),
        isLoading: false
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
};

export function PickupProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(pickupReducer, {
    requests: [],
    isLoading: false,
    error: null
  });

  const saveRequests = async (requests: PickupRequest[]) => {
    try {
      await AsyncStorage.setItem('pickup_requests', JSON.stringify(requests));
    } catch (error) {
      console.error('Error saving requests:', error);
    }
  };

  const loadPickupRequests = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const requestsData = await AsyncStorage.getItem('pickup_requests');
      const requests = requestsData ? JSON.parse(requestsData) : [];
      dispatch({ type: 'SET_REQUESTS', payload: requests });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load pickup requests' });
    }
  };

  const createPickupRequest = async (requestData: Omit<PickupRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const newRequest: PickupRequest = {
      ...requestData,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    dispatch({ type: 'ADD_REQUEST', payload: newRequest });
    await saveRequests([...state.requests, newRequest]);
  };

  const updatePickupStatus = async (id: string, status: PickupRequest['status'], partnerId?: string, partnerName?: string) => {
    const request = state.requests.find(req => req.id === id);
    if (!request) return;

    const updatedRequest: PickupRequest = {
      ...request,
      status,
      partnerId,
      partnerName,
      updatedAt: new Date().toISOString()
    };

    dispatch({ type: 'UPDATE_REQUEST', payload: updatedRequest });
    const updatedRequests = state.requests.map(req => 
      req.id === id ? updatedRequest : req
    );
    await saveRequests(updatedRequests);
  };

  const addPickupCode = async (id: string, code: string) => {
    const request = state.requests.find(req => req.id === id);
    if (!request) return;

    const updatedRequest: PickupRequest = {
      ...request,
      pickupCode: code,
      updatedAt: new Date().toISOString()
    };

    dispatch({ type: 'UPDATE_REQUEST', payload: updatedRequest });
    const updatedRequests = state.requests.map(req => 
      req.id === id ? updatedRequest : req
    );
    await saveRequests(updatedRequests);
  };

  const addItems = async (id: string, items: ScrapItem[], totalAmount: number) => {
    const request = state.requests.find(req => req.id === id);
    if (!request) return;

    const updatedRequest: PickupRequest = {
      ...request,
      items,
      totalAmount,
      updatedAt: new Date().toISOString()
    };

    dispatch({ type: 'UPDATE_REQUEST', payload: updatedRequest });
    const updatedRequests = state.requests.map(req => 
      req.id === id ? updatedRequest : req
    );
    await saveRequests(updatedRequests);
  };

  const getCustomerRequests = (customerId: string) => {
    return state.requests.filter(req => req.customerId === customerId);
  };

  const getPartnerRequests = (partnerId?: string) => {
    if (partnerId) {
      return state.requests.filter(req => req.partnerId === partnerId);
    }
    return state.requests.filter(req => req.status === 'pending' || req.partnerId === partnerId);
  };

  useEffect(() => {
    loadPickupRequests();
  }, []);

  return (
    <PickupContext.Provider value={{
      state,
      createPickupRequest,
      updatePickupStatus,
      addPickupCode,
      addItems,
      loadPickupRequests,
      getCustomerRequests,
      getPartnerRequests
    }}>
      {children}
    </PickupContext.Provider>
  );
}

export const usePickup = () => {
  const context = useContext(PickupContext);
  if (!context) {
    throw new Error('usePickup must be used within a PickupProvider');
  }
  return context;
};