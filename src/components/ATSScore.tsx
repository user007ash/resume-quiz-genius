
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
        <p className="text-sm text-gray-500 text-center mt-4">
          {score >= 80
            ? "Great! Your resume is well-optimized for ATS systems."
            : score >= 60
            ? "Your resume needs some improvements for better ATS compatibility."
            : "Your resume requires significant optimization for ATS systems."}
        </p>
      </div>
    </Card>
  );
};
