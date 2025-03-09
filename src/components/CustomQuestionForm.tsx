import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Question } from '../types';

interface CustomQuestionFormProps {
  onSave: (question: Question) => void;
  onCancel: () => void;
  initialQuestion?: Question;
}

const CustomQuestionForm: React.FC<CustomQuestionFormProps> = ({
  onSave,
  onCancel,
  initialQuestion,
}) => {
  const [question, setQuestion] = useState<string>(initialQuestion?.text || '');
  const [options, setOptions] = useState<string[]>(
    initialQuestion?.options || ['', '', '', '']
  );
  const [correctAnswer, setCorrectAnswer] = useState<number>(
    initialQuestion?.correctAnswer || 0
  );
  const [explanation, setExplanation] = useState<string>(
    initialQuestion?.explanation || ''
  );
  const [error, setError] = useState<string>('');

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
      
      // Adjust correctAnswer if needed
      if (correctAnswer === index) {
        setCorrectAnswer(0);
      } else if (correctAnswer > index) {
        setCorrectAnswer(correctAnswer - 1);
      }
    }
  };

  const validateForm = (): boolean => {
    if (!question.trim()) {
      setError('Question text is required');
      return false;
    }

    if (options.some(option => !option.trim())) {
      setError('All options must have content');
      return false;
    }

    if (options.length < 2) {
      setError('At least 2 options are required');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const newQuestion: Question = {
      id: initialQuestion?.id || uuidv4(),
      text: question.trim(),
      options: options.map(opt => opt.trim()),
      correctAnswer,
      explanation: explanation.trim(),
    };

    onSave(newQuestion);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        {initialQuestion ? 'Edit Question' : 'Create New Question'}
      </h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Question Text
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your question here..."
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Options
          </label>
          {options.map((option, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="radio"
                id={`option-${index}`}
                name="correctAnswer"
                className="mr-2"
                checked={correctAnswer === index}
                onChange={() => setCorrectAnswer(index)}
              />
              <input
                type="text"
                className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                required
              />
              <button
                type="button"
                className="ml-2 text-red-500 hover:text-red-700"
                onClick={() => removeOption(index)}
                disabled={options.length <= 2}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
          
          {options.length < 6 && (
            <button
              type="button"
              className="mt-2 text-blue-500 hover:text-blue-700 flex items-center"
              onClick={addOption}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Option
            </button>
          )}
          
          <p className="text-sm text-gray-500 mt-1">
            Select the radio button next to the correct answer
          </p>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Explanation (Optional)
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder="Explain why the correct answer is right..."
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Question
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomQuestionForm; 