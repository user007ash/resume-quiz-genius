
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Card } from './ui/card';

interface ATSScoreProps {
  score: number;
}

export const ATSScore = ({ score }: ATSScoreProps) => {
  const getColorByScore = (score: number) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#eab308';
    return '#ef4444';
  };

  const getFeedback = (score: number) => {
    if (score >= 80) {
      return [
        "Excellent! Your resume is well-optimized for ATS systems.",
        "Clear section headings and proper formatting detected.",
        "Good keyword optimization and content structure."
      ];
    } else if (score >= 60) {
      return [
        "Your resume needs some improvements for better ATS compatibility:",
        "Consider adding more industry-specific keywords.",
        "Ensure all important sections (Experience, Education, Skills) are clearly labeled.",
        "Use standard section headings for better parsing."
      ];
    } else {
      return [
        "Your resume requires significant optimization for ATS systems:",
        "Add clear section headings for Experience, Education, and Skills.",
        "Include more relevant keywords from job descriptions.",
        "Use a simpler format with standard sections.",
        "Avoid tables, images, or complex formatting."
      ];
    }
  };

  return (
    <Card className="p-6 animate-fade-up">
      <div className="flex flex-col items-center gap-4">
        <h3 className="text-xl font-semibold">ATS Compatibility Score</h3>
        <div className="w-32 h-32">
          <CircularProgressbar
            value={score}
            text={`${score}%`}
            styles={buildStyles({
              textSize: '20px',
              pathColor: getColorByScore(score),
              textColor: getColorByScore(score),
            })}
          />
        </div>
        <div className="text-sm text-gray-500 space-y-2 mt-4">
          {getFeedback(score).map((feedback, index) => (
            <p key={index} className="text-center">
              {index === 0 ? <strong>{feedback}</strong> : feedback}
            </p>
          ))}
        </div>
      </div>
    </Card>
  );
};
