
import { Button } from '@/components/ui/button';
import { Brain, Upload, Home, BarChart, ClipboardList } from 'lucide-react';
import { FileUpload } from '@/components/FileUpload';
import { ATSScore } from '@/components/ATSScore';
import { QuestionCard } from '@/components/QuestionCard';
import { PerformanceReview } from '@/components/PerformanceReview';
import { AppNavbar } from '@/components/layout/AppNavbar';
import type { Answer, AnswerAnalysis, InterviewQuestion } from '@/types/interview';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

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
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleTakeTest = () => {
    toast({
      title: "Starting Technical Assessment",
      description: "Preparing your personalized assessment based on your resume...",
      duration: 3000,
    });
    navigate('/online-test');
  };

  const isValidATSScore = atsScore !== null && atsScore >= 40; // Only show test button if ATS score is 40 or above

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#eef2ff]">
      <AppNavbar />
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {step === 1 && (
            <div className="animate-fade-up">
              <FileUpload onFileUpload={onFileUpload} />
            </div>
          )}

          {step === 2 && atsScore !== null && (
            <div className="space-y-6">
              <ATSScore score={atsScore} />
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                {isValidATSScore && (
                  <Button 
                    onClick={handleTakeTest}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg"
                  >
                    Take Technical Assessment
                    <ClipboardList className="ml-2 w-5 h-5" />
                  </Button>
                )}
                <Button 
                  onClick={onNextStep}
                  className="bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] hover:from-[#4338ca] hover:to-[#6d28d9] text-white shadow-lg"
                >
                  Start Interview Prep
                  <Brain className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  variant="outline"
                  onClick={onRestart}
                  className="border-[#4f46e5] text-[#4f46e5]"
                >
                  Upload New Resume
                  <Upload className="ml-2 w-5 h-5" />
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
            <div className="space-y-6">
              <PerformanceReview 
                onRestart={onRestart}
                hrScore={analysisResult.hrScore}
                technicalScore={analysisResult.technicalScore}
                feedback={analysisResult.feedback}
              />
              <div className="flex justify-center gap-4">
                <Button 
                  onClick={onHome}
                  variant="outline"
                  className="border-[#4f46e5] text-[#4f46e5]"
                >
                  Go Home
                  <Home className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  onClick={onRestart}
                  className="bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] hover:from-[#4338ca] hover:to-[#6d28d9] text-white shadow-lg"
                >
                  Start New Interview
                  <Brain className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
