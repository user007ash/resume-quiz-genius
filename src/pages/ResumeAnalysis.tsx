
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { InterviewProcess } from '@/components/interview/InterviewProcess';
import { generateQuestionsFromResume } from '@/utils/resumeQuestionGenerator';
import { analyzeAnswers } from '@/utils/interviewAnalysis';
import { interviewQuestions } from '@/data/questions';
import type { Answer, AnswerAnalysis, InterviewQuestion, QuestionType } from '@/types/interview';

export default function ResumeAnalysis() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentType, setCurrentType] = useState<QuestionType>('technical');
  const [allQuestions, setAllQuestions] = useState<InterviewQuestion[]>([]);
  const [analysisResult, setAnalysisResult] = useState<{
    hrScore: number;
    technicalScore: number;
    feedback: string[];
  }>({ hrScore: 0, technicalScore: 0, feedback: [] });
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
    const newAnswers = [...answers, {
      question: currentQuestion.question,
      analysis: answer,
      type: currentQuestion.type
    }];
    
    setAnswers(newAnswers);

    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentType(allQuestions[currentQuestionIndex + 1].type);
    } else {
      const result = analyzeAnswers(newAnswers);
      setAnalysisResult({
        hrScore: result.hrScore,
        technicalScore: result.technicalScore,
        feedback: result.feedback
      });
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

  const handleComplete = () => {
    setStep(4);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#eef2ff] py-8">
      <InterviewProcess
        step={step}
        atsScore={atsScore}
        currentQuestionIndex={currentQuestionIndex}
        allQuestions={allQuestions}
        analysisResult={analysisResult}
        onFileUpload={handleFileUpload}
        onAnswer={handleAnswer}
        onNextStep={() => setStep(step + 1)}
        onRestart={handleRestart}
        onHome={() => setStep(0)}
        onComplete={handleComplete}
        currentType={currentType}
        setCurrentType={setCurrentType}
      />
    </div>
  );
}
