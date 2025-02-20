
import { useState } from 'react';
import { TestQuestion } from '@/components/test/TestQuestion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const testQuestions = [
  {
    question: "What is the primary purpose of version control systems?",
    options: [
      "To track changes in code over time",
      "To make the code run faster",
      "To format code automatically",
      "To compile code into executable files"
    ],
    correctAnswer: "To track changes in code over time"
  },
  {
    question: "Which programming paradigm does React.js primarily follow?",
    options: [
      "Procedural Programming",
      "Object-Oriented Programming",
      "Functional Programming",
      "Declarative Programming"
    ],
    correctAnswer: "Declarative Programming"
  },
  {
    question: "What is the purpose of a REST API?",
    options: [
      "To style web pages",
      "To handle server-client communication",
      "To manage database connections",
      "To compile source code"
    ],
    correctAnswer: "To handle server-client communication"
  }
];

export const OnlineTest = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestionIndex < testQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
      }, 1000);
    } else {
      const score = newAnswers.reduce((acc, curr, idx) => {
        return curr === testQuestions[idx].correctAnswer ? acc + 1 : acc;
      }, 0);

      toast({
        title: "Test Completed!",
        description: `You scored ${score} out of ${testQuestions.length}`,
      });

      setTimeout(() => {
        navigate('/results');
      }, 2000);
    }
  };

  const handleTimeout = () => {
    toast({
      title: "Time's up!",
      description: "Moving to the next question...",
      variant: "destructive",
    });

    const newAnswers = [...answers, ""];
    setAnswers(newAnswers);

    if (currentQuestionIndex < testQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
      }, 1000);
    } else {
      setTimeout(() => {
        navigate('/results');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#eef2ff] py-8">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Technical Assessment</h2>
          <p className="text-gray-600">Question {currentQuestionIndex + 1} of {testQuestions.length}</p>
        </div>

        <TestQuestion
          question={testQuestions[currentQuestionIndex].question}
          options={testQuestions[currentQuestionIndex].options}
          onAnswer={handleAnswer}
          onTimeout={handleTimeout}
        />
      </div>
    </div>
  );
};
