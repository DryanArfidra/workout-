import React, { useState, useEffect } from 'react';
import { motivationalQuotes } from '../data/workouts';

interface HomeProps {
  onStartWorkout: () => void;
  weeklyProgress: number;
}

const Home: React.FC<HomeProps> = ({ onStartWorkout, weeklyProgress }) => {
  const [currentQuote, setCurrentQuote] = useState('');
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // Random quote on load
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setCurrentQuote(randomQuote);
    
    // Simulate streak from localStorage (if existed)
    const savedStreak = localStorage.getItem('workout-streak');
    if (savedStreak) {
      setStreak(parseInt(savedStreak));
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Transform Your Body at Home
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          No equipment needed • 10-20 minutes daily • Perfect for beginners
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-2xl p-8 card-shadow">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Weekly Progress</h2>
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">This Week</span>
              <span className="font-bold text-primary-500">{Math.round(weeklyProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="h-4 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-1000"
                style={{ width: `${weeklyProgress}%` }}
              ></div>
            </div>
          </div>
          
          {streak > 0 && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="bg-yellow-500 text-white rounded-full size-10 flex items-center justify-center mr-3">
                  <span className="font-bold">{streak}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">🔥 Consistency Streak!</p>
                  <p className="text-sm text-gray-600">You've worked out for {streak} consecutive days!</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl p-8 text-white card-shadow">
          <h2 className="text-2xl font-bold mb-4">Today's Motivation</h2>
          <div className="mb-6">
            <p className="text-lg italic">"{currentQuote}"</p>
          </div>
          <div className="glass-effect rounded-lg p-4">
            <p className="font-semibold mb-2">Daily Goal:</p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <div className="size-2 bg-green-400 rounded-full mr-2"></div>
                Complete today's workout (10-20 min)
              </li>
              <li className="flex items-center">
                <div className="size-2 bg-blue-400 rounded-full mr-2"></div>
                Maintain proper form in all exercises
              </li>
              <li className="flex items-center">
                <div className="size-2 bg-accent-500 rounded-full mr-2"></div>
                Drink plenty of water throughout
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <button
          onClick={onStartWorkout}
          className="btn-primary text-lg px-8 py-4 text-xl"
        >
          Start Today's Workout
        </button>
        
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border">
            <p className="text-2xl font-bold text-primary-500">7</p>
            <p className="text-gray-600">Days Program</p>
          </div>
          <div className="bg-white p-4 rounded-xl border">
            <p className="text-2xl font-bold text-primary-500">10-20</p>
            <p className="text-gray-600">Minutes/Day</p>
          </div>
          <div className="bg-white p-4 rounded-xl border">
            <p className="text-2xl font-bold text-primary-500">0</p>
            <p className="text-gray-600">Equipment Needed</p>
          </div>
          <div className="bg-white p-4 rounded-xl border">
            <p className="text-2xl font-bold text-primary-500">25+</p>
            <p className="text-gray-600">Exercises</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;