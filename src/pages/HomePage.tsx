import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, BookOpen, Trophy, Clock } from 'lucide-react';

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

const popularQuizzes = [
  {
    id: '1',
    title: 'Algebra Basics Quiz',
    questions: 10,
    time: '25 mins',
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '2',
    title: 'Chemistry Fundamentals Quiz',
    questions: 10,
    time: '30 mins',
    image: 'https://images.unsplash.com/photo-1595440067890-aa9548ec678b?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?auto=format&fit=crop&q=80&w=400'
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
  },
  {
    id: '7',
    title: 'Physics Laws Quiz',
    questions: 10,
    time: '25 mins',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '8',
    title: 'Biology Essentials Quiz',
    questions: 10,
    time: '30 mins',
    image: 'https://images.unsplash.com/photo-1531913764164-f85c52e6e654?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '9',
    title: 'Geometry Concepts Quiz',
    questions: 10,
    time: '25 mins',
    image: 'https://images.unsplash.com/photo-1717501217912-933d2792d493?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '10',
    title: 'Computer Basics Quiz',
    questions: 10,
    time: '20 mins',
    image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=400'
  }
];

export default function HomePage() {
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
            to="/dashboard"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            View Dashboard
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

      {/* Popular Quizzes */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Popular Quizzes</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularQuizzes.map((quiz) => (
            <Link
              key={quiz.id}
              to={`/quiz/${quiz.id}`}
              className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
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
                  <span>{quiz.questions} Questions</span>
                  <span>{quiz.time}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}