
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface TestQuestionProps {
  question: string;
  options: string[];
  onAnswer: (answer: string) => void;
  onTimeout: () => void;
}

export const TestQuestion = ({ question, options, onAnswer, onTimeout }: TestQuestionProps) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeout]);

  const handleAnswerClick = (answer: string) => {
    setSelectedAnswer(answer);
    onAnswer(answer);
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500">Time Remaining</span>
          <span className="text-sm font-bold text-primary">{timeLeft}s</span>
        </div>
        <Progress value={(timeLeft / 30) * 100} />
      </div>
      
      <h3 className="text-lg font-medium">{question}</h3>
      
      <div className="space-y-3">
        {options.map((option, index) => (
          <Button
            key={index}
            variant={selectedAnswer === option ? "default" : "outline"}
            className="w-full justify-start text-left"
            onClick={() => handleAnswerClick(option)}
            disabled={selectedAnswer !== null}
          >
            {option}
          </Button>
        ))}
      </div>
    </Card>
  );
};
