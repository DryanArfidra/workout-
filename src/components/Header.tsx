import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-6 px-4 shadow-lg text-shadow">
      <div className="container mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Daily Home Workout</h1>
        <p className="text-lg opacity-90">Transform your body with 10-20 minutes daily</p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center">
            <div className="size-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm">Height: 168cm</span>
          </div>
          <div className="flex items-center">
            <div className="size-3 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm">Weight: 75kg</span>
          </div>
          <div className="flex items-center">
            <div className="size-3 bg-accent-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm">Goal: Fat Loss + Muscle</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;