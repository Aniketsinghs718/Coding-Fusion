import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Youtube, Bell, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ComingSoonPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail('');
      toast.success('Thanks for subscribing! We\'ll notify you when this feature launches.');
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white">
          <div className="flex items-center justify-center mb-4">
            <Youtube className="h-12 w-12 mr-4" />
            <h1 className="text-3xl font-bold">YouTube Notes Generator</h1>
          </div>
          <p className="text-center text-xl opacity-90">
            Automatically generate study notes from any YouTube video
          </p>
        </div>
        
        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold mb-4">Coming Soon!</h2>
              <p className="text-gray-600 mb-6">
                We're working hard to bring you this exciting new feature. The YouTube Notes Generator 
                will allow you to:
              </p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-3 mt-1">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Extract Key Points</h3>
                    <p className="text-gray-600">
                      Automatically identify and extract the most important concepts and information from any YouTube video.
                    </p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-3 mt-1">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Generate Structured Notes</h3>
                    <p className="text-gray-600">
                      Convert video content into well-organized, easy-to-review study notes with headings, bullet points, and highlights.
                    </p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-3 mt-1">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Create Custom Quizzes</h3>
                    <p className="text-gray-600">
                      Automatically generate quiz questions based on the video content to test your knowledge.
                    </p>
                  </div>
                </li>
              </ul>
              
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-blue-600" />
                  Get Notified When We Launch
                </h3>
                <p className="text-gray-600 mb-4">
                  Be the first to know when this feature becomes available. We'll send you an email as soon as it launches.
                </p>
                
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-grow">
                    <input
                      type="email"
                      placeholder="Your email address"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Subscribing...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        Notify Me
                      </span>
                    )}
                  </button>
                </form>
              </div>
            </div>
            
            <div className="md:w-1/3 bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-4">How It Will Work</h3>
              
              <ol className="space-y-4 text-gray-600">
                <li className="flex">
                  <span className="font-bold mr-2">1.</span>
                  <span>Paste any YouTube video URL</span>
                </li>
                <li className="flex">
                  <span className="font-bold mr-2">2.</span>
                  <span>Our AI analyzes the video content</span>
                </li>
                <li className="flex">
                  <span className="font-bold mr-2">3.</span>
                  <span>Review and edit the generated notes</span>
                </li>
                <li className="flex">
                  <span className="font-bold mr-2">4.</span>
                  <span>Generate quiz questions from the notes</span>
                </li>
                <li className="flex">
                  <span className="font-bold mr-2">5.</span>
                  <span>Save and share your notes and quizzes</span>
                </li>
              </ol>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold mb-2">Supported Video Types:</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Educational lectures</li>
                  <li>Tutorial videos</li>
                  <li>Documentary content</li>
                  <li>Conference talks</li>
                  <li>And more!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 