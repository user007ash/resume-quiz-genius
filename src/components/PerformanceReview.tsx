
import { Button } from './ui/button';
import { Card } from './ui/card';

interface PerformanceReviewProps {
  onRestart: () => void;
}

export const PerformanceReview = ({ onRestart }: PerformanceReviewProps) => {
  return (
    <Card className="p-6 animate-fade-up">
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-center">Interview Performance Review</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-medium text-green-800">HR Score</h3>
            <p className="text-2xl font-bold text-green-600">85%</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-800">Technical Score</h3>
            <p className="text-2xl font-bold text-blue-600">78%</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-medium">Key Observations</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Strong communication skills demonstrated in HR responses</li>
            <li>Technical answers could benefit from more specific examples</li>
            <li>Good understanding of core concepts shown</li>
            <li>Consider using the STAR method for behavioral questions</li>
          </ul>
        </div>

        <Button onClick={onRestart} className="w-full">
          Start Over
        </Button>
      </div>
    </Card>
  );
};
