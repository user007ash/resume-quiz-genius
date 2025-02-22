import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { QuestionType, AnswerAnalysis } from '@/types/interview';

interface QuestionCardProps {
  question: string;
  questionType: QuestionType;
  onAnswer: (analysis: AnswerAnalysis) => void;
  isLast: boolean;
}

export const QuestionCard = ({
  question,
  questionType,
  onAnswer,
  isLast,
}: QuestionCardProps) => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnswerAnalysis | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate analysis and set progress
    if (audioURL) {
      const timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress < 100) {
            return prevProgress + 10;
          } else {
            clearInterval(timer);
            // Simulate analysis result
            setAnalysis({
              text: 'Simulated analysis text',
              hesitations: 2,
              duration: 15,
              confidence: 0.85,
            });
            return 100;
          }
        });
      }, 200);

      return () => clearInterval(timer);
    }
  }, [audioURL]);

  const startRecording = () => {
    setRecording(true);
    // Implement audio recording logic here
    setTimeout(() => {
      const simulatedAudioURL = 'simulated_audio.mp3';
      setAudioURL(simulatedAudioURL);
    }, 1000);
  };

  const stopRecording = () => {
    setRecording(false);
    // Implement stop recording logic here
  };

  const handleAnswer = () => {
    if (analysis) {
      onAnswer(analysis);
    }
  };

  return (
    <Card className="w-[500px]">
      <CardContent className="space-y-4">
        <h2 className="text-lg font-semibold">{questionType.toUpperCase()} Question</h2>
        <p>{question}</p>
        {audioURL ? (
          <>
            <audio src={audioURL} controls />
            {analysis ? (
              <>
                <Progress value={progress} />
                <p>Confidence: {analysis.confidence}</p>
                <Button onClick={handleAnswer} disabled={!analysis} className="w-full">
                  {isLast ? 'Complete Interview' : 'Next Question'}
                </Button>
              </>
            ) : (
              <Progress value={progress} />
            )}
          </>
        ) : (
          <Button
            onClick={recording ? stopRecording : startRecording}
            disabled={audioURL !== null}
            className="w-full"
          >
            {recording ? 'Stop Recording' : 'Start Recording'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
