import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Brain, BookOpen, Trophy, Clock, Plus, Trash2 } from 'lucide-react';
import { Quiz } from '../types';

const features = [
  {
    icon: <Brain className="h-8 w-8" />,
    title: 'Smart Learning',
    description: 'Adaptive quizzes that learn from your performance'
  },
  {
    icon: <BookOpen className="h-8 w-8" />,
    title: 'PDF to Quiz',
    description: 'Convert your study materials into interactive quizzes'
  },
  {
    icon: <Trophy className="h-8 w-8" />,
    title: 'Track Progress',
    description: 'Detailed analytics and performance tracking'
  },
  {
    icon: <Clock className="h-8 w-8" />,
    title: 'Time Management',
    description: 'Practice with timed quizzes for better preparation'
  }
];

const defaultQuizzes = [
  {
    id: '1',
    title: 'Algebra Basics Quiz',
    questions: [
      {
        id: '1',
        text: 'What is the solution to 2x + 3 = 7?',
        options: ['2', '3', '4', '5'],
        correctAnswer: 0,
        explanation: 'Subtract 3 from both sides: 2x = 4, then divide by 2: x = 2.'
      },
      {
        id: '2',
        text: 'What is the quadratic formula?',
        options: [
          'x = -b ± √(b² - 4ac)/2a',
          'x = b ± √(b² - 4ac)/2a',
          'x = -b ± √(b² + 4ac)/2a',
          'x = b ± √(b² + 4ac)/2a'
        ],
        correctAnswer: 0,
        explanation: 'The quadratic formula solves equations of the form ax² + bx + c = 0.'
      },
      {
        id: '3',
        text: 'Solve for x: x - 2 = 5',
        options: ['3', '5', '7', '9'],
        correctAnswer: 2,
        explanation: 'Add 2 to both sides: x = 5 + 2, so x = 7.'
      }
    ]
  },
  {
    id: '2',
    title: 'Chemistry Fundamentals Quiz',
    questions: [
      {
        id: '1',
        text: 'What is the atomic number of Carbon?',
        options: ['4', '6', '8', '12'],
        correctAnswer: 1,
        explanation: 'Carbon has 6 protons, making its atomic number 6.'
      },
      {
        id: '2',
        text: 'What is the chemical formula for water?',
        options: ['H2O', 'CO2', 'NaCl', 'O2'],
        correctAnswer: 0,
        explanation: 'Water consists of two hydrogen atoms and one oxygen atom.'
      },
      {
        id: '3',
        text: 'What is the pH of a neutral solution?',
        options: ['0', '7', '14', '10'],
        correctAnswer: 1,
        explanation: 'A neutral solution has a pH of 7.'
      }
    ]
  },
  {
    id: '3',
    title: 'World Wars History Quiz',
    questions: 10,
    time: '30 mins',
    image: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '4',
    title: 'Geography & Capitals Quiz',
    questions: 10,
    time: '25 mins',
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '5',
    title: 'English Literature Quiz',
    questions: 10,
    time: '20 mins',
    image: 'https://plus.unsplash.com/premium_photo-1715588660566-b42ef42fde8d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '6',
    title: 'Civics & Constitution Quiz',
    questions: 10,
    time: '30 mins',
    image: 'https://images.unsplash.com/photo-1604339454409-701c5278c546?auto=format&fit=crop&q=80&w=400'
  }
];

// Random image URLs for custom quizzes
const quizImageUrls = [
  'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1531913764164-f85c52e6e654?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1717501217912-933d2792d493?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&q=80&w=400'
];

export default function HomePage() {
  const [allQuizzes, setAllQuizzes] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<any>(null);

  useEffect(() => {
    // Initialize default quizzes in localStorage if they don't exist
    const savedQuizzes = localStorage.getItem('quizzes');
    if (!savedQuizzes) {
      const initialQuizzes = defaultQuizzes.map(quiz => ({
        ...quiz,
        questions: quiz.questions || []
      }));
      localStorage.setItem('quizzes', JSON.stringify(initialQuizzes));
    }

    // Load quizzes from localStorage
    const currentSavedQuizzes = localStorage.getItem('quizzes');
    const savedCustomQuizzes = localStorage.getItem('customQuizzes');
    
    let quizzesFromStorage: Quiz[] = [];
    if (currentSavedQuizzes) {
      try {
        quizzesFromStorage = JSON.parse(currentSavedQuizzes);
      } catch (error) {
        console.error('Error parsing quizzes from localStorage:', error);
      }
    }
    
    let customQuizzesFromStorage: Quiz[] = [];
    if (savedCustomQuizzes) {
      try {
        customQuizzesFromStorage = JSON.parse(savedCustomQuizzes);
        
        // We'll create a new array with unique quizzes only
        const uniqueQuizzes = [...quizzesFromStorage];
        
        // Add custom quizzes to the main quizzes list if they're not already there
        customQuizzesFromStorage.forEach(customQuiz => {
          // Check if this custom quiz is already in the main quizzes list
          const isAlreadyInMainList = uniqueQuizzes.some(q => q.id === customQuiz.id);
          
          // If not, add it to the main quizzes list
          if (!isAlreadyInMainList) {
            uniqueQuizzes.push(customQuiz);
          }
        });
        
        // Process quizzes to ensure they have the correct format for display
        const processedQuizzes = uniqueQuizzes.map(quiz => {
          // Calculate the number of questions
          const questionCount = quiz.questions ? quiz.questions.length : 0;
          
          // Calculate time based on question count (1.5 minutes per question)
          const timeInMinutes = Math.max(Math.round(questionCount * 1.5), 5); // Minimum 5 minutes
          
          return {
            ...quiz,
            questionCount: questionCount,
            time: `${timeInMinutes} mins`,
            image: quiz.image || quizImageUrls[Math.floor(Math.random() * quizImageUrls.length)]
          };
        });
        
        // Use the processedQuizzes array
        setAllQuizzes(processedQuizzes);
        return; // Exit early since we've already set the state
      } catch (error) {
        console.error('Error parsing custom quizzes from localStorage:', error);
      }
    }
    
    // If we didn't have custom quizzes or there was an error, just use the regular quizzes
    // Process quizzes to ensure they have the correct format for display
    const processedQuizzes = quizzesFromStorage.map(quiz => {
      // Calculate the number of questions
      const questionCount = quiz.questions ? quiz.questions.length : 0;
      
      // Calculate time based on question count (1.5 minutes per question)
      const timeInMinutes = Math.max(Math.round(questionCount * 1.5), 5); // Minimum 5 minutes
      
      return {
        ...quiz,
        questionCount: questionCount,
        time: `${timeInMinutes} mins`,
        image: quiz.image || quizImageUrls[Math.floor(Math.random() * quizImageUrls.length)]
      };
    });
    
    setAllQuizzes(processedQuizzes);
  }, []);

  const handleDeleteClick = (quiz: any) => {
    setQuizToDelete(quiz);
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    if (!quizToDelete) return;

    // Get the current quizzes from localStorage to ensure we're working with the latest data
    const savedQuizzes = localStorage.getItem('quizzes');
    const savedCustomQuizzes = localStorage.getItem('customQuizzes');
    
    let quizzesFromStorage: any[] = [];
    if (savedQuizzes) {
      try {
        quizzesFromStorage = JSON.parse(savedQuizzes);
      } catch (error) {
        console.error('Error parsing quizzes from localStorage:', error);
      }
    }
    
    let customQuizzesFromStorage: any[] = [];
    if (savedCustomQuizzes) {
      try {
        customQuizzesFromStorage = JSON.parse(savedCustomQuizzes);
      } catch (error) {
        console.error('Error parsing custom quizzes from localStorage:', error);
      }
    }

    // Remove the quiz from the main quizzes list
    const updatedQuizzes = quizzesFromStorage.filter(quiz => quiz.id !== quizToDelete.id);
    localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));

    // Remove the quiz from the custom quizzes list if it exists there
    const updatedCustomQuizzes = customQuizzesFromStorage.filter(quiz => quiz.id !== quizToDelete.id);
    localStorage.setItem('customQuizzes', JSON.stringify(updatedCustomQuizzes));

    // Process the updated quizzes to ensure they have the correct format for display
    const processedQuizzes = updatedQuizzes.map(quiz => {
      // Calculate the number of questions
      const questionCount = Array.isArray(quiz.questions) ? quiz.questions.length : 0;
      
      // Calculate time based on question count (1.5 minutes per question)
      const timeInMinutes = Math.max(Math.round(questionCount * 1.5), 5); // Minimum 5 minutes
      
      return {
        ...quiz,
        questionCount: questionCount,
        time: `${timeInMinutes} mins`,
        image: quiz.image || quizImageUrls[Math.floor(Math.random() * quizImageUrls.length)]
      };
    });

    // Update the state with the processed quizzes
    setAllQuizzes(processedQuizzes);

    // Close dialog and reset quizToDelete
    setShowConfirmDialog(false);
    setQuizToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowConfirmDialog(false);
    setQuizToDelete(null);
  };

  // Filter quizzes based on search query
  const filteredQuizzes = allQuizzes.filter(quiz =>
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <h1 className="text-5xl font-bold text-gray-900">
          Master Your Knowledge with Interactive Quizzes
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Transform your learning experience with our advanced quiz platform. Create, practice, and track your progress all in one place.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/upload"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Quiz from PDF
          </Link>
          <Link
            to="/custom-quiz"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Create Custom Quiz
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="text-blue-600 mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </section>

      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search quizzes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* All Quizzes */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Available Quizzes</h2>
          <Link
            to="/custom-quiz"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Create New Quiz
          </Link>
        </div>
        
        {filteredQuizzes.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-lg">
            <p className="text-gray-600 mb-4">No quizzes match your search.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredQuizzes.map((quiz) => (
              <div key={quiz.id} className="relative group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <Link to={`/quiz/${quiz.id}`}>
                  <div className="h-48 overflow-hidden">
                    <img
                      src={quiz.image}
                      alt={quiz.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{quiz.title}</h3>
                    <div className="flex justify-between text-gray-600">
                      <span>{quiz.questionCount || 0} Questions</span>
                      <span>{quiz.time}</span>
                    </div>
                  </div>
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleDeleteClick(quiz);
                  }}
                  className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Delete Quiz</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{quizToDelete?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}