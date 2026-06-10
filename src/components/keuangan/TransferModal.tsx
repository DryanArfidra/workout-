import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '../../utils/constants';

interface TransferModalProps {
  onClose: () => void;
  onSubmit: (amount: number, description: string) => void;
  isLoading?: boolean;
  currentBalance: number;
}

const TransferModal: React.FC<TransferModalProps> = ({
  onClose,
  onSubmit,
  isLoading = false,
  currentBalance,
}) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Nominal harus lebih dari 0');
      return;
    }
    
    if (numAmount > currentBalance) {
      alert(`Saldo tidak mencukupi. Saldo utama Anda: ${formatCurrency(currentBalance)}`);
      return;
    }
    
    if (!description.trim()) {
      alert('Keterangan wajib diisi');
      return;
    }
    
    onSubmit(numAmount, description.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="max-w-md w-full">
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">
              Transfer ke Tabungan
            </h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Saldo Utama Saat Ini</p>
            <p className="text-xl font-bold text-gray-800">{formatCurrency(currentBalance)}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Nominal Transfer</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                  Rp
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                  placeholder="0"
                  required
                  min="1"
                  max={currentBalance}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Keterangan</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Contoh: Tabungan bulanan"
                required
              />
            </div>
            
            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={isLoading}
              >
                Transfer
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
              >
                Batal
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default TransferModal;