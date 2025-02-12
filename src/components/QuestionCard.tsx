
import { useState, useEffect, useCallback } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Mic, MicOff } from 'lucide-react';

interface QuestionCardProps {
  question: string;
  onAnswer: (answer: string) => void;
  isLast: boolean;
  questionType: 'hr' | 'technical';
}

export const QuestionCard = ({ question, onAnswer, isLast, questionType }: QuestionCardProps) => {
  const [answer, setAnswer] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
          setAnswer(transcript);
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        setRecognition(recognition);
      }
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  }, [isListening, recognition]);

  return (
    <Card className="p-6 animate-fade-up">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium">{question}</h3>
          <span className="px-2 py-1 text-sm rounded bg-primary/10 text-primary">
            {questionType.toUpperCase()}
          </span>
        </div>
        <div className="relative">
          <Textarea
            placeholder="Type or speak your answer here..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="min-h-[100px]"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="absolute right-2 bottom-2"
            onClick={toggleListening}
          >
            {isListening ? (
              <MicOff className="h-4 w-4 text-red-500" />
            ) : (
              <Mic className="h-4 w-4 text-gray-500" />
            )}
          </Button>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            onClick={() => onAnswer(answer)}
            disabled={!answer.trim()}
          >
            {isLast ? 'Finish' : 'Next Question'}
          </Button>
        </div>
      </div>
    </Card>
  );
};
