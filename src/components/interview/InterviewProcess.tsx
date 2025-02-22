import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { QuestionType } from '@/types/interview';

interface InterviewProcessProps {
  onComplete: () => void;
  currentType: QuestionType;
  setCurrentType: (type: QuestionType) => void;
}

export const InterviewProcess = ({
  onComplete,
  currentType,
  setCurrentType,
}: InterviewProcessProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    switch (currentType) {
      case 'technical':
        setProgress(33);
        break;
      case 'hr':
        setProgress(66);
        break;
      case 'behavioral':
        setProgress(100);
        break;
      default:
        setProgress(0);
        break;
    }
  }, [currentType]);

  const handleTypeChange = (type: QuestionType) => {
    setCurrentType(type);
  };

  return (
    <div className="space-y-4">
      <Progress value={progress} />
      <div className="flex justify-between">
        <Button
          variant={currentType === 'technical' ? 'default' : 'outline'}
          onClick={() => handleTypeChange('technical')}
        >
          Technical
        </Button>
        <Button
          variant={currentType === 'hr' ? 'default' : 'outline'}
          onClick={() => handleTypeChange('hr')}
        >
          HR
        </Button>
        <Button
          variant={currentType === 'behavioral' ? 'default' : 'outline'}
          onClick={() => handleTypeChange('behavioral')}
        >
          Behavioral
        </Button>
      </div>
      {currentType === 'behavioral' && (
        <Button onClick={onComplete} className="w-full">
          Complete Interview
        </Button>
      )}
    </div>
  );
};
