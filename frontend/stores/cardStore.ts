import { create } from 'zustand';
import { cardsApi } from '@/lib/api/cards';

export interface Card {
  id: string;
  userId: string;
  cardType: 'VIRTUAL' | 'PHYSICAL';
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED' | 'EXPIRED';
  cardNumber: string;
  cardHolderName: string;
  expiryMonth: number;
  expiryYear: number;
  dailyLimit?: number;
  monthlyLimit?: number;
  createdAt: string;
}

export interface CardRequest {
  id: string;
  userId: string;
  cardType: 'VIRTUAL' | 'PHYSICAL';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reason?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  createdAt: string;
}

interface CardState {
  cards: Card[];
  cardRequests: CardRequest[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchCards: () => Promise<void>;
  fetchCardRequests: () => Promise<void>;
  requestCard: (type: string, currency: string) => Promise<void>;
  freezeCard: (cardId: string) => Promise<void>;
  unfreezeCard: (cardId: string) => Promise<void>;
  resetError: () => void;
}

export const useCardStore = create<CardState>((set) => ({
  cards: [],
  cardRequests: [],
  loading: false,
  error: null,

  fetchCards: async () => {
    set({ loading: true, error: null });
    try {
      const data = await cardsApi.getCards();
      set({ cards: data, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch cards',
        loading: false,
      });
    }
  },

  fetchCardRequests: async () => {
    set({ loading: true, error: null });
    try {
      const data = await cardsApi.getCardRequests();
      set({ cardRequests: data, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch card requests',
        loading: false,
      });
    }
  },

  requestCard: async (type, currency) => {
    set({ loading: true, error: null });
    try {
      const newRequest = await cardsApi.requestCard({ type, currency });
      set((state) => ({
        cardRequests: [...state.cardRequests, newRequest],
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to request card',
        loading: false,
      });
      throw error;
    }
  },

  freezeCard: async (cardId) => {
    set({ loading: true, error: null });
    try {
      await cardsApi.freezeCard(cardId);
      set((state) => ({
        cards: state.cards.map((card) =>
          card.id === cardId ? { ...card, status: 'BLOCKED' as const } : card
        ),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to freeze card',
        loading: false,
      });
      throw error;
    }
  },

  unfreezeCard: async (cardId) => {
    set({ loading: true, error: null });
    try {
      await cardsApi.unfreezeCard(cardId);
      set((state) => ({
        cards: state.cards.map((card) =>
          card.id === cardId ? { ...card, status: 'ACTIVE' as const } : card
        ),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to unfreeze card',
        loading: false,
      });
      throw error;
    }
  },

  resetError: () => set({ error: null }),
}));
