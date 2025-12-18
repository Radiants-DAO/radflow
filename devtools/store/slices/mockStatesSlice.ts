import { StateCreator } from 'zustand';
import type { MockState } from '../../types';

export interface MockStatesSlice {
  // State
  mockStates: MockState[];
  
  // Actions
  addMockState: (state: Omit<MockState, 'id'>) => void;
  updateMockState: (id: string, updates: Partial<MockState>) => void;
  deleteMockState: (id: string) => void;
  toggleMockState: (id: string) => void;
}

// Default preset states
const defaultPresets: MockState[] = [
  {
    id: 'auth-logged-in',
    name: 'Logged In User',
    description: 'Simulates an authenticated user',
    category: 'auth',
    values: {
      isAuthenticated: true,
      user: {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
      },
    },
    active: false,
  },
  {
    id: 'auth-admin',
    name: 'Admin User',
    description: 'Simulates an admin user',
    category: 'auth',
    values: {
      isAuthenticated: true,
      user: {
        id: 'admin-1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
      },
    },
    active: false,
  },
  {
    id: 'auth-logged-out',
    name: 'Logged Out',
    description: 'Simulates a logged out state',
    category: 'auth',
    values: {
      isAuthenticated: false,
      user: null,
    },
    active: false,
  },
  {
    id: 'wallet-connected',
    name: 'Wallet Connected',
    description: 'Simulates a connected wallet',
    category: 'wallet',
    values: {
      isConnected: true,
      address: '0x1234567890abcdef1234567890abcdef12345678',
      balance: '1.5',
      network: 'mainnet',
    },
    active: false,
  },
  {
    id: 'wallet-disconnected',
    name: 'Wallet Disconnected',
    description: 'Simulates a disconnected wallet',
    category: 'wallet',
    values: {
      isConnected: false,
      address: null,
      balance: '0',
      network: null,
    },
    active: false,
  },
  {
    id: 'subscription-pro',
    name: 'Pro Subscription',
    description: 'Simulates a pro subscription',
    category: 'subscription',
    values: {
      plan: 'pro',
      features: ['feature1', 'feature2', 'feature3'],
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    active: false,
  },
  {
    id: 'subscription-free',
    name: 'Free Plan',
    description: 'Simulates a free plan',
    category: 'subscription',
    values: {
      plan: 'free',
      features: ['feature1'],
      expiresAt: null,
    },
    active: false,
  },
];

export const createMockStatesSlice: StateCreator<MockStatesSlice, [], [], MockStatesSlice> = (set) => ({
  mockStates: defaultPresets,

  addMockState: (mockState) => set((state) => ({
    mockStates: [...state.mockStates, { ...mockState, id: crypto.randomUUID() }]
  })),

  updateMockState: (id, updates) => set((state) => ({
    mockStates: state.mockStates.map((m) =>
      m.id === id ? { ...m, ...updates } : m
    )
  })),

  deleteMockState: (id) => set((state) => ({
    mockStates: state.mockStates.filter((m) => m.id !== id)
  })),

  toggleMockState: (id) => set((state) => {
    const targetState = state.mockStates.find((m) => m.id === id);
    if (!targetState) return state;

    // If activating, deactivate other states in the same category
    const newActive = !targetState.active;
    
    return {
      mockStates: state.mockStates.map((m) => {
        if (m.id === id) {
          return { ...m, active: newActive };
        }
        // Deactivate other states in the same category
        if (newActive && m.category === targetState.category && m.active) {
          return { ...m, active: false };
        }
        return m;
      })
    };
  }),
});

