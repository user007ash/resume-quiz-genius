
import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { ATSScore } from '@/components/ATSScore';
import { QuestionCard } from '@/components/QuestionCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { interviewQuestions } from '@/data/questions';

interface Answer {
  question: string;
  answer: string;
  type: 'hr' | 'technical';
}

const Index = () => {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentQuestionType, setCurrentQuestionType] = useState<'hr' | 'technical'>('hr');

  const allQuestions = [
    ...interviewQuestions.hr.map(q => ({ question: q, type: 'hr' as const })),
    ...interviewQuestions.technical.map(q => ({ question: q, type: 'technical' as const }))
  ];

  const handleFileUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    // Mock ATS score (replace with actual AI analysis)
    setAtsScore(Math.floor(Math.random() * 40) + 60);
    setStep(2);
  };

  const handleAnswer = (answer: string) => {
    const currentQuestion = allQuestions[currentQuestionIndex];
    setAnswers([...answers, {
      question: currentQuestion.question,
      answer,
      type: currentQuestion.type
    }]);

    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentQuestionType(allQuestions[currentQuestionIndex + 1].type);
    } else {
      analyzeAnswers([...answers, {
        question: currentQuestion.question,
        answer,
        type: currentQuestion.type
      }]);
      setStep(4);
    }
  };

  const analyzeAnswers = (allAnswers: Answer[]) => {
    // Mock AI analysis (replace with actual AI analysis)
    const hrScore = Math.floor(Math.random() * 30) + 70;
    const technicalScore = Math.floor(Math.random() * 30) + 70;
    const overallScore = Math.floor((hrScore + technicalScore) / 2);

    return {
      hrScore,
      technicalScore,
      overallScore,
      feedback: [
        "Great communication skills shown in HR responses",
        "Technical answers could benefit from more specific examples",
        "Good understanding of core concepts",
        "Consider providing more quantifiable results in your answers"
      ]
    };
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
              question={allQuestions[currentQuestionIndex].question}
              questionType={allQuestions[currentQuestionIndex].type}
              onAnswer={handleAnswer}
              isLast={currentQuestionIndex === allQuestions.length - 1}
            />
          )}

          {step === 4 && (
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
