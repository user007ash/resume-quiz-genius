
import { Button } from './ui/button';
import { Card } from './ui/card';

interface PerformanceReviewProps {
  onRestart: () => void;
  hrScore: number;
  technicalScore: number;
  feedback: string[];
}

export const PerformanceReview = ({ onRestart, hrScore, technicalScore, feedback }: PerformanceReviewProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-50';
    if (score >= 60) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  const getTextColor = (score: number) => {
    if (score >= 80) return 'text-green-800';
    if (score >= 60) return 'text-yellow-800';
    return 'text-red-800';
  };

  return (
    <Card className="p-6 animate-fade-up">
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-center">Interview Performance Review</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg ${getScoreColor(hrScore)}`}>
            <h3 className={`font-medium ${getTextColor(hrScore)}`}>HR Score</h3>
            <p className={`text-2xl font-bold ${getTextColor(hrScore)}`}>{hrScore}%</p>
          </div>
          <div className={`p-4 rounded-lg ${getScoreColor(technicalScore)}`}>
            <h3 className={`font-medium ${getTextColor(technicalScore)}`}>Technical Score</h3>
            <p className={`text-2xl font-bold ${getTextColor(technicalScore)}`}>{technicalScore}%</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-medium">Key Observations</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            {feedback.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>

        <Button onClick={onRestart} className="w-full">
          Start Over
        </Button>
      </div>
    </Card>
  );
};
