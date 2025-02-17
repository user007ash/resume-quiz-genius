
import { Button } from '@/components/ui/button';
import { Brain } from 'lucide-react';
import { FileUpload } from '@/components/FileUpload';
import { ATSScore } from '@/components/ATSScore';
import { QuestionCard } from '@/components/QuestionCard';
import { PerformanceReview } from '@/components/PerformanceReview';
import type { Answer, AnswerAnalysis, InterviewQuestion } from '@/types/interview';

interface InterviewProcessProps {
  step: number;
  atsScore: number | null;
  currentQuestionIndex: number;
  allQuestions: InterviewQuestion[];
  analysisResult: {
    hrScore: number;
    technicalScore: number;
    feedback: string[];
  };
  onFileUpload: (file: File, resumeText: string) => void;
  onAnswer: (answer: AnswerAnalysis) => void;
  onNextStep: () => void;
  onRestart: () => void;
  onHome: () => void;
}

export const InterviewProcess = ({
  step,
  atsScore,
  currentQuestionIndex,
  allQuestions,
  analysisResult,
  onFileUpload,
  onAnswer,
  onNextStep,
  onRestart,
  onHome,
}: InterviewProcessProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#eef2ff] py-12">
      <div className="container max-w-3xl mx-auto px-4">
        <div 
          className="text-center mb-12 cursor-pointer" 
          onClick={onHome}
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] bg-clip-text text-transparent">
            Resume Genius
          </h1>
          <p className="text-gray-600">Your AI-powered interview preparation assistant</p>
        </div>

        <div className="space-y-8">
          {step === 1 && (
            <div className="animate-fade-up">
              <FileUpload onFileUpload={onFileUpload} />
            </div>
          )}

          {step === 2 && atsScore !== null && (
            <div className="space-y-6">
              <ATSScore score={atsScore} />
              <div className="flex justify-center">
                <Button 
                  onClick={onNextStep}
                  className="bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] hover:from-[#4338ca] hover:to-[#6d28d9] text-white shadow-lg"
                >
                  Start Interview Prep
                  <Brain className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && allQuestions.length > 0 && (
            <QuestionCard
              question={allQuestions[currentQuestionIndex].question}
              questionType={allQuestions[currentQuestionIndex].type}
              onAnswer={onAnswer}
              isLast={currentQuestionIndex === allQuestions.length - 1}
            />
          )}

          {step === 4 && (
            <PerformanceReview 
              onRestart={onRestart}
              hrScore={analysisResult.hrScore}
              technicalScore={analysisResult.technicalScore}
              feedback={analysisResult.feedback}
            />
          )}
        </div>
      </div>
    </div>
  );
};
