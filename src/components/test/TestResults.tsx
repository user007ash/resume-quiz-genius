
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TestResultsProps {
  score: number;
  totalQuestions: number;
  answers: {
    question: string;
    userAnswer: string;
    correctAnswer: string;
    explanation: string;
  }[];
  onRetry: () => void;
}

export const TestResults = ({ score, totalQuestions, answers, onRetry }: TestResultsProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Assessment Results</h2>
          <div className="text-4xl font-bold text-primary">
            {score} / {totalQuestions}
          </div>
          <p className="text-gray-600">
            You answered {score} out of {totalQuestions} questions correctly
          </p>
        </div>
      </Card>

      <div className="space-y-4">
        {answers.map((answer, index) => (
          <Card key={index} className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{answer.question}</h3>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-24 text-sm text-gray-500">Your Answer:</div>
                  <div className="flex items-center gap-2">
                    {answer.userAnswer === answer.correctAnswer ? (
                      <CheckCircle2 className="text-green-500 w-5 h-5" />
                    ) : (
                      <XCircle className="text-red-500 w-5 h-5" />
                    )}
                    {answer.userAnswer || "No answer provided"}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-24 text-sm text-gray-500">Correct:</div>
                  <div className="text-green-700">{answer.correctAnswer}</div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900">Explanation:</h4>
                <p className="text-blue-800">{answer.explanation}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate('/resume-analysis')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Resume Analysis
        </Button>
        <Button onClick={onRetry}>
          Retry Assessment
        </Button>
      </div>
    </div>
  );
};
