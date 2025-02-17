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
import { Check, ArrowRight } from 'lucide-react';
import type { Answer, AnswerAnalysis, InterviewQuestion } from '@/types/interview';

const Index = () => {
  const [step, setStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentQuestionType, setCurrentQuestionType] = useState<'hr' | 'technical'>('hr');
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

  if (step === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500"></div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Resume Genius
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Button variant="ghost">Features</Button>
            <Button variant="ghost">Pricing</Button>
            <Button variant="ghost">About</Button>
            <Button variant="outline">Sign in</Button>
            <Button onClick={() => setStep(1)} className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
              Get Started
            </Button>
          </div>
        </nav>

        <div className="container mx-auto px-6 pt-20 pb-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-6xl font-bold leading-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Master Your Interview Skills with AI
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Practice interviews, get instant feedback, and improve your chances of landing your dream job with our AI-powered interview preparation platform.
            </p>
            <div className="flex justify-center gap-4 pt-6">
              <Button 
                size="lg" 
                onClick={() => setStep(1)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-lg px-8 py-6 h-auto"
              >
                Start Practice Interview
                <ArrowRight className="ml-2" />
              </Button>
            </div>
            <div className="flex justify-center gap-8 pt-8 text-gray-600">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-purple-500" />
                <span>AI-Powered Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-purple-500" />
                <span>Instant Feedback</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-purple-500" />
                <span>Resume Scoring</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 pb-32">
          <div className="grid grid-cols-3 gap-8">
            <div className="group p-8 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 text-white transform transition-all hover:scale-105 hover:rotate-1">
              <h3 className="text-2xl font-bold mb-4">Smart Analysis</h3>
              <p>Get instant feedback on your interview performance with our AI-powered analysis system.</p>
            </div>
            <div className="group p-8 rounded-3xl bg-gradient-to-br from-purple-500 to-purple-600 text-white transform transition-all hover:scale-105 hover:rotate-1">
              <h3 className="text-2xl font-bold mb-4">Resume Scoring</h3>
              <p>Upload your resume and get detailed feedback on how to improve it for better results.</p>
            </div>
            <div className="group p-8 rounded-3xl bg-gradient-to-br from-pink-500 to-pink-600 text-white transform transition-all hover:scale-105 hover:rotate-1">
              <h3 className="text-2xl font-bold mb-4">Practice Questions</h3>
              <p>Access a vast library of common interview questions tailored to your industry.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-12">
      <div className="container max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  Start Interview Prep
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
