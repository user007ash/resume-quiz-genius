
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { LandingPage } from '@/components/landing/LandingPage';
import { InterviewProcess } from '@/components/interview/InterviewProcess';
import { generateQuestionsFromResume } from '@/utils/resumeQuestionGenerator';
import { analyzeAnswers } from '@/utils/interviewAnalysis';
import { interviewQuestions } from '@/data/questions';
import type { Answer, AnswerAnalysis, InterviewQuestion } from '@/types/interview';

const Index = () => {
  const [step, setStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentQuestionType, setCurrentQuestionType] = useState<'hr' | 'technical'>('hr');
  const [allQuestions, setAllQuestions] = useState<InterviewQuestion[]>([]);
  const [activeSection, setActiveSection] = useState('home');
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
      setCurrentQuestionType(allQuestions[currentQuestionIndex + 1].type);
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

  const handleNavigation = (section: string) => {
    if (section === 'home') {
      setStep(0);
      setActiveSection('home');
    } else if (section === 'dashboard') {
      setActiveSection('dashboard');
      toast({
        title: "Coming Soon",
        description: "The dashboard feature will be available soon!",
        variant: "default",
      });
    } else {
      setActiveSection(section);
      toast({
        title: "Coming Soon",
        description: `The ${section} section is under development.`,
        variant: "default",
      });
    }
  };

  if (step === 0) {
    return (
      <LandingPage
        activeSection={activeSection}
        onNavigate={handleNavigation}
        onGetStarted={() => setStep(1)}
      />
    );
  }

  return (
    <InterviewProcess
      step={step}
      atsScore={atsScore}
      currentQuestionIndex={currentQuestionIndex}
      allQuestions={allQuestions}
      analysisResult={analysisResult}
      onFileUpload={handleFileUpload}
      onAnswer={handleAnswer}
      onNextStep={() => setStep(3)}
      onRestart={handleRestart}
      onHome={() => handleNavigation('home')}
    />
  );
};

export default Index;
