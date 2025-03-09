export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  timeLimit?: number;
  image?: string;
  questionCount?: number;
  time?: string;
}

export interface UserAnswer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeSpent: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  title: string;
  date: string;
  score: number;
  timeSpent: number;
  correctAnswers: number;
  totalQuestions: number;
  answers: UserAnswer[];
}

export interface QuizStats {
  totalQuizzes: number;
  averageScore: number;
  totalQuestionsAnswered: number;
  totalTimeSpent: number;
  quizzesByTopic: Record<string, number>;
  accuracyByTopic: Record<string, number>;
  recentScores: number[];
}