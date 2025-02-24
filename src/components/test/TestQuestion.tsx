
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Timer } from 'lucide-react';

interface TestQuestionProps {
  question: string;
  options: string[];
  onAnswer: (answer: string) => void;
  onTimeout: () => void;
  onNext: () => void;
  onPrevious: () => void;
  currentAnswer?: string;
  showNavigation: boolean;
}

export const TestQuestion = ({ 
  question, 
  options, 
  onAnswer, 
  onTimeout, 
  onNext, 
  onPrevious, 
  currentAnswer,
  showNavigation 
}: TestQuestionProps) => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(currentAnswer || null);

  useEffect(() => {
    setSelectedAnswer(currentAnswer || null);
  }, [currentAnswer, question]);

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
          <div className="flex items-center gap-2 text-primary">
            <Timer className="w-4 h-4" />
            <span className="text-sm font-bold">{timeLeft}s</span>
          </div>
        </div>
        <Progress value={(timeLeft / 60) * 100} />
      </div>
      
      <h3 className="text-lg font-medium">{question}</h3>
      
      <div className="space-y-3">
        {options.map((option, index) => (
          <Button
            key={index}
            variant={selectedAnswer === option ? "default" : "outline"}
            className="w-full justify-start text-left"
            onClick={() => handleAnswerClick(option)}
          >
            {option}
          </Button>
        ))}
      </div>

      {showNavigation && (
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={onPrevious}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={onNext}
            className="gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </Card>
  );
};
