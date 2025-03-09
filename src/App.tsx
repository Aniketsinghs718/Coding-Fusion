import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import DashboardPage from './pages/DashboardPage';
import PDFUploadPage from './pages/PDFUploadPage';
import LeaderboardPage from './pages/LeaderboardPage';
import CustomQuizPage from './pages/CustomQuizPage';
import StatsPage from './pages/StatsPage';
import ImportHelpPage from './pages/ImportHelpPage';
import ComingSoonPage from './pages/ComingSoonPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quiz/:id" element={<QuizPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/upload" element={<PDFUploadPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/custom-quiz" element={<CustomQuizPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/import-help" element={<ImportHelpPage />} />
            <Route path="/youtube-notes" element={<ComingSoonPage />} />
          </Routes>
        </main>
        <Toaster position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;