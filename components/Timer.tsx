'use client';

import { useEffect, useRef, useState } from 'react';

interface TimerProps {
  timeLimit: number;
  onTimeUp: () => void;
  isActive: boolean;
  questionKey: number;
}

export function Timer({ timeLimit, onTimeUp, isActive, questionKey }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const onTimeUpRef = useRef(onTimeUp);
  
  // Keep callback ref updated
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  // Handle timer tick
  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimeout(() => onTimeUpRef.current(), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, questionKey]);

  const progress = (timeLeft / timeLimit) * 100;
  const isUrgent = timeLeft <= 5;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-8 w-8">
        <svg className="h-8 w-8 rotate-[-90deg]">
          <circle
            cx="16"
            cy="16"
            r="14"
            fill="none"
            stroke={isUrgent ? '#ef4444' : '#3b82f6'}
            strokeWidth="4"
            strokeDasharray={`${2 * Math.PI * 14}`}
            strokeDashoffset={`${2 * Math.PI * 14 * (1 - progress / 100)}`}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <span
          className={`absolute inset-0 flex items-center justify-center text-lg font-bold ${
            isUrgent ? 'text-red-500' : 'text-blue-500'
          }`}
        >
          {timeLeft}
        </span>
      </div>
      <div className="h-2 w-48 overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-linear ${
            isUrgent ? 'bg-red-500' : 'bg-blue-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
