import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Trophy, Clock, Target, Brain } from 'lucide-react';
import { calculateQuizStats, getQuizAttempts } from '../utils/storage';
import type { QuizStats, QuizAttempt } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  const [stats, setStats] = useState<QuizStats>({
    totalQuizzes: 0,
    averageScore: 0,
    totalQuestionsAnswered: 0,
    totalTimeSpent: 0,
    quizzesByTopic: {},
    accuracyByTopic: {},
    recentScores: []
  });

  const [recentAttempts, setRecentAttempts] = useState<QuizAttempt[]>([]);

  useEffect(() => {
    const quizStats = calculateQuizStats();
    setStats(quizStats);

    const attempts = getQuizAttempts();
    setRecentAttempts(attempts.slice(-5));
  }, []);

  const accuracyData = {
    labels: stats.recentScores.map((_, i) => `Quiz ${i + 1}`),
    datasets: [
      {
        label: 'Score',
        data: stats.recentScores,
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.1,
      },
    ],
  };

  const topicsData = {
    labels: Object.keys(stats.quizzesByTopic),
    datasets: [
      {
        data: Object.values(stats.quizzesByTopic),
        backgroundColor: [
          'rgb(59, 130, 246)',
          'rgb(147, 51, 234)',
          'rgb(236, 72, 153)',
          'rgb(34, 197, 94)',
        ],
      },
    ],
  };

  const strengthsData = {
    labels: Object.keys(stats.accuracyByTopic),
    datasets: [
      {
        label: 'Accuracy %',
        data: Object.values(stats.accuracyByTopic),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
    ],
  };

  const minutes = Math.floor(stats.totalTimeSpent / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  const statCards = [
    { 
      icon: <Trophy className="h-8 w-8" />, 
      label: 'Average Score', 
      value: `${stats.averageScore}%` 
    },
    { 
      icon: <Clock className="h-8 w-8" />, 
      label: 'Time Spent', 
      value: `${hours}h ${remainingMinutes}m` 
    },
    { 
      icon: <Target className="h-8 w-8" />, 
      label: 'Questions Answered', 
      value: stats.totalQuestionsAnswered.toString() 
    },
    { 
      icon: <Brain className="h-8 w-8" />, 
      label: 'Quizzes Taken', 
      value: stats.totalQuizzes.toString() 
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Performance Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-lg flex items-center space-x-4"
          >
            <div className="text-blue-600">{stat.icon}</div>
            <div>
              <p className="text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Trend */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Score Trend</h3>
          <Line
            data={accuracyData}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                },
              },
            }}
          />
        </div>

        {/* Topic Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Topic Distribution</h3>
          <div className="aspect-square">
            <Pie
              data={topicsData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Strengths Analysis */}
        <div className="bg-white rounded-xl p-6 shadow-lg col-span-full">
          <h3 className="text-xl font-semibold mb-4">Performance by Topic</h3>
          <Bar
            data={strengthsData}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                },
              },
            }}
          />
        </div>
      </div>

      {/* Recent Attempts */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Recent Attempts</h3>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="pb-4">Quiz Title</th>
              <th className="pb-4">Score</th>
              <th className="pb-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentAttempts.map((attempt) => (
              <tr key={attempt.id} className="border-t">
                <td className="py-4">{attempt.title}</td>
                <td className="py-4">{attempt.score}%</td>
                <td className="py-4">{new Date(attempt.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}