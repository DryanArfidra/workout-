import React, { useState, useEffect, useCallback } from 'react';

interface TimerProps {
  initialMinutes?: number;
  onComplete?: () => void;
}

const Timer: React.FC<TimerProps> = ({ initialMinutes = 10, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);

  const startTimer = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(initialMinutes * 60);
  }, [initialMinutes]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;


    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && onComplete) {
      onComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, onComplete]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Workout Timer</h3>
      
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <div className="size-48 rounded-full border-8 border-blue-200 flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-800">
                {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-gray-600 mt-2">Time Remaining</div>
            </div>
          </div>
          
          <div 
            className="absolute top-0 left-0 size-full rounded-full border-8 border-transparent"
            style={{
              borderTopColor: '#3b82f6',
              transform: `rotate(${(1 - timeLeft / (initialMinutes * 60)) * 360}deg)`,
              transition: 'transform 1s linear'
            }}
          ></div>
        </div>
      </div>
      
      <div className="flex justify-center gap-4">
        {!isRunning ? (
          <button
            onClick={startTimer}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Start
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Pause
          </button>
        )}
        
        <button
          onClick={resetTimer}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          Reset
        </button>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-600">
        <p>Set your workout duration: {initialMinutes} minutes</p>
      </div>
    </div>
  );
};

export default Timer;