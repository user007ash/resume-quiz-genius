import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { ATSScore } from '@/components/ATSScore';
import { QuestionCard } from '@/components/QuestionCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { interviewQuestions } from '@/data/questions';

interface AnswerAnalysis {
  text: string;
  hesitations: number;
  duration: number;
  confidence: number;
}

interface Answer {
  question: string;
  analysis: AnswerAnalysis;
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

  const analyzeAnswers = (allAnswers: Answer[]) => {
    let hrScore = 0;
    let technicalScore = 0;
    
    allAnswers.forEach(answer => {
      // Calculate score based on confidence, hesitations, and duration
      const confidenceScore = answer.analysis.confidence * 40; // 40% weight to confidence
      const hesitationPenalty = Math.min(answer.analysis.hesitations * 5, 30); // Up to 30% penalty for hesitations
      const durationScore = answer.analysis.duration > 10 && answer.analysis.duration < 120 ? 30 : 15; // 30% for optimal duration
      
      const answerScore = Math.min(Math.max(confidenceScore + durationScore - hesitationPenalty, 0), 100);
      
      if (answer.type === 'hr') {
        hrScore += answerScore;
      } else {
        technicalScore += answerScore;
      }
    });

    // Calculate average scores
    const hrQuestions = allAnswers.filter(a => a.type === 'hr').length;
    const technicalQuestions = allAnswers.filter(a => a.type === 'technical').length;
    
    hrScore = Math.round(hrScore / (hrQuestions || 1));
    technicalScore = Math.round(technicalScore / (technicalQuestions || 1));

    return {
      hrScore,
      technicalScore,
      overallScore: Math.round((hrScore + technicalScore) / 2),
      feedback: generateFeedback(allAnswers)
    };
  };

  const generateFeedback = (answers: Answer[]): string[] => {
    const feedback: string[] = [];
    
    // Analyze confidence
    const avgConfidence = answers.reduce((sum, ans) => sum + ans.analysis.confidence, 0) / answers.length;
    if (avgConfidence < 0.7) {
      feedback.push("Try to speak more confidently and clearly");
    }

    // Analyze hesitations
    const totalHesitations = answers.reduce((sum, ans) => sum + ans.analysis.hesitations, 0);
    if (totalHesitations > answers.length * 2) {
      feedback.push("Work on reducing filler words and pauses in your responses");
    }

    // Analyze answer length
    const avgDuration = answers.reduce((sum, ans) => sum + ans.analysis.duration, 0) / answers.length;
    if (avgDuration < 30) {
      feedback.push("Consider providing more detailed responses");
    } else if (avgDuration > 120) {
      feedback.push("Try to be more concise in your answers");
    }

    // Add general feedback
    feedback.push("Practice structuring your answers using the STAR method");
    
    return feedback;
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
      const analysis = analyzeAnswers([...answers, {
        question: currentQuestion.question,
        analysis: answer,
        type: currentQuestion.type
      }]);
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
