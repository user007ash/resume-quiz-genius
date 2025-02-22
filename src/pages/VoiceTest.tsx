
import { useState } from 'react';
import { QuestionCard } from '@/components/QuestionCard';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { SkipForward, ArrowRight } from 'lucide-react';
import type { QuestionType, AnswerAnalysis } from '@/types/interview';

// Questions for each category
const questions = {
  technical: [
    "Can you explain the concept of RESTful APIs and their key principles?",
    "What's the difference between React props and state?",
    "Describe the event loop in JavaScript."
  ],
  hr: [
    "Tell me about a challenging project you've worked on.",
    "How do you handle conflicts in a team?",
    "What are your career goals for the next 5 years?"
  ],
  behavioral: [
    "Describe a situation where you had to meet a tight deadline.",
    "How do you prioritize tasks when handling multiple projects?",
    "Tell me about a time you had to learn a new technology quickly."
  ]
};

export const VoiceTest = () => {
  const [category, setCategory] = useState<QuestionType>('technical');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerAnalysis[]>([]);
  const { toast } = useToast();

  const currentQuestions = questions[category];
  const isLastQuestion = currentQuestionIndex === currentQuestions.length - 1;
  const isLastCategory = category === 'behavioral';

  const handleAnswer = (answer: AnswerAnalysis) => {
    setAnswers([...answers, answer]);
    toast({
      title: "Answer Recorded",
      description: "Use the navigation buttons to continue.",
    });
  };

  const handleSkip = () => {
    setAnswers([...answers, {
      text: "Question skipped",
      hesitations: 0,
      duration: 0,
      confidence: 0
    }]);
    handleNext();
  };

  const handleNext = () => {
    if (isLastQuestion) {
      if (isLastCategory) {
        toast({
          title: "Test Complete!",
          description: "Your responses have been recorded.",
        });
        return;
      }
      setCurrentQuestionIndex(0);
      setCategory(prev => {
        if (prev === 'technical') return 'hr';
        if (prev === 'hr') return 'behavioral';
        return prev;
      });
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#eef2ff] py-8">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {category.charAt(0).toUpperCase() + category.slice(1)} Assessment
          </h2>
          <p className="text-gray-600">
            Question {currentQuestionIndex + 1} of {currentQuestions.length}
          </p>
        </div>

        <div className="space-y-6">
          <QuestionCard
            question={currentQuestions[currentQuestionIndex]}
            questionType={category}
            onAnswer={handleAnswer}
            isLast={isLastQuestion && isLastCategory}
          />

          <div className="flex justify-between mt-4">
            <Button
              onClick={handleSkip}
              variant="outline"
              className="flex items-center gap-2"
            >
              <SkipForward className="w-4 h-4" />
              Skip Question
            </Button>
            <Button
              onClick={handleNext}
              className="flex items-center gap-2"
            >
              Next Question
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
