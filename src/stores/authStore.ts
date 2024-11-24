import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import CryptoJS from 'crypto-js';

interface User {
  id: string;
  name: string;
  role: string;
  avatar: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const encryptData = (data: string) => {
  return CryptoJS.AES.encrypt(data, import.meta.env.VITE_ENCRYPTION_KEY || 'default-key').toString();
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: async (email, password) => {
        try {
          // Simulated API call - replace with actual API integration
          const mockUser: User = {
            id: '1',
            name: 'John Doe',
            role: 'Paramedic',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=faces',
            email: email
          };
          
          const mockToken = 'mock-jwt-token';
          const encryptedToken = encryptData(mockToken);
          
          set({
            user: mockUser,
            token: encryptedToken,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('Login failed:', error);
          throw error;
        }
      },
      logout: () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        token: state.token,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);