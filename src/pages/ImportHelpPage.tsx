import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileJson, Download } from 'lucide-react';

export default function ImportHelpPage() {
  const exampleQuiz = {
    id: "example-quiz-id",
    title: "Example Quiz",
    questions: [
      {
        id: "q1",
        text: "What is the capital of France?",
        options: ["London", "Paris", "Berlin", "Madrid"],
        correctAnswer: 1,
        explanation: "Paris is the capital and largest city of France."
      },
      {
        id: "q2",
        text: "Which planet is known as the Red Planet?",
        options: ["Venus", "Jupiter", "Mars", "Saturn"],
        correctAnswer: 2,
        explanation: "Mars is often called the Red Planet due to its reddish appearance."
      }
    ]
  };

  const handleDownloadExample = () => {
    const jsonString = JSON.stringify(exampleQuiz, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'example-quiz.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link to="/custom-quiz" className="flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Create Quiz
        </Link>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Quiz Import Format</h1>
          <button 
            onClick={handleDownloadExample}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-5 w-5" />
            Download Example
          </button>
        </div>
        
        <div className="prose max-w-none">
          <p>
            To import a quiz, you need to create a JSON file with the following structure. 
            You can download the example above and modify it to create your own quiz.
          </p>
          
          <h2>Required JSON Structure</h2>
          
          <div className="bg-gray-100 p-4 rounded-md mb-6">
            <pre className="text-sm overflow-x-auto">
              {`{
  "id": "unique-quiz-id",  // This will be regenerated on import
  "title": "Your Quiz Title",
  "questions": [
    {
      "id": "q1",  // Question ID (will be regenerated)
      "text": "Your question text goes here?",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "correctAnswer": 1,  // Index of correct answer (0-based)
      "explanation": "Explanation for the correct answer"
    },
    // Add more questions as needed
  ]
}`}
            </pre>
          </div>
          
          <h2>Field Descriptions</h2>
          
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2 bg-gray-100 text-left">Field</th>
                <th className="border border-gray-300 px-4 py-2 bg-gray-100 text-left">Type</th>
                <th className="border border-gray-300 px-4 py-2 bg-gray-100 text-left">Description</th>
                <th className="border border-gray-300 px-4 py-2 bg-gray-100 text-left">Required</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-medium">id</td>
                <td className="border border-gray-300 px-4 py-2">String</td>
                <td className="border border-gray-300 px-4 py-2">Unique identifier for the quiz (will be regenerated on import)</td>
                <td className="border border-gray-300 px-4 py-2">Yes</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-medium">title</td>
                <td className="border border-gray-300 px-4 py-2">String</td>
                <td className="border border-gray-300 px-4 py-2">The title of your quiz</td>
                <td className="border border-gray-300 px-4 py-2">Yes</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-medium">questions</td>
                <td className="border border-gray-300 px-4 py-2">Array</td>
                <td className="border border-gray-300 px-4 py-2">Array of question objects</td>
                <td className="border border-gray-300 px-4 py-2">Yes</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-medium">questions[].id</td>
                <td className="border border-gray-300 px-4 py-2">String</td>
                <td className="border border-gray-300 px-4 py-2">Unique identifier for the question (will be regenerated)</td>
                <td className="border border-gray-300 px-4 py-2">Yes</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-medium">questions[].text</td>
                <td className="border border-gray-300 px-4 py-2">String</td>
                <td className="border border-gray-300 px-4 py-2">The question text</td>
                <td className="border border-gray-300 px-4 py-2">Yes</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-medium">questions[].options</td>
                <td className="border border-gray-300 px-4 py-2">Array</td>
                <td className="border border-gray-300 px-4 py-2">Array of strings representing answer options</td>
                <td className="border border-gray-300 px-4 py-2">Yes</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-medium">questions[].correctAnswer</td>
                <td className="border border-gray-300 px-4 py-2">Number</td>
                <td className="border border-gray-300 px-4 py-2">Index of the correct answer (0-based)</td>
                <td className="border border-gray-300 px-4 py-2">Yes</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-medium">questions[].explanation</td>
                <td className="border border-gray-300 px-4 py-2">String</td>
                <td className="border border-gray-300 px-4 py-2">Explanation for the correct answer</td>
                <td className="border border-gray-300 px-4 py-2">Yes</td>
              </tr>
            </tbody>
          </table>
          
          <h2>Notes</h2>
          
          <ul>
            <li>The <code>id</code> fields will be regenerated on import to avoid conflicts with existing quizzes.</li>
            <li>The <code>correctAnswer</code> field is 0-based, meaning 0 refers to the first option, 1 to the second, and so on.</li>
            <li>All fields marked as required must be present for the import to succeed.</li>
            <li>The file must be valid JSON format.</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 