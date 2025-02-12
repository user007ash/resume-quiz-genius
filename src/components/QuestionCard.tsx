
import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

interface QuestionCardProps {
  question: string;
  onAnswer: (answer: string) => void;
  isLast: boolean;
}

export const QuestionCard = ({ question, onAnswer, isLast }: QuestionCardProps) => {
  const [answer, setAnswer] = useState('');

  return (
    <Card className="p-6 animate-fade-up">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">{question}</h3>
        <Textarea
          placeholder="Type your answer here..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="min-h-[100px]"
        />
        <div className="flex justify-end">
          <Button
            onClick={() => onAnswer(answer)}
            disabled={!answer.trim()}
          >
            {isLast ? 'Finish' : 'Next Question'}
          </Button>
        </div>
      </div>
    </Card>
  );
};
