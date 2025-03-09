import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Question, Quiz } from '../types';
import { v4 as uuidv4 } from 'uuid';

const API_URL = 'http://localhost:5000/api';

export default function PDFUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inputType, setInputType] = useState<'file' | 'text'>('file');
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile?.type === 'application/pdf' || uploadedFile?.name.endsWith('.txt')) {
      setFile(uploadedFile);
      toast.success(`${uploadedFile.name} uploaded successfully!`);
    } else {
      toast.error('Please upload a PDF or TXT file');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
  });

  const removeFile = () => {
    setFile(null);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const generateQuiz = async () => {
    if (!file && !text) {
      toast.error('Please upload a file or enter text');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    
    if (inputType === 'file' && file) {
      formData.append('file', file);
    } else if (inputType === 'text' && text) {
      formData.append('text', text);
    }

    // Add parameters
    formData.append('questionsPerChunk', '3');
    formData.append('chunkSize', '2000');
    formData.append('overlap', '200');

    try {
      const response = await fetch(`${API_URL}/generate-mcq`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate quiz');
      }

      const data = await response.json();
      
      if (!data.mcqs || data.mcqs.length === 0) {
        throw new Error('No questions could be generated from the provided content');
      }

      // Transform the MCQs to match our Question interface
      const questions: Question[] = data.mcqs.map((mcq: any) => ({
        id: uuidv4(),
        text: mcq.question,
        options: mcq.options,
        correctAnswer: mcq.correct_index,
        explanation: mcq.explanation
      }));

      // Create a new quiz
      const quiz: Quiz = {
        id: uuidv4(),
        title: file ? `Quiz from ${file.name}` : 'Quiz from Text Input',
        questions: questions,
        timeLimit: questions.length * 60, // 1 minute per question
      };

      // Store the quiz in localStorage (in a real app, this would go to a database)
      const existingQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
      localStorage.setItem('quizzes', JSON.stringify([...existingQuizzes, quiz]));
      
      // Navigate to the quiz page
      toast.success('Quiz generated successfully!');
      navigate(`/quiz/${quiz.id}`);
    } catch (error) {
      console.error('Error generating quiz:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate quiz');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Create Quiz from Content</h1>
        <p className="text-gray-600 mb-6">
          Upload a PDF/TXT file or paste text to generate an interactive quiz
        </p>

        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => setInputType('file')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              inputType === 'file'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Upload File
          </button>
          <button
            onClick={() => setInputType('text')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              inputType === 'text'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Enter Text
          </button>
        </div>
      </div>

      {inputType === 'file' ? (
        <>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg mb-2">
              {isDragActive
                ? 'Drop your file here'
                : 'Drag & drop your PDF or TXT file here, or click to select'}
            </p>
            <p className="text-sm text-gray-500">Maximum file size: 10MB</p>
          </div>

          {file && (
            <div className="bg-white rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <File className="h-6 w-6 text-blue-500" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-2">
          <label htmlFor="content-text" className="block text-sm font-medium text-gray-700">
            Enter your content
          </label>
          <textarea
            id="content-text"
            rows={10}
            className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            placeholder="Paste your text content here..."
            value={text}
            onChange={handleTextChange}
          ></textarea>
        </div>
      )}

      <button
        onClick={generateQuiz}
        disabled={isLoading || (inputType === 'file' && !file) || (inputType === 'text' && !text)}
        className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center
          ${
            isLoading
              ? 'bg-blue-400 text-white cursor-not-allowed'
              : (inputType === 'file' && file) || (inputType === 'text' && text)
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Generating Quiz...
          </>
        ) : (
          'Generate Quiz'
        )}
      </button>
    </div>
  );
}