import React, { useState } from 'react';
import Card from '../common/Card';
import ProgressBar from '../common/ProgressBar';
import Button from '../common/Button';
import { PencilIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '../../utils/constants';

interface SavingTargetCardProps {
  currentSaving: number;
  target: number;
  onUpdateTarget: (newTarget: number) => void;
}

const SavingTargetCard: React.FC<SavingTargetCardProps> = ({
  currentSaving,
  target,
  onUpdateTarget,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTarget, setNewTarget] = useState(target.toString());
  
  const progress = target > 0 ? (currentSaving / target) * 100 : 0;
  const remaining = Math.max(0, target - currentSaving);
  
  const handleSubmit = () => {
    const numTarget = parseFloat(newTarget);
    if (numTarget > 0) {
      onUpdateTarget(numTarget);
      setIsEditing(false);
    } else {
      alert('Target harus lebih dari 0');
    }
  };
  
  return (
    <Card>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Target Tabungan</h3>
          {!isEditing && (
            <p className="text-2xl font-bold text-purple-700 mt-1">
              {formatCurrency(target)}
            </p>
          )}
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <PencilIcon className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      
      {isEditing ? (
        <div className="space-y-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
              Rp
            </span>
            <input
              type="number"
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Target baru"
              min="1"
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              variant="primary"
              size="sm"
              fullWidth
            >
              Simpan
            </Button>
            <Button
              onClick={() => setIsEditing(false)}
              variant="ghost"
              size="sm"
            >
              Batal
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Progress</span>
              <span className="text-sm font-bold text-purple-700">
                {Math.round(progress)}%
              </span>
            </div>
            <ProgressBar progress={progress} color="purple" height="lg" />
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-600">Terkumpul</div>
              <div className="font-semibold text-purple-700 text-right">
                {formatCurrency(currentSaving)}
              </div>
              
              <div className="text-gray-600">Kekurangan</div>
              <div className="font-semibold text-orange-600 text-right">
                {formatCurrency(remaining)}
              </div>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

export default SavingTargetCard;