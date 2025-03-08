import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, AlertCircle } from 'lucide-react';
import type { Question, UserAnswer } from '../types';

interface QuizCardProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  selectedAnswer?: number;
  onAnswer: (answer: UserAnswer) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function QuizCard({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  onAnswer,
  onNext,
  onPrevious,
}: QuizCardProps) {
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTimeSpent(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setTimeSpent(0);
    setShowExplanation(false);
  }, [question.id]);

  const handleAnswerSelect = (index: number) => {
    onAnswer({
      questionId: question.id,
      selectedAnswer: index,
      isCorrect: index === question.correctAnswer,
      timeSpent,
    });
    setShowExplanation(true);
  };

  const getOptionClass = (index: number) => {
    if (selectedAnswer === undefined) return 'hover:bg-blue-50 cursor-pointer';
    if (index === question.correctAnswer) return 'bg-green-100 border-green-500';
    if (index === selectedAnswer) return 'bg-red-100 border-red-500';
    return 'opacity-50';
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-6 space-y-6">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question Header */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>Question {currentIndex + 1}/{totalQuestions}</span>
        <div className="flex items-center gap-2">
          <Clock size={16} />
          <span>{Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}</span>
        </div>
      </div>

      {/* Question Text */}
      <h2 className="text-xl font-semibold text-gray-800">{question.text}</h2>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(index)}
            disabled={selectedAnswer !== undefined}
            className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-300 ${getOptionClass(index)}`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <AlertCircle className="text-blue-500 mt-1" size={20} />
            <div>
              <h3 className="font-semibold text-blue-900">Explanation</h3>
              <p className="text-blue-800">{question.explanation}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowExplanation(false);
              onNext();
            }}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Next Question
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onPrevious}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 disabled:opacity-50"
        >
          <ChevronLeft size={20} />
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={currentIndex === totalQuestions - 1 || !showExplanation}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 disabled:opacity-50"
        >
          Next
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}