import { useState, useEffect } from 'react';
import { QuizAttempt, QuizStats } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function StatsPage() {
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [stats, setStats] = useState<QuizStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load quiz attempts from localStorage
    const loadStats = () => {
      setLoading(true);
      try {
        const savedAttempts = localStorage.getItem('quizAttempts');
        if (savedAttempts) {
          const attempts = JSON.parse(savedAttempts) as QuizAttempt[];
          setQuizAttempts(attempts);
          
          // Calculate statistics
          if (attempts.length > 0) {
            const stats = calculateStats(attempts);
            setStats(stats);
          }
        }
      } catch (error) {
        console.error('Error loading quiz attempts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const calculateStats = (attempts: QuizAttempt[]): QuizStats => {
    // Total quizzes taken
    const totalQuizzes = attempts.length;
    
    // Average score across all attempts
    const totalScore = attempts.reduce((sum, attempt) => sum + attempt.score, 0);
    const averageScore = totalQuizzes > 0 ? Math.round((totalScore / totalQuizzes) * 100) / 100 : 0;
    
    // Total questions answered
    const totalQuestionsAnswered = attempts.reduce((sum, attempt) => sum + attempt.totalQuestions, 0);
    
    // Total time spent (in seconds)
    const totalTimeSpent = attempts.reduce((sum, attempt) => sum + attempt.timeSpent, 0);
    
    // Quizzes by topic (using quiz title as topic)
    const quizzesByTopic: Record<string, number> = {};
    attempts.forEach(attempt => {
      quizzesByTopic[attempt.title] = (quizzesByTopic[attempt.title] || 0) + 1;
    });
    
    // Accuracy by topic
    const accuracyByTopic: Record<string, number> = {};
    const topicCorrectAnswers: Record<string, number> = {};
    const topicTotalQuestions: Record<string, number> = {};
    
    attempts.forEach(attempt => {
      const title = attempt.title;
      topicCorrectAnswers[title] = (topicCorrectAnswers[title] || 0) + attempt.correctAnswers;
      topicTotalQuestions[title] = (topicTotalQuestions[title] || 0) + attempt.totalQuestions;
    });
    
    Object.keys(topicCorrectAnswers).forEach(topic => {
      accuracyByTopic[topic] = Math.round((topicCorrectAnswers[topic] / topicTotalQuestions[topic]) * 100);
    });
    
    // Recent scores (last 5 attempts)
    const recentScores = attempts
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
      .map(attempt => attempt.score * 100);
    
    return {
      totalQuizzes,
      averageScore,
      totalQuestionsAnswered,
      totalTimeSpent,
      quizzesByTopic,
      accuracyByTopic,
      recentScores
    };
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  // Prepare data for charts
  const prepareTopicData = () => {
    if (!stats) return [];
    
    return Object.keys(stats.accuracyByTopic).map(topic => ({
      name: topic,
      accuracy: stats.accuracyByTopic[topic],
      attempts: stats.quizzesByTopic[topic]
    }));
  };

  const prepareRecentScoresData = () => {
    if (!stats) return [];
    
    return stats.recentScores.map((score, index) => ({
      name: `Attempt ${index + 1}`,
      score
    })).reverse();
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Quiz Statistics</h1>
        <div className="bg-white rounded-xl p-8 text-center shadow-lg">
          <p className="text-gray-600 mb-4">You haven't taken any quizzes yet.</p>
          <p className="text-gray-600">Complete some quizzes to see your statistics here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Quiz Statistics</h1>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Quizzes Taken</h3>
          <p className="text-3xl font-bold">{stats.totalQuizzes}</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Average Score</h3>
          <p className="text-3xl font-bold">{stats.averageScore}%</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Questions Answered</h3>
          <p className="text-3xl font-bold">{stats.totalQuestionsAnswered}</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Time</h3>
          <p className="text-3xl font-bold">{formatTime(stats.totalTimeSpent)}</p>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Recent Scores Chart */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">Recent Quiz Scores</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={prepareRecentScoresData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                <Legend />
                <Bar dataKey="score" fill="#3B82F6" name="Score (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Topic Accuracy Chart */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">Accuracy by Topic</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={Object.keys(stats.accuracyByTopic).map((key, index) => ({
                    name: key,
                    value: stats.accuracyByTopic[key]
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {Object.keys(stats.accuracyByTopic).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Accuracy']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Recent Attempts Table */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Recent Quiz Attempts</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Spent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Questions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {quizAttempts
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 10)
                .map((attempt, index) => (
                  <tr key={attempt.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{attempt.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(attempt.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {Math.round(attempt.score * 100)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTime(attempt.timeSpent)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {attempt.correctAnswers} / {attempt.totalQuestions}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 