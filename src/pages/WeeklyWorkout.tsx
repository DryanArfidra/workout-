import React, { useState, useEffect } from 'react';
import WorkoutCard from '../components/WorkoutCard';
import Timer from '../components/Timer';
import { workoutData } from '../data/workouts';
import type { WorkoutDay } from '../types';

const WeeklyWorkout: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<WorkoutDay>(workoutData[0]);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [completedExercises, setCompletedExercises] = useState<Record<number, number[]>>({});

  // Initialize completed exercises from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('workout-progress');
    if (savedData) {
      const data = JSON.parse(savedData);
      setCompletedDays(data.completedDays || []);
      setCompletedExercises(data.completedExercises || {});
    }
  }, []);

  const handleDaySelect = (day: WorkoutDay) => {
    setSelectedDay(day);
  };

  const handleExerciseToggle = (exerciseId: number) => {
    setCompletedExercises(prev => {
      const dayExercises = prev[selectedDay.id] || [];
      const newExercises = dayExercises.includes(exerciseId)
        ? dayExercises.filter(id => id !== exerciseId)
        : [...dayExercises, exerciseId];
      
      const updated = { ...prev, [selectedDay.id]: newExercises };
      
      // Save to localStorage
      saveProgress(completedDays, updated);
      
      return updated;
    });
  };

  const handleDayComplete = () => {
    if (!completedDays.includes(selectedDay.id)) {
      const newCompletedDays = [...completedDays, selectedDay.id];
      setCompletedDays(newCompletedDays);
      
      // Save to localStorage
      saveProgress(newCompletedDays, completedExercises);
      
      // Update streak
      updateStreak();
    }
  };

  const saveProgress = (days: number[], exercises: Record<number, number[]>) => {
    const progressData = { completedDays: days, completedExercises: exercises };
    localStorage.setItem('workout-progress', JSON.stringify(progressData));
  };

  const updateStreak = () => {
    const streak = parseInt(localStorage.getItem('workout-streak') || '0');
    localStorage.setItem('workout-streak', (streak + 1).toString());
  };

  const calculateWeeklyProgress = () => {
    const totalExercises = workoutData.reduce((sum, day) => sum + day.exercises.length, 0);
    const completedTotal = Object.values(completedExercises).reduce((sum, arr) => sum + arr.length, 0);
    return totalExercises > 0 ? (completedTotal / totalExercises) * 100 : 0;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Weekly Workout Plan</h1>
        <p className="text-gray-600">Complete daily workouts to build consistency</p>
        
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-800">Weekly Progress</p>
              <p className="text-sm text-gray-600">Complete exercises to fill the bar</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                {Math.round(calculateWeeklyProgress())}%
              </p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="h-2.5 rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
              style={{ width: `${calculateWeeklyProgress()}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <WorkoutCard
            workout={selectedDay}
            onExerciseToggle={handleExerciseToggle}
            completedExercises={completedExercises[selectedDay.id] || []}
            onDayComplete={handleDayComplete}
          />
          
          {selectedDay.isSunday && (
            <div className="mt-6 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-4 rounded">
              <h3 className="font-bold text-red-700 text-lg mb-2">🔥 Sunday Special Notes</h3>
              <ul className="space-y-1 text-red-600">
                <li>• This is your most intense workout of the week</li>
                <li>• Take 60-90 seconds rest between sets</li>
                <li>• Stay hydrated and listen to your body</li>
                <li>• If needed, reduce reps but maintain form</li>
              </ul>
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-xl border p-5 card-shadow">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Week Schedule</h3>
            <div className="space-y-3">
              {workoutData.map(day => (
                <button
                  key={day.id}
                  onClick={() => handleDaySelect(day)}
                  className={`w-full text-left p-4 rounded-lg transition-all duration-300 ${
                    selectedDay.id === day.id
                      ? day.isSunday
                        ? 'bg-red-100 border-2 border-red-300'
                        : 'bg-blue-100 border-2 border-primary'
                      : completedDays.includes(day.id)
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-lg">{day.day}</div>
                      <div className="text-sm text-gray-600">{day.title}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{day.duration}</div>
                      <div className="flex items-center justify-end mt-1">
                        {completedDays.includes(day.id) ? (
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                            ✓ Done
                          </span>
                        ) : (
                          <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                            {day.isSunday ? '🔥' : '○'} Pending
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <Timer initialMinutes={selectedDay.targetDuration.min} />
          
          <div className="bg-white rounded-xl border p-5 card-shadow">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Completed Days</span>
                <span className="font-bold">{completedDays.length}/7</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Exercises Done</span>
                <span className="font-bold">
                  {Object.values(completedExercises).reduce((sum, arr) => sum + arr.length, 0)}/25
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">This Day Progress</span>
                <span className="font-bold">
                  {completedExercises[selectedDay.id]?.length || 0}/{selectedDay.exercises.length}
                </span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-semibold text-gray-800 mb-2">Tips for Success:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 mr-2"></div>
                  Warm up for 3-5 minutes before starting
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 mr-2"></div>
                  Focus on form over speed
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 mr-2"></div>
                  Rest 30-60 seconds between sets
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 mr-2"></div>
                  Stay consistent for best results
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyWorkout;