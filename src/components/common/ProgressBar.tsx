import React from 'react';

interface ProgressBarProps {
  progress: number;
  color?: 'emerald' | 'blue' | 'amber' | 'purple';
  height?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  labelPosition?: 'inside' | 'outside';
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = 'emerald',
  height = 'md',
  showLabel = false,
  labelPosition = 'outside',
}) => {
  const heightClass = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  }[height];

  const colorClasses = {
    emerald: 'bg-emerald-600',
    blue: 'bg-blue-600',
    amber: 'bg-amber-600',
    purple: 'bg-purple-600',
  };

  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const percentage = Math.round(clampedProgress);

  return (
    <div className="w-full">
      {showLabel && labelPosition === 'outside' && (
        <div className="flex justify-between mb-1">
          <span className="text-sm text-gray-600">Progress</span>
          <span className="text-sm font-medium text-gray-700">{percentage}%</span>
        </div>
      )}
      
      <div className={`w-full bg-gray-200 rounded-full ${heightClass} overflow-hidden`}>
        <div
          className={`${colorClasses[color]} ${heightClass} rounded-full transition-all duration-300 flex items-center justify-center`}
          style={{ width: `${clampedProgress}%` }}
        >
          {showLabel && labelPosition === 'inside' && clampedProgress > 20 && (
            <span className="text-xs font-semibold text-white">
              {percentage}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;