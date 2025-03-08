import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, BarChart2, Upload, List } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-white bg-opacity-20' : '';
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Brain className="h-8 w-8" />
            <span className="text-xl font-bold">QuizMaster Pro</span>
          </Link>
          
          <div className="flex space-x-4">
            <Link
              to="/dashboard"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors hover:bg-white hover:bg-opacity-20 ${isActive('/dashboard')}`}
            >
              <BarChart2 className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/upload"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors hover:bg-white hover:bg-opacity-20 ${isActive('/upload')}`}
            >
              <Upload className="h-5 w-5" />
              <span>Upload PDF</span>
            </Link>
            <Link
              to="/leaderboard"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors hover:bg-white hover:bg-opacity-20 ${isActive('/leaderboard')}`}
            >
              <List className="h-5 w-5" />
              <span>Leaderboard</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}