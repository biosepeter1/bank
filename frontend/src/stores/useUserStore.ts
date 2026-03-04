import { create } from 'zustand';
import { User, Account, UserSettings, Notification } from './types';

interface UserStore {
  user: User | null;
  accounts: Account[];
  settings: UserSettings | null;
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;

  // User actions
  setUser: (user: User | null) => void;
  setAccounts: (accounts: Account[]) => void;
  setSettings: (settings: UserSettings | null) => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  accounts: [],
  settings: null,
  notifications: [],
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  
  setAccounts: (accounts) => set({ accounts }),
  
  setSettings: (settings) => set({ settings }),
  
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
    })),
  
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  
  markNotificationAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  
  clearNotifications: () => set({ notifications: [] }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  logout: () =>
    set({
      user: null,
      accounts: [],
      settings: null,
      notifications: [],
    }),
}));
