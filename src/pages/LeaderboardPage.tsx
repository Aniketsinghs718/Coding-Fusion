import React, { useEffect, useState } from 'react';
import { getQuizAttempts } from '../utils/storage';
import type { QuizAttempt } from '../types';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<QuizAttempt[]>([]);

  useEffect(() => {
    const attempts = getQuizAttempts();
    const sortedAttempts = attempts.sort((a, b) => b.score - a.score);
    setLeaderboard(sortedAttempts);
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Leaderboard</h1>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="pb-4">Rank</th>
              <th className="pb-4">User</th>
              <th className="pb-4">Quiz Title</th>
              <th className="pb-4">Score</th>
              <th className="pb-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((attempt, index) => (
              <tr key={attempt.id} className="border-t">
                <td className="py-4">{index + 1}</td>
                <td className="py-4">User {index + 1}</td>
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