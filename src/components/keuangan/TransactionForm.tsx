import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../utils/constants';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface TransactionFormProps {
  onClose: () => void;
  onSubmit: (data: {
    type: 'income' | 'expense';
    amount: number;
    category: string;
    description: string;
  }) => void;
  isLoading?: boolean;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Nominal harus lebih dari 0');
      return;
    }
    
    if (!description.trim()) {
      alert('Keterangan wajib diisi');
      return;
    }
    
    if (!category) {
      alert('Pilih kategori terlebih dahulu');
      return;
    }
    
    onSubmit({
      type,
      amount: numAmount,
      category,
      description: description.trim(),
    });
  };

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="max-w-md w-full">
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">
              Tambah {type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
            </h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Type Selector */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType('income')}
                className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                  type === 'income'
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Pemasukan
              </button>
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                  type === 'expense'
                    ? 'bg-red-100 text-red-700 border border-red-300'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Pengeluaran
              </button>
            </div>
            
            {/* Amount Input */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Nominal</label>
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
                />
              </div>
            </div>
            
            {/* Category Select */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">Pilih Kategori</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            {/* Description Input */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Keterangan</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Contoh: Belanja bulanan"
                required
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                variant={type === 'income' ? 'primary' : 'secondary'}
                fullWidth
                loading={isLoading}
              >
                Simpan
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

export default TransactionForm;