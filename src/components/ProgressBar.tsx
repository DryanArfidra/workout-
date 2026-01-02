import React from 'react';

interface ProgressBarProps {
  progress: number;
  status: 'Not Started' | 'In Progress' | 'Done';
  day: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, status, day }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'Done': return 'bg-green-500';
      case 'In Progress': return 'bg-yellow-500';
      default: return 'bg-gray-300';
    }
  };

  const getStatusTextColor = () => {
    switch (status) {
      case 'Done': return 'text-green-700';
      case 'In Progress': return 'text-yellow-700';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium">{day}</span>
        <span className={`text-sm font-semibold ${getStatusTextColor()}`}>
          {status}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all duration-500 ${getStatusColor()}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="text-right mt-1">
        <span className="text-sm text-gray-600">{progress}% complete</span>
      </div>
    </div>
  );
};

export default ProgressBar;