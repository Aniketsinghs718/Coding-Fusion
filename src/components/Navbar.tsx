import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, BarChart2, Upload, List, Edit, Home, BookOpen, Youtube } from 'lucide-react';

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
              to="/"
              className={`flex items-center px-3 py-2 rounded-md ${
                location.pathname === '/'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Home className="h-5 w-5 mr-1" />
              <span>Home</span>
            </Link>
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
              to="/custom-quiz"
              className={`flex items-center px-3 py-2 rounded-md ${
                location.pathname.includes('/custom-quiz')
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BookOpen className="h-5 w-5 mr-1" />
              <span>Create Quiz</span>
            </Link>
            <Link
              to="/leaderboard"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors hover:bg-white hover:bg-opacity-20 ${isActive('/leaderboard')}`}
            >
              <List className="h-5 w-5" />
              <span>Leaderboard</span>
            </Link>
            <Link
              to="/stats"
              className={`flex items-center px-3 py-2 rounded-md ${
                location.pathname === '/stats'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BarChart2 className="h-5 w-5 mr-1" />
              <span>Statistics</span>
            </Link>
            <Link
              to="/youtube-notes"
              className={`flex items-center px-3 py-2 rounded-md ${
                location.pathname === '/youtube-notes'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Youtube className="h-5 w-5 mr-1" />
              <span>YouTube Notes</span>
              <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-500 text-white rounded-full">Soon</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}