import React from 'react';
import type { WorkoutDay } from '../types';
import ExerciseItem from './ExerciseItem';

interface WorkoutCardProps {
  workout: WorkoutDay;
  onExerciseToggle: (exerciseId: number) => void;
  completedExercises: number[];
  onDayComplete: () => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({
  workout,
  onExerciseToggle,
  completedExercises,
  onDayComplete
}) => {
  const totalExercises = workout.exercises.length;
  const completedCount = completedExercises.length;
  const progress = totalExercises > 0 ? (completedCount / totalExercises) * 100 : 0;
  const isAllCompleted = completedCount === totalExercises && totalExercises > 0;

  const getStatus = () => {
    if (isAllCompleted) return 'Done';
    if (completedCount > 0) return 'In Progress';
    return 'Not Started';
  };

  return (
    <div className={`card-shadow rounded-xl overflow-hidden border ${
      workout.isSunday 
        ? 'border-red-300 bg-gradient-to-br from-red-50 to-orange-50' 
        : 'border-gray-200 bg-white'
    }`}>
      <div className={`p-5 ${
        workout.isSunday 
          ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white' 
          : 'bg-gradient-to-r from-primary to-secondary text-white'
      }`}>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{workout.day}</h2>
            <p className="text-lg opacity-90">{workout.title}</p>
          </div>
          <div className="text-right">
            {workout.isSunday && (
              <span className="badge badge-extra bg-white text-red-600 font-bold mb-2">
                🔥 Extra Workout Day
              </span>
            )}
            <p className="text-xl font-bold">{workout.duration}</p>
            <p className="text-sm opacity-90">Target: {workout.targetDuration.min}-{workout.targetDuration.max} min</p>
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Progress</span>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              getStatus() === 'Done' 
                ? 'bg-green-100 text-green-800'
                : getStatus() === 'In Progress'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {getStatus()}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="h-2.5 rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1 text-sm text-gray-600">
            <span>{completedCount}/{totalExercises} exercises</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Today's Exercises:</h3>
          <div className="space-y-3">
            {workout.exercises.map(exercise => (
              <ExerciseItem
                key={exercise.id}
                exercise={exercise}
                completed={completedExercises.includes(exercise.id)}
                onToggle={onExerciseToggle}
              />
            ))}
          </div>
        </div>
        
        <button
          onClick={onDayComplete}
          disabled={!isAllCompleted}
          className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
            isAllCompleted
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transform hover:scale-[1.02]'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isAllCompleted ? (
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Complete Day {workout.day}
            </div>
          ) : (
            `Complete all exercises to finish ${workout.day}`
          )}
        </button>
        
        {workout.isSunday && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-semibold flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
              Sunday Challenge: Complete all exercises for maximum results!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutCard;