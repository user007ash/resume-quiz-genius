
import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { ATSScore } from '@/components/ATSScore';
import { QuestionCard } from '@/components/QuestionCard';
import { Button } from '@/components/ui/button';
import { PerformanceReview } from '@/components/PerformanceReview';
import { interviewQuestions } from '@/data/questions';
import { generateQuestionsFromResume } from '@/utils/resumeQuestionGenerator';
import { analyzeAnswers } from '@/utils/interviewAnalysis';
import { useToast } from '@/components/ui/use-toast';
import type { Answer, AnswerAnalysis, InterviewQuestion } from '@/types/interview';

const Index = () => {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentQuestionType, setCurrentQuestionType] = useState<'hr' | 'technical'>('hr');
  const [allQuestions, setAllQuestions] = useState<InterviewQuestion[]>([]);
  const { toast } = useToast();

  const handleFileUpload = async (uploadedFile: File, resumeText: string) => {
    setFile(uploadedFile);
    setAtsScore(Math.floor(Math.random() * 40) + 60);

    try {
      const generatedQuestions = await generateQuestionsFromResume(resumeText);
      
      const combinedQuestions = [
        ...generatedQuestions,
        ...interviewQuestions.hr.map(q => ({ question: q, type: 'hr' as const })),
        ...interviewQuestions.technical.map(q => ({ question: q, type: 'technical' as const }))
      ];

      const shuffledQuestions = combinedQuestions.sort(() => Math.random() - 0.5);
      setAllQuestions(shuffledQuestions);
      setStep(2);
    } catch (error) {
      console.error('Error preparing questions:', error);
      toast({
        title: "Error",
        description: "Failed to generate questions. Using default questions instead.",
        variant: "destructive"
      });

      const defaultQuestions = [
        ...interviewQuestions.hr.map(q => ({ question: q, type: 'hr' as const })),
        ...interviewQuestions.technical.map(q => ({ question: q, type: 'technical' as const }))
      ];
      setAllQuestions(defaultQuestions);
      setStep(2);
    }
  };

  const handleAnswer = (answer: AnswerAnalysis) => {
    const currentQuestion = allQuestions[currentQuestionIndex];
    setAnswers([...answers, {
      question: currentQuestion.question,
      analysis: answer,
      type: currentQuestion.type
    }]);

    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentQuestionType(allQuestions[currentQuestionIndex + 1].type);
    } else {
      analyzeAnswers([...answers, {
        question: currentQuestion.question,
        analysis: answer,
        type: currentQuestion.type
      }]);
      setStep(4);
    }
  };

  const handleRestart = () => {
    setStep(1);
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setFile(null);
    setAtsScore(null);
    setAllQuestions([]);
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

          {step === 3 && allQuestions.length > 0 && (
            <QuestionCard
              question={allQuestions[currentQuestionIndex].question}
              questionType={allQuestions[currentQuestionIndex].type}
              onAnswer={handleAnswer}
              isLast={currentQuestionIndex === allQuestions.length - 1}
            />
          )}

          {step === 4 && (
            <PerformanceReview onRestart={handleRestart} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
