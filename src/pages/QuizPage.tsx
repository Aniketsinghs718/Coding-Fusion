import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuizCard from '../components/QuizCard';
import type { Question, UserAnswer, QuizAttempt } from '../types';
import { saveQuizAttempt } from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';

const quizzes: Record<string, { title: string, questions: Question[] }> = {
  '1': {
    title: 'Algebra Basics Quiz',
    questions: [
      {
        id: '1',
        text: 'What is the solution to \(2x + 3 = 7\)?',
        options: ['2', '3', '4', '5'],
        correctAnswer: 0,
        explanation: 'Subtract 3 from both sides: \(2x = 4\), then divide by 2: \(x = 2\).'
      },
      {
        id: '2',
        text: 'What is the quadratic formula?',
        options: [
          '\(x = -b \pm \sqrt{b^2 - 4ac}/2a\)',
          '\(x = b \pm \sqrt{b^2 - 4ac}/2a\)',
          '\(x = -b \pm \sqrt{b^2 + 4ac}/2a\)',
          '\(x = b \pm \sqrt{b^2 + 4ac}/2a\)'
        ],
        correctAnswer: 0,
        explanation: 'The quadratic formula solves equations of the form \(ax^2 + bx + c = 0\).'
      },
      {
        id: '3',
        text: 'Solve for x: x - 2 = 5',
        options: ['3', '5', '7', '9'],
        correctAnswer: 1,
        explanation: 'Add 2 to both sides: x = 5 + 2, so x = 7.'
      },
      {
        id: '4',
        text: 'What is the value of x in the equation 2x = 12?',
        options: ['4', '6', '8', '10'],
        correctAnswer: 1,
        explanation: 'Divide both sides by 2: x = 12 / 2, so x = 6.'
      },
      {
        id: '5',
        text: 'Solve for y: y + 1 = 9',
        options: ['6', '7', '8', '10'],
        correctAnswer: 2,
        explanation: 'Subtract 1 from both sides: y = 9 - 1, so y = 8.'
      },
      {
        id: '6',
        text: 'What is the equation of the line that passes through the points (2,3) and (4,5)?',
        options: ['y = x + 1', 'y = x - 1', 'y = 2x - 1', 'y = 2x + 1'],
        correctAnswer: 0,
        explanation: 'The slope of the line is (5 - 3) / (4 - 2) = 1, and the y-intercept is 1, so the equation is y = x + 1.'
      },
      {
        id: '7',
        text: 'Solve for z: z / 2 = 6',
        options: ['8', '10', '12', '14'],
        correctAnswer: 2,
        explanation: 'Multiply both sides by 2: z = 6 * 2, so z = 12.'
      },
      {
        id: '8',
        text: 'What is the value of x in the equation x^2 + 4x + 4 = 0?',
        options: ['-2', '-4', '-6', '-8'],
        correctAnswer: 0,
        explanation: 'Factor the equation: (x + 2)^2 = 0, so x + 2 = 0, and x = -2.'
      },
      {
        id: '9',
        text: 'Solve for w: w - 3 = 7',
        options: ['4', '6', '8', '10'],
        correctAnswer: 2,
        explanation: 'Add 3 to both sides: w = 7 + 3, so w = 10.'
      },
      {
        id: '10',
        text: 'What is the equation of the line that passes through the points (1,2) and (3,4)?',
        options: ['y = x + 1', 'y = x - 1', 'y = 2x - 1', 'y = 2x + 1'],
        correctAnswer: 0,
        explanation: 'The slope of the line is (4 - 2) / (3 - 1) = 1, and the y-intercept is 1, so the equation is y = x + 1.'
      },
    ]
  },
  '2': {
    title: 'Chemistry Fundamentals Quiz',
    questions: [
      {
        id: '1',
        text: 'What is the pH of pure water?',
        options: ['5', '7', '10', '0'],
        correctAnswer: 1,
        explanation: 'Pure water is neutral with a pH of 7 at 25°C.'
      },
      {
        id: '2',
        text: 'Which gas is responsible for the greenhouse effect?',
        options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'],
        correctAnswer: 2,
        explanation: 'CO₂ traps heat in the atmosphere, causing global warming.'
      },
      {
        id: '3',
        text: 'What is the atomic number of oxygen?',
        options: ['6', '8', '10', '12'],
        correctAnswer: 1,
        explanation: 'The atomic number of oxygen is 8, which means it has 8 protons in its atomic nucleus.'
      },
      {
        id: '4',
        text: 'What type of bond is formed when two atoms share one or more pairs of electrons?',
        options: ['Ionic bond', 'Covalent bond', 'Hydrogen bond', 'Electrostatic bond'],
        correctAnswer: 1,
        explanation: 'A covalent bond is formed when two atoms share one or more pairs of electrons, resulting in a strong chemical bond.'
      },
      {
        id: '5',
        text: 'What is the chemical formula for water?',
        options: ['H2O', 'H3O', 'OH2', 'HO2'],
        correctAnswer: 0,
        explanation: 'The chemical formula for water is H2O, indicating that one molecule of water consists of two hydrogen atoms and one oxygen atom.'
      },
      {
        id: '6',
        text: 'What is the process by which an atom gains or loses electrons to form ions?',
        options: ['Ionization', 'Electron transfer', 'Ion formation', 'Electron gain/loss'],
        correctAnswer: 3,
        explanation: 'The process by which an atom gains or loses electrons to form ions is called electron gain/loss, resulting in the formation of ions with a positive or negative charge.'
      },
      {
        id: '7',
        text: 'What is the pH of a neutral solution?',
        options: ['0', '7', '14', 'pH is not applicable'],
        correctAnswer: 1,
        explanation: 'A neutral solution has a pH of 7, which is the middle of the pH scale and indicates that the solution is neither acidic nor basic.'
      },
      {
        id: '8',
        text: 'What type of reaction occurs when a substance reacts with oxygen to produce heat and light?',
        options: ['Combustion reaction', 'Synthesis reaction', 'Decomposition reaction', 'Replacement reaction'],
        correctAnswer: 0,
        explanation: 'A combustion reaction occurs when a substance reacts with oxygen to produce heat and light, resulting in the release of energy.'
      },
      {
        id: '9',
        text: 'What is the chemical symbol for gold?',
        options: ['Ag', 'Au', 'Hg', 'Pb'],
        correctAnswer: 1,
        explanation: 'The chemical symbol for gold is Au, which comes from the Latin word "aurum".'
      },
      {
        id: '10',
        text: 'What is the process by which a solid changes directly to a gas without going through the liquid phase?',
        options: ['Melting', 'Boiling', 'Sublimation', 'Deposition'],
        correctAnswer: 2,
        explanation: 'The process by which a solid changes directly to a gas without going through the liquid phase is called sublimation, resulting in the formation of a gas from a solid.'
      },
    ]
  },
  '3': {
    title: 'World Wars History Quiz',
    questions: [
      {
        id: '1',
        text: 'Which event triggered WWI?',
        options: [
          'Invasion of Poland',
          'Assassination of Archduke Franz Ferdinand',
          'Bombing of Pearl Harbor',
          'Treaty of Versailles'
        ],
        correctAnswer: 1,
        explanation: 'The assassination in 1914 sparked tensions in Europe.'
      },
      {
        id: '2',
        text: 'Which ancient civilization built the Great Pyramid of Giza?',
        options: ['Egyptians', 'Greeks', 'Romans', 'Mesopotamians'],
        correctAnswer: 0,
        explanation: 'The Great Pyramid of Giza was built by the ancient Egyptians around 2580 BC.'
      },
      {
        id: '3',
        text: 'Who was the leader of the Soviet Union during World War II?',
        options: ['Joseph Stalin', 'Vladimir Lenin', 'Leon Trotsky', 'Mikhail Gorbachev'],
        correctAnswer: 0,
        explanation: 'Joseph Stalin was the leader of the Soviet Union during World War II, from 1941 to 1945.'
      },
      {
        id: '4',
        text: 'What was the name of the treaty that ended the First World War?',
        options: ['Treaty of Versailles', 'Treaty of Berlin', 'Treaty of Paris', 'Treaty of London'],
        correctAnswer: 0,
        explanation: 'The Treaty of Versailles was signed on June 28, 1919, and officially ended the First World War.'
      },
      {
        id: '5',
        text: 'Who was the ancient Greek philosopher who taught that "know thyself" was the most important maxim?',
        options: ['Socrates', 'Plato', 'Aristotle', 'Epicurus'],
        correctAnswer: 0,
        explanation: 'Socrates was the ancient Greek philosopher who taught that "know thyself" was the most important maxim, and that self-knowledge was the key to wisdom.'
      },
      {
        id: '6',
        text: 'What was the name of the Chinese dynasty that ruled from 221 to 206 BC?',
        options: ['Qin', 'Han', 'Ming', 'Qing'],
        correctAnswer: 0,
        explanation: 'The Qin dynasty ruled China from 221 to 206 BC, and was known for its centralized government and standardized weights and measures.'
      },
      {
        id: '7',
        text: 'Who was the leader of the American Civil Rights Movement in the 1950s and 1960s?',
        options: ['Martin Luther King Jr.', 'Malcolm X', 'Rosa Parks', 'Thurgood Marshall'],
        correctAnswer: 0,
        explanation: 'Martin Luther King Jr. was the leader of the American Civil Rights Movement in the 1950s and 1960s, and is known for his advocacy of nonviolent civil disobedience.'
      },
      {
        id: '8',
        text: 'What was the name of the ancient city that was the capital of the Inca Empire?',
        options: ['Cuzco', 'Machu Picchu', 'Lima', 'Santiago'],
        correctAnswer: 0,
        explanation: 'Cuzco was the ancient city that was the capital of the Inca Empire, and was known for its impressive architecture and rich cultural heritage.'
      },
      {
        id: '9',
        text: 'Who was the Roman general who crossed the Rubicon River with his legions in 49 BC?',
        options: ['Julius Caesar', 'Pompey the Great', 'Hannibal', 'Scipio Africanus'],
        correctAnswer: 0,
        explanation: 'Julius Caesar crossed the Rubicon River with his legions in 49 BC, marking the beginning of a civil war that would lead to his rise to power.'
      },
      {
        id: '10',
        text: 'What was the name of the treaty that established the borders of Europe after World War I?',
        options: ['Treaty of Versailles', 'Treaty of Berlin', 'Treaty of Paris', 'Congress of Vienna'],
        correctAnswer: 0,
        explanation: 'The Treaty of Versailles established the borders of Europe after World War I, and imposed harsh penalties on Germany.'
      },
    ]
  },
  '4': {
    title: 'Geography & Capitals Quiz',
    questions: [
      {
        id: '1',
        text: 'What is the capital of Australia?',
        options: ['Sydney', 'Melbourne', 'Canberra', 'Perth'],
        correctAnswer: 2,
        explanation: 'Canberra became the capital in 1913 to resolve rivalry between Sydney and Melbourne.'
      },
{
  id: '2',
  text: "What is the world's largest desert?",
  options: ['Sahara', 'Gobi', 'Mojave', 'Atacama'],
  correctAnswer: 0,
  explanation: "The Sahara Desert is the world's largest hot desert, covering an area of approximately 9.2 million square kilometers."
},
{
  id: '3',
  text: 'Which river is the longest in South America?',
  options: ['Amazon River', 'Parana River', 'Sao Francisco River', 'Magdalena River'],
  correctAnswer: 0,
  explanation: 'The Amazon River is the longest river in South America, stretching for approximately 6,400 kilometers through Brazil, Colombia, and Peru.'
},
{
  id: '4',
  text: 'What is the capital city of Australia?',
  options: ['Sydney', 'Melbourne', 'Canberra', 'Perth'],
  correctAnswer: 2,
  explanation: 'Canberra is the capital city of Australia, located in the Australian Capital Territory.'
},
{
  id: '5',
  text: 'Which mountain range runs along the border between France and Spain?',
  options: ['Pyrenees', 'Alps', 'Carpathian Mountains', 'Apennine Mountains'],
  correctAnswer: 0,
  explanation: 'The Pyrenees mountain range runs along the border between France and Spain, stretching for approximately 435 kilometers.'
},
{
  id: '6',
  text: 'What is the largest island in the Mediterranean Sea?',
  options: ['Sicily', 'Sardinia', 'Corsica', 'Crete'],
  correctAnswer: 0,
  explanation: 'Sicily is the largest island in the Mediterranean Sea, with an area of approximately 25,711 square kilometers.'
},
{
  id: '7',
  text: 'Which city is the largest in Scandinavia?',
  options: ['Stockholm', 'Copenhagen', 'Oslo', 'Helsinki'],
  correctAnswer: 0,
  explanation: 'Stockholm is the largest city in Scandinavia, with a population of approximately 950,000 people.'
},
{
  id: '8',
  text: "What is the world's largest waterfall, by volume of water?",
  options: ['Victoria Falls', 'Iguazu Falls', 'Niagara Falls', 'Angel Falls'],
  correctAnswer: 0,
  explanation: "Victoria Falls is the world's largest waterfall, by volume of water, located on the border of Zambia and Zimbabwe in southern Africa."
},
{
  id: '9',
  text: 'Which country is the largest in Southeast Asia?',
  options: ['Indonesia', 'Malaysia', 'Thailand', 'Vietnam'],
  correctAnswer: 0,
  explanation: 'Indonesia is the largest country in Southeast Asia, with an area of approximately 1.9 million square kilometers.'
},
{
  id: '10',
  text: 'What is the highest mountain peak in North America?',
  options: ['Denali', 'Mount Whitney', 'Mount Rainier', 'Mount Hood'],
  correctAnswer: 0,
  explanation: 'Denali, formerly known as Mount McKinley, is the highest mountain peak in North America, with an elevation of approximately 6,190 meters.'
},    ]
  },
  '5': {
    title: 'English Literature Quiz',
    questions: [
      {
        id: '1',
        text: 'Who wrote "Pride and Prejudice"?',
        options: ['Charlotte Brontë', 'Jane Austen', 'Charles Dickens', 'Mark Twain'],
        correctAnswer: 1,
        explanation: 'Jane Austen published this classic novel in 1813.'
      },
      // Add 9 more literature questions...
    ]
  },
  '6': {
    title: 'Civics & Constitution Quiz',
    questions: [
      {
        id: '1',
        text: 'How many articles are in the Indian Constitution?',
        options: ['395', '448', '250', '500'],
        correctAnswer: 1,
        explanation: 'Originally 395 articles, it now has 448 after amendments.'
      },
      // Add 9 more civics questions...
    ]
  },
  '7': {
    title: 'Physics Laws Quiz',
    questions: [
      {
        id: '1',
        text: 'What is Newton’s first law?',
        options: [
          'F = ma',
          'Action-Reaction',
          'Inertia',
          'Law of Gravitation'
        ],
        correctAnswer: 2,
        explanation: 'Also called the law of inertia: objects resist changes in motion.'
      },
      // Add 9 more physics questions...
    ]
  },
  '8': {
    title: 'Biology Essentials Quiz',
    questions: [
      {
        id: '1',
        text: 'Where does photosynthesis occur?',
        options: ['Mitochondria', 'Nucleus', 'Chloroplast', 'Ribosome'],
        correctAnswer: 2,
        explanation: 'Chloroplasts contain chlorophyll for capturing light energy.'
      },
      // Add 9 more biology questions...
    ]
  },
  '9': {
    title: 'Geometry Concepts Quiz',
    questions: [
      {
        id: '1',
        text: 'What is the sum of angles in a triangle?',
        options: ['90°', '180°', '270°', '360°'],
        correctAnswer: 1,
        explanation: 'This Euclidean geometry rule applies to all triangles.'
      },
      // Add 9 more geometry questions...
    ]
  },
  '10': {
    title: 'Computer Basics Quiz',
    questions: [
      {
        id: '1',
        text: 'What does RAM stand for?',
        options: [
          'Random Access Memory',
          'Read-Only Memory',
          'Rapid Action Module',
          'Remote Access Machine'
        ],
        correctAnswer: 0,
        explanation: 'RAM is volatile memory used for temporary data storage.'
      },
      // Add 9 more computer questions...
    ]
  }
};


export default function QuizPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const quiz = id ? quizzes[id] : undefined;
  const questions = quiz?.questions || [];

  useEffect(() => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setQuizComplete(false);
    setShowSubmitConfirm(false);
  }, [id]);

  const handleAnswer = (answer: UserAnswer) => {
    const existingAnswerIndex = answers.findIndex(a => a.questionId === answer.questionId);
    if (existingAnswerIndex !== -1) {
      const newAnswers = [...answers];
      newAnswers[existingAnswerIndex] = answer;
      setAnswers(newAnswers);
    } else {
      setAnswers([...answers, answer]);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    if (answers.length < questions.length) {
      setShowSubmitConfirm(true);
    } else {
      setQuizComplete(true);
    }
  };

  if (!questions.length) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Quiz Not Found</h2>
        <p className="text-gray-600 mb-6">Sorry, we couldn't find the quiz you're looking for.</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Return Home
        </button>
      </div>
    );
  }

  if (quizComplete) {
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const score = Math.round((correctAnswers / questions.length) * 100);
    const totalTime = answers.reduce((acc, curr) => acc + curr.timeSpent, 0);
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;

    const attempt: QuizAttempt = {
      id: uuidv4(),
      quizId: id || '',
      title: quiz?.title || 'Unknown Quiz',
      date: new Date().toISOString(),
      score,
      timeSpent: totalTime,
      correctAnswers,
      totalQuestions: questions.length,
      answers
    };
    saveQuizAttempt(attempt);

    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Quiz Complete!</h2>
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-6xl font-bold text-blue-600">{score}%</p>
            <p className="text-gray-600">Score</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-semibold">{correctAnswers}/{questions.length}</p>
              <p className="text-gray-600">Correct Answers</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">{minutes}m {seconds}s</p>
              <p className="text-gray-600">Time Taken</p>
            </div>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => {
                setCurrentQuestionIndex(0);
                setAnswers([]);
                setQuizComplete(false);
              }}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <QuizCard
        question={questions[currentQuestionIndex]}
        currentIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        onAnswer={handleAnswer}
        onNext={handleNext}
        onPrevious={handlePrevious}
        selectedAnswer={answers.find(a => a.questionId === questions[currentQuestionIndex].id)?.selectedAnswer}
      />
      
      <div className="flex justify-between items-center bg-white rounded-xl p-4 shadow-lg">
        <div className="text-gray-600">
          <span className="font-semibold">{answers.length}</span> of <span className="font-semibold">{questions.length}</span> questions answered
        </div>
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Submit Quiz
        </button>
      </div>

      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Are you sure?</h3>
            <p className="text-gray-600 mb-6">
              You have only answered {answers.length} out of {questions.length} questions. 
              Unanswered questions will be marked as incorrect.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setQuizComplete(true)}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Submit Anyway
              </button>
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Continue Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}