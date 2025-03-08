import { QuizAttempt, QuizStats } from '../types';

const STORAGE_KEY = 'quizmaster_attempts';

export function saveQuizAttempt(attempt: QuizAttempt): void {
  const attempts = getQuizAttempts();
  attempts.push(attempt);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts));
}

export function getQuizAttempts(): QuizAttempt[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function calculateQuizStats(): QuizStats {
  const attempts = getQuizAttempts();
  
  if (attempts.length === 0) {
    return {
      totalQuizzes: 0,
      averageScore: 0,
      totalQuestionsAnswered: 0,
      totalTimeSpent: 0,
      quizzesByTopic: {},
      accuracyByTopic: {},
      recentScores: []
    };
  }

  const topics = {
    '1': 'General Knowledge',
    '2': 'Science'
  };

  const topicAttempts: Record<string, { total: number; correct: number }> = {};
  let totalScore = 0;
  let totalQuestions = 0;
  let totalTime = 0;

  attempts.forEach(attempt => {
    totalScore += attempt.score;
    totalQuestions += attempt.totalQuestions;
    totalTime += attempt.timeSpent;

    const topic = topics[attempt.quizId] || 'Other';
    if (!topicAttempts[topic]) {
      topicAttempts[topic] = { total: 0, correct: 0 };
    }
    topicAttempts[topic].total += attempt.totalQuestions;
    topicAttempts[topic].correct += attempt.correctAnswers;
  });

  const quizzesByTopic: Record<string, number> = {};
  const accuracyByTopic: Record<string, number> = {};

  Object.entries(topicAttempts).forEach(([topic, data]) => {
    quizzesByTopic[topic] = data.total;
    accuracyByTopic[topic] = Math.round((data.correct / data.total) * 100);
  });

  return {
    totalQuizzes: attempts.length,
    averageScore: Math.round(totalScore / attempts.length),
    totalQuestionsAnswered: totalQuestions,
    totalTimeSpent: totalTime,
    quizzesByTopic,
    accuracyByTopic,
    recentScores: attempts.slice(-6).map(a => a.score)
  };
}