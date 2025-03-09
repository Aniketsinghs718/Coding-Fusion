import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Question, Quiz } from '../types';
import CustomQuestionForm from '../components/CustomQuestionForm';
import { Link } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';

const CustomQuizPage: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [isCreatingQuiz, setIsCreatingQuiz] = useState(false);
  const [newQuizTitle, setNewQuizTitle] = useState('');
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Load quizzes from localStorage on component mount
  useEffect(() => {
    const savedQuizzes = localStorage.getItem('customQuizzes');
    if (savedQuizzes) {
      setQuizzes(JSON.parse(savedQuizzes));
    }
  }, []);

  // Save quizzes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('customQuizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  const handleCreateQuiz = () => {
    if (!newQuizTitle.trim()) {
      return;
    }

    const newQuiz: Quiz = {
      id: uuidv4(),
      title: newQuizTitle.trim(),
      questions: [],
    };

    // Add to custom quizzes
    const updatedQuizzes = [...quizzes, newQuiz];
    setQuizzes(updatedQuizzes);
    setCurrentQuiz(newQuiz);
    setIsCreatingQuiz(false);
    setNewQuizTitle('');
    
    // Save to localStorage
    localStorage.setItem('customQuizzes', JSON.stringify(updatedQuizzes));
    
    // Also add to main quizzes list
    const existingQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    localStorage.setItem('quizzes', JSON.stringify([...existingQuizzes, newQuiz]));
  };

  const handleSaveQuestion = (question: Question) => {
    if (!currentQuiz) return;

    let updatedQuestions: Question[];

    if (editingQuestionIndex !== null) {
      // Edit existing question
      updatedQuestions = [...currentQuiz.questions];
      updatedQuestions[editingQuestionIndex] = question;
    } else {
      // Add new question
      updatedQuestions = [...currentQuiz.questions, question];
    }

    const updatedQuiz = {
      ...currentQuiz,
      questions: updatedQuestions,
    };

    setCurrentQuiz(updatedQuiz);
    
    // Update the quiz in the custom quizzes array
    const updatedQuizzes = quizzes.map(quiz => 
      quiz.id === updatedQuiz.id ? updatedQuiz : quiz
    );
    
    setQuizzes(updatedQuizzes);
    
    // Save to localStorage
    localStorage.setItem('customQuizzes', JSON.stringify(updatedQuizzes));
    
    // Also update in main quizzes list
    const existingQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    const updatedMainQuizzes = existingQuizzes.map((quiz: Quiz) => 
      quiz.id === updatedQuiz.id ? updatedQuiz : quiz
    );
    localStorage.setItem('quizzes', JSON.stringify(updatedMainQuizzes));
    
    setIsAddingQuestion(false);
    setEditingQuestionIndex(null);
    
    // Show success message
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleDeleteQuestion = (index: number) => {
    if (!currentQuiz) return;

    const updatedQuestions = currentQuiz.questions.filter((_, i) => i !== index);
    const updatedQuiz = {
      ...currentQuiz,
      questions: updatedQuestions,
    };

    setCurrentQuiz(updatedQuiz);
    
    // Update the quiz in the custom quizzes array
    const updatedQuizzes = quizzes.map(quiz => 
      quiz.id === updatedQuiz.id ? updatedQuiz : quiz
    );
    
    setQuizzes(updatedQuizzes);
    
    // Save to localStorage
    localStorage.setItem('customQuizzes', JSON.stringify(updatedQuizzes));
    
    // Also update in main quizzes list
    const existingQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    const updatedMainQuizzes = existingQuizzes.map((quiz: Quiz) => 
      quiz.id === updatedQuiz.id ? updatedQuiz : quiz
    );
    localStorage.setItem('quizzes', JSON.stringify(updatedMainQuizzes));
  };

  const handleEditQuestion = (index: number) => {
    setEditingQuestionIndex(index);
    setIsAddingQuestion(true);
  };

  const handleDeleteQuiz = (quizId: string) => {
    // Remove from custom quizzes
    const updatedQuizzes = quizzes.filter(quiz => quiz.id !== quizId);
    setQuizzes(updatedQuizzes);
    
    // Save to localStorage
    localStorage.setItem('customQuizzes', JSON.stringify(updatedQuizzes));
    
    // Also remove from main quizzes list
    const existingQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    const updatedMainQuizzes = existingQuizzes.filter((quiz: Quiz) => quiz.id !== quizId);
    localStorage.setItem('quizzes', JSON.stringify(updatedMainQuizzes));
    
    if (currentQuiz && currentQuiz.id === quizId) {
      setCurrentQuiz(null);
    }
  };

  const handleExportQuiz = (quiz: Quiz) => {
    const dataStr = JSON.stringify(quiz, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${quiz.title.replace(/\s+/g, '_')}_quiz.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportQuiz = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedQuiz = JSON.parse(e.target?.result as string) as Quiz;
        
        // Validate the imported quiz
        if (!importedQuiz.id || !importedQuiz.title || !Array.isArray(importedQuiz.questions)) {
          alert('Invalid quiz format');
          return;
        }
        
        // Generate a new ID to avoid conflicts
        importedQuiz.id = uuidv4();
        
        setQuizzes([...quizzes, importedQuiz]);
        setCurrentQuiz(importedQuiz);
        
        // Reset the file input
        event.target.value = '';
      } catch (error) {
        alert('Error importing quiz: Invalid JSON format');
      }
    };
    reader.readAsText(file);
  };

  // Add quiz to the main quizzes list in localStorage
  const handleAddToMainQuizzes = (quiz: Quiz) => {
    if (quiz.questions.length === 0) {
      alert('Cannot add an empty quiz to the main list');
      return;
    }
    
    // Get existing quizzes from localStorage
    const existingQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    
    // Check if this quiz is already in the main list
    const isDuplicate = existingQuizzes.some((existingQuiz: Quiz) => existingQuiz.id === quiz.id);
    
    if (isDuplicate) {
      // Update the existing quiz
      const updatedQuizzes = existingQuizzes.map((existingQuiz: Quiz) => 
        existingQuiz.id === quiz.id ? quiz : existingQuiz
      );
      localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));
    } else {
      // Add the new quiz
      localStorage.setItem('quizzes', JSON.stringify([...existingQuizzes, quiz]));
    }
    
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Custom Quiz Creator</h1>
      
      {showSuccessMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Changes saved successfully!
        </div>
      )}
      
      {!currentQuiz ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Custom Quizzes</h2>
            <div className="flex space-x-4">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => setIsCreatingQuiz(true)}
              >
                Create New Quiz
              </button>
              
              <div className="flex items-center space-x-2">
                <label className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer">
                  Import Quiz
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleImportQuiz}
                  />
                </label>
                <Link 
                  to="/import-help"
                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center"
                >
                  <HelpCircle className="h-4 w-4 mr-1" />
                  Format Help
                </Link>
              </div>
            </div>
          </div>
          
          {isCreatingQuiz ? (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-semibold mb-4">Create New Quiz</h3>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Quiz Title
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newQuizTitle}
                  onChange={(e) => setNewQuizTitle(e.target.value)}
                  placeholder="Enter quiz title..."
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  onClick={() => setIsCreatingQuiz(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  onClick={handleCreateQuiz}
                  disabled={!newQuizTitle.trim()}
                >
                  Create Quiz
                </button>
              </div>
            </div>
          ) : null}
          
          {quizzes.length === 0 ? (
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <p className="text-gray-600">You haven't created any quizzes yet.</p>
              <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => setIsCreatingQuiz(true)}
              >
                Create Your First Quiz
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quizzes.map((quiz) => (
                <div key={quiz.id} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-2">{quiz.title}</h3>
                  <p className="text-gray-600 mb-4">
                    {quiz.questions.length} question{quiz.questions.length !== 1 ? 's' : ''}
                  </p>
                  <div className="flex justify-between">
                    <button
                      className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      onClick={() => setCurrentQuiz(quiz)}
                    >
                      Edit
                    </button>
                    <div className="flex space-x-2">
                      <button
                        className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                        onClick={() => handleExportQuiz(quiz)}
                      >
                        Export
                      </button>
                      <button
                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                        onClick={() => handleDeleteQuiz(quiz.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <button
                className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 mb-2"
                onClick={() => setCurrentQuiz(null)}
              >
                ← Back to Quizzes
              </button>
              <h2 className="text-2xl font-semibold">{currentQuiz.title}</h2>
            </div>
            <div className="flex space-x-2">
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                onClick={() => handleAddToMainQuizzes(currentQuiz)}
                disabled={currentQuiz.questions.length === 0}
              >
                Add to Main Quizzes
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => {
                  setIsAddingQuestion(true);
                  setEditingQuestionIndex(null);
                }}
              >
                Add Question
              </button>
            </div>
          </div>
          
          {isAddingQuestion ? (
            <CustomQuestionForm
              onSave={handleSaveQuestion}
              onCancel={() => {
                setIsAddingQuestion(false);
                setEditingQuestionIndex(null);
              }}
              initialQuestion={
                editingQuestionIndex !== null
                  ? currentQuiz.questions[editingQuestionIndex]
                  : undefined
              }
            />
          ) : (
            <div>
              {currentQuiz.questions.length === 0 ? (
                <div className="bg-gray-100 p-6 rounded-lg text-center">
                  <p className="text-gray-600">This quiz doesn't have any questions yet.</p>
                  <button
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    onClick={() => setIsAddingQuestion(true)}
                  >
                    Add Your First Question
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentQuiz.questions.map((question, index) => (
                    <div key={question.id} className="bg-white p-6 rounded-lg shadow-md">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold mb-2">Question {index + 1}</h3>
                        <div className="flex space-x-2">
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => handleEditQuestion(index)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleDeleteQuestion(index)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="mb-4">{question.text}</p>
                      <div className="space-y-2 mb-4">
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`p-2 rounded ${
                              optIndex === question.correctAnswer
                                ? 'bg-green-100 border border-green-300'
                                : 'bg-gray-100'
                            }`}
                          >
                            {optIndex === question.correctAnswer && (
                              <span className="text-green-600 font-bold mr-2">✓</span>
                            )}
                            {option}
                          </div>
                        ))}
                      </div>
                      {question.explanation && (
                        <div className="mt-2">
                          <h4 className="font-medium text-gray-700">Explanation:</h4>
                          <p className="text-gray-600">{question.explanation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomQuizPage; 