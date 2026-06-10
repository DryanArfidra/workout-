import React from 'react';
import Card from '../common/Card';
import { formatCurrency } from '../../utils/constants';
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  BanknotesIcon,
  ChartPieIcon
} from '@heroicons/react/24/outline';

interface StatisticsCardProps {
  totalIncome: number;
  totalExpense: number;
  totalSaving: number;
  savingPercentage: number;
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({
  totalIncome,
  totalExpense,
  totalSaving,
  savingPercentage,
}) => {
  const netSavings = totalIncome - totalExpense - totalSaving;
  
  return (
    <Card title="Statistik Bulan Ini">
      <div className="space-y-4">
        {/* Income */}
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <ArrowTrendingUpIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Pemasukan</p>
              <p className="text-lg font-bold text-green-700">
                {formatCurrency(totalIncome)}
              </p>
            </div>
          </div>
        </div>
        
        {/* Expense */}
        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg mr-3">
              <ArrowTrendingDownIcon className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Pengeluaran</p>
              <p className="text-lg font-bold text-red-700">
                {formatCurrency(totalExpense)}
              </p>
            </div>
          </div>
        </div>
        
        {/* Saving */}
        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <BanknotesIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Tabungan</p>
              <p className="text-lg font-bold text-purple-700">
                {formatCurrency(totalSaving)}
              </p>
            </div>
          </div>
        </div>
        
        {/* Saving Percentage */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <ChartPieIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Persentase Tabungan</p>
              <p className="text-lg font-bold text-blue-700">
                {Math.round(savingPercentage)}%
              </p>
              <p className="text-xs text-gray-500">
                dari total pemasukan
              </p>
            </div>
          </div>
        </div>
        
        {/* Net after all */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Sisa Saldo Aktif</span>
            <span className={`text-xl font-bold ${netSavings >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {formatCurrency(netSavings)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StatisticsCard;