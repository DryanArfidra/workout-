import React from 'react';
import Card from '../common/Card';
import { 
  PlusIcon, 
  MinusIcon, 
  ArrowRightIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface QuickActionsKeuanganProps {
  onAddIncome: () => void;
  onAddExpense: () => void;
  onTransferToSaving: () => void;
  onViewHistory: () => void;
}

const QuickActionsKeuangan: React.FC<QuickActionsKeuanganProps> = ({
  onAddIncome,
  onAddExpense,
  onTransferToSaving,
  onViewHistory,
}) => {
  return (
    <Card title="Aksi Cepat">
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onAddIncome}
          className="p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-left"
        >
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <PlusIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 text-sm">Tambah Pemasukan</h4>
              <p className="text-xs text-gray-600">Catat pemasukan baru</p>
            </div>
          </div>
        </button>
        
        <button
          onClick={onAddExpense}
          className="p-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-left"
        >
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg mr-3">
              <MinusIcon className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 text-sm">Tambah Pengeluaran</h4>
              <p className="text-xs text-gray-600">Catat pengeluaran baru</p>
            </div>
          </div>
        </button>
        
        <button
          onClick={onTransferToSaving}
          className="p-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-left"
        >
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <ArrowRightIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 text-sm">Transfer Tabungan</h4>
              <p className="text-xs text-gray-600">Pindahkan ke tabungan</p>
            </div>
          </div>
        </button>
        
        <button
          onClick={onViewHistory}
          className="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-left"
        >
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg mr-3">
              <ChartBarIcon className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 text-sm">Riwayat</h4>
              <p className="text-xs text-gray-600">Lihat semua transaksi</p>
            </div>
          </div>
        </button>
      </div>
    </Card>
  );
};

export default QuickActionsKeuangan;