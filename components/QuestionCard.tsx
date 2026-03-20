'use client';

import { useState } from 'react';

interface QuestionCardProps {
  question: {
    text: string;
    answers: {
      id: string;
      text: string;
      color: string;
    }[];
    timeLimit: number;
  };
  questionNumber: number;
  totalQuestions: number;
  showCorrectAnswer?: boolean;
  correctAnswerId?: string;
  selectedAnswerId?: string;
  onAnswerSelect?: (answerId: string) => void;
  disabled?: boolean;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  showCorrectAnswer = false,
  correctAnswerId,
  selectedAnswerId,
  onAnswerSelect,
  disabled = false,
}: QuestionCardProps) {
  const [hoveredAnswer, setHoveredAnswer] = useState<string | null>(null);

  const getAnswerStyle = (answer: { id: string; text: string; color: string }) => {
    const baseStyle = 'p-6 rounded-xl text-white font-bold text-xl md:text-2xl cursor-pointer transition-all duration-200 flex items-center gap-4';
    
    if (showCorrectAnswer) {
      if (answer.id === correctAnswerId) {
        return `${baseStyle} ${answer.color} ring-4 ring-white ring-offset-4 scale-105`;
      }
      if (answer.id === selectedAnswerId && answer.id !== correctAnswerId) {
        return `${baseStyle} ${answer.color} opacity-50`;
      }
      return `${baseStyle} ${answer.color} opacity-50`;
    }
    
    if (hoveredAnswer === answer.id && !disabled) {
      return `${baseStyle} ${answer.color} scale-105 shadow-lg`;
    }
    
    return `${baseStyle} ${answer.color}`;
  };

  const answerLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Question Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold">
          Question {questionNumber}/{totalQuestions}
        </div>
      </div>

      {/* Question Text */}
      <div className="bg-gray-900 text-white p-8 rounded-2xl mb-6 shadow-2xl">
        <h2 className="text-2xl md:text-4xl font-bold text-center leading-relaxed">
          {question.text}
        </h2>
      </div>

      {/* Answers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.answers.map((answer, index) => (
          <button
            key={answer.id}
            onClick={() => !disabled && onAnswerSelect?.(answer.id)}
            onMouseEnter={() => setHoveredAnswer(answer.id)}
            onMouseLeave={() => setHoveredAnswer(null)}
            disabled={disabled}
            className={getAnswerStyle(answer)}
          >
            <span className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-2xl font-bold">
              {answerLabels[index]}
            </span>
            <span className="flex-1 text-left truncate">{answer.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
