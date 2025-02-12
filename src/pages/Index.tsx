
import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { ATSScore } from '@/components/ATSScore';
import { QuestionCard } from '@/components/QuestionCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Mock questions (replace with AI-generated questions later)
const mockQuestions = [
  "Tell me about your most challenging project.",
  "How do you handle conflicts in a team?",
  "What are your career goals for the next 5 years?",
];

const Index = () => {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const handleFileUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    // Mock ATS score (replace with actual AI analysis)
    setAtsScore(Math.floor(Math.random() * 40) + 60);
    setStep(2);
  };

  const handleAnswer = (answer: string) => {
    setAnswers([...answers, answer]);
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setStep(4);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="container max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Resume Genius</h1>
          <p className="text-gray-600">Your AI-powered interview preparation assistant</p>
        </div>

        <div className="space-y-8">
          {step === 1 && (
            <div className="animate-fade-up">
              <FileUpload onFileUpload={handleFileUpload} />
            </div>
          )}

          {step === 2 && atsScore !== null && (
            <div className="space-y-6">
              <ATSScore score={atsScore} />
              <div className="flex justify-center">
                <Button onClick={() => setStep(3)}>Start Interview Prep</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <QuestionCard
              question={mockQuestions[currentQuestionIndex]}
              onAnswer={handleAnswer}
              isLast={currentQuestionIndex === mockQuestions.length - 1}
            />
          )}

          {step === 4 && (
            <Card className="p-6 animate-fade-up">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-center">Interview Performance Review</h2>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    Based on your responses, here are some areas for improvement:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>Try to provide more specific examples in your answers</li>
                    <li>Focus on quantifiable achievements</li>
                    <li>Structure your responses using the STAR method</li>
                  </ul>
                </div>
                <Button
                  onClick={() => {
                    setStep(1);
                    setAnswers([]);
                    setCurrentQuestionIndex(0);
                    setFile(null);
                    setAtsScore(null);
                  }}
                  className="w-full"
                >
                  Start Over
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
