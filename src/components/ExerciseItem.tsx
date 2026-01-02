import React from 'react';
import type { Exercise } from '../types';

interface ExerciseItemProps {
  exercise: Exercise;
  completed: boolean;
  onToggle: (id: number) => void;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({ exercise, completed, onToggle }) => {
  return (
    <div className={`border rounded-lg p-4 mb-3 transition-all duration-300 ${
      completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{exercise.name}</h3>
            <div className="flex items-center gap-2">
              {exercise.beginnerFriendly && (
                <span className="badge badge-beginner">Beginner</span>
              )}
              <button
                onClick={() => onToggle(exercise.id)}
                className={`size-6 rounded-full border-2 flex items-center justify-center ${
                  completed 
                    ? 'bg-green-500 border-green-500' 
                    : 'border-gray-300'
                }`}
                aria-label={completed ? 'Mark as incomplete' : 'Mark as complete'}
              >
                {completed && (
                  <svg className="size-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-sm text-gray-600">Sets</p>
              <p className="font-semibold">{exercise.sets}x</p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-sm text-gray-600">Reps/Duration</p>
              <p className="font-semibold">{exercise.reps}</p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-sm text-gray-600">Est. Time</p>
              <p className="font-semibold">{exercise.duration}</p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-sm text-gray-600">Intensity</p>
              <p className="font-semibold">
                {exercise.beginnerFriendly ? 'Low' : 'Medium'}
              </p>
            </div>
          </div>
          
          <div className="mt-3">
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <svg className="size-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              Tips:
            </p>
            <p className="text-sm mt-1">{exercise.tips}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseItem;