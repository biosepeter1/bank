import React, { useState } from 'react';
import { CreditCard, Plus, Freeze, LockOpen, Trash2, Eye, EyeOff } from 'lucide-react';
import { useCardStore } from '@/stores/cardStore';

export const VirtualCardsPage: React.FC = () => {
  const { cards = [], loading } = useCardStore();
  const [showCardForm, setShowCardForm] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [showCardNumber, setShowCardNumber] = useState<Record<string, boolean>>({});

  const virtualCards = cards.filter((card) => card.type === 'VIRTUAL');
  const physicalCards = cards.filter((card) => card.type === 'PHYSICAL');

  const CardPreview: React.FC<{ card: any; onSelect: () => void }> = ({ card, onSelect }) => (
    <div
      onClick={onSelect}
      className={`relative h-48 rounded-lg cursor-pointer transition transform hover:scale-105 ${
        card.status === 'ACTIVE'
          ? 'bg-gradient-to-r from-blue-500 to-blue-600'
          : 'bg-gray-400'
      } p-6 text-white shadow-lg`}
    >
      <div className="absolute top-4 right-4">
        <div className="text-xs font-semibold opacity-70">VISA</div>
      </div>

      <div className="absolute bottom-4 left-4 right-4 space-y-4">
        <div>
          <p className="text-xs opacity-70 mb-1">Card Number</p>
          <div className="flex items-center gap-2">
            <p className="text-lg font-mono font-bold tracking-widest">
              {showCardNumber[card.id] ? card.cardNumber : `•••• •••• •••• ${card.cardNumber.slice(-4)}`}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowCardNumber((prev) => ({
                  ...prev,
                  [card.id]: !prev[card.id],
                }));
              }}
              className="p-1 hover:bg-white/20 rounded"
            >
              {showCardNumber[card.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs opacity-70">Card Holder</p>
            <p className="font-semibold text-sm">{card.holderName}</p>
          </div>
          <div>
            <p className="text-xs opacity-70">Expires</p>
            <p className="font-semibold text-sm">{card.expiryDate}</p>
          </div>
        </div>
      </div>

      {card.status === 'FROZEN' && (
        <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
          <Freeze className="w-8 h-8 text-white" />
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Cards</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your virtual and physical cards</p>
        </div>
        <button
          onClick={() => setShowCardForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
          Request Card
        </button>
      </div>

      {/* Virtual Cards */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Virtual Cards ({virtualCards.length})</h2>
        {virtualCards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {virtualCards.map((card) => (
              <CardPreview
                key={card.id}
                card={card}
                onSelect={() => setSelectedCard(card.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No virtual cards yet</p>
            <button
              onClick={() => setShowCardForm(true)}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Request Virtual Card
            </button>
          </div>
        )}
      </div>

      {/* Physical Cards */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Physical Cards ({physicalCards.length})</h2>
        {physicalCards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {physicalCards.map((card) => (
              <CardPreview
                key={card.id}
                card={card}
                onSelect={() => setSelectedCard(card.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No physical cards yet</p>
            <button
              onClick={() => setShowCardForm(true)}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Request Physical Card
            </button>
          </div>
        )}
      </div>

      {/* Selected Card Actions */}
      {selectedCard && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Card Options</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition">
              <Freeze className="w-6 h-6 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Freeze Card</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg transition">
              <LockOpen className="w-6 h-6 text-green-600" />
              <span className="text-sm font-medium text-green-600">Unfreeze</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 rounded-lg transition">
              <CreditCard className="w-6 h-6 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">Limits</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition">
              <Trash2 className="w-6 h-6 text-red-600" />
              <span className="text-sm font-medium text-red-600">Delete</span>
            </button>
          </div>
        </div>
      )}

      {/* Card Request Form Modal */}
      {showCardForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Request New Card</h3>
              <button
                onClick={() => setShowCardForm(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Card Type
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  <option>Virtual Card (Instant)</option>
                  <option>Physical Card (7-10 days)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Card Provider
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  <option>Visa</option>
                  <option>Mastercard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Monthly Limit (NGN)
                </label>
                <input
                  type="number"
                  placeholder="500,000"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition">
                Request Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
