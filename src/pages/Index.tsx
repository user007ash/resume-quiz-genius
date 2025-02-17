
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
import { Check, ArrowRight, Upload, Brain, BarChart } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#eef2ff]">
        <nav className="container mx-auto px-6 py-6 flex justify-between items-center backdrop-blur-sm bg-white/70 fixed top-0 left-0 right-0 z-50 border-b border-gray-100">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => handleNavigation('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#7c3aed]"></div>
            <span className="font-bold text-xl bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] bg-clip-text text-transparent">
              Resume Genius
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Button 
              variant="ghost" 
              onClick={() => handleNavigation('features')}
              className={activeSection === 'features' ? 'bg-gray-100' : ''}
            >
              Features
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => handleNavigation('dashboard')}
              className={activeSection === 'dashboard' ? 'bg-gray-100' : ''}
            >
              Dashboard
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => handleNavigation('about')}
              className={activeSection === 'about' ? 'bg-gray-100' : ''}
            >
              About
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleNavigation('signin')}
            >
              Sign in
            </Button>
            <Button 
              onClick={() => setStep(1)} 
              className="bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] hover:from-[#4338ca] hover:to-[#6d28d9] text-white shadow-lg shadow-indigo-500/20"
            >
              Get Started
            </Button>
          </div>
        </nav>

        <div className="container mx-auto px-6 pt-32 pb-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-6xl font-bold leading-tight bg-gradient-to-r from-[#4f46e5] via-[#7c3aed] to-[#9333ea] bg-clip-text text-transparent">
              Elevate Your Career with AI-Powered Interviews
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Transform your interview preparation with our intelligent platform. Get personalized feedback, practice with AI, and land your dream job.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
              <Button 
                size="lg" 
                onClick={() => setStep(1)}
                className="bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] hover:from-[#4338ca] hover:to-[#6d28d9] text-white shadow-lg shadow-indigo-500/20 text-lg px-8 py-6 h-auto"
              >
                Upload Resume
                <Upload className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => handleNavigation('features')}
                className="border-[#4f46e5] text-[#4f46e5] hover:bg-[#4f46e5] hover:text-white text-lg px-8 py-6 h-auto"
              >
                Learn More
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 pb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-3xl bg-white border border-gray-100 shadow-xl shadow-indigo-100/20 transform transition-all hover:scale-105 hover:-translate-y-1">
              <div className="mb-4 p-3 rounded-2xl bg-indigo-50 w-fit">
                <Upload className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Resume Analysis</h3>
              <p className="text-gray-600">Get instant feedback on your resume with our AI-powered analysis system.</p>
            </div>
            
            <div className="group p-8 rounded-3xl bg-white border border-gray-100 shadow-xl shadow-indigo-100/20 transform transition-all hover:scale-105 hover:-translate-y-1">
              <div className="mb-4 p-3 rounded-2xl bg-indigo-50 w-fit">
                <Brain className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">AI Interview Practice</h3>
              <p className="text-gray-600">Practice with our AI interviewer and receive detailed performance feedback.</p>
            </div>
            
            <div className="group p-8 rounded-3xl bg-white border border-gray-100 shadow-xl shadow-indigo-100/20 transform transition-all hover:scale-105 hover:-translate-y-1">
              <div className="mb-4 p-3 rounded-2xl bg-indigo-50 w-fit">
                <BarChart className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Progress Tracking</h3>
              <p className="text-gray-600">Monitor your improvement with detailed analytics and performance metrics.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#eef2ff] py-12">
      <div className="container max-w-3xl mx-auto px-4">
        <div 
          className="text-center mb-12 cursor-pointer" 
          onClick={() => handleNavigation('home')}
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] bg-clip-text text-transparent">
            Resume Genius
          </h1>
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
                <Button 
                  onClick={() => setStep(3)}
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
              onAnswer={handleAnswer}
              isLast={currentQuestionIndex === allQuestions.length - 1}
            />
          )}

          {step === 4 && (
            <PerformanceReview 
              onRestart={handleRestart}
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

export default Index;
