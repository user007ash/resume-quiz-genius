
import { useState, useEffect, useCallback } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Mic, MicOff } from 'lucide-react';

interface QuestionCardProps {
  question: string;
  onAnswer: (answer: {
    text: string,
    hesitations: number,
    duration: number,
    confidence: number
  }) => void;
  isLast: boolean;
  questionType: 'hr' | 'technical';
}

export const QuestionCard = ({ question, onAnswer, isLast, questionType }: QuestionCardProps) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [hesitationCount, setHesitationCount] = useState(0);
  const [confidenceSum, setConfidenceSum] = useState(0);
  const [resultCount, setResultCount] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        recognition.onresult = (event) => {
          let finalTranscript = '';
          let hasHesitation = false;
          let currentConfidence = 0;

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            const confidence = event.results[i][0].confidence;
            
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
              currentConfidence += confidence;
              setResultCount(prev => prev + 1);
              setConfidenceSum(prev => prev + confidence);
            } else {
              // Check for hesitation markers like "uh", "um", pauses
              if (transcript.toLowerCase().includes('uh') || 
                  transcript.toLowerCase().includes('um') ||
                  transcript.toLowerCase().includes('...')) {
                hasHesitation = true;
              }
            }
          }

          if (hasHesitation) {
            setHesitationCount(prev => prev + 1);
          }

          if (finalTranscript) {
            setCurrentTranscript(prev => prev + ' ' + finalTranscript);
          }
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        setRecognition(recognition);
      }
    }
  }, []);

  const startRecording = useCallback(() => {
    if (!recognition) return;
    setCurrentTranscript('');
    setHesitationCount(0);
    setConfidenceSum(0);
    setResultCount(0);
    setRecordingStartTime(Date.now());
    recognition.start();
    setIsListening(true);
  }, [recognition]);

  const stopRecording = useCallback(() => {
    if (!recognition || !recordingStartTime) return;
    recognition.stop();
    setIsListening(false);
    
    const duration = (Date.now() - recordingStartTime) / 1000; // duration in seconds
    const averageConfidence = resultCount > 0 ? confidenceSum / resultCount : 0;
    
    onAnswer({
      text: currentTranscript.trim(),
      hesitations: hesitationCount,
      duration,
      confidence: averageConfidence
    });
  }, [recognition, recordingStartTime, currentTranscript, hesitationCount, confidenceSum, resultCount, onAnswer]);

  return (
    <Card className="p-6 animate-fade-up">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium">{question}</h3>
          <span className="px-2 py-1 text-sm rounded bg-primary/10 text-primary">
            {questionType.toUpperCase()}
          </span>
        </div>
        
        <div className="min-h-[100px] bg-gray-50 rounded-lg p-4 relative">
          {isListening ? (
            <div className="text-center space-y-2">
              <div className="animate-pulse text-primary">Recording...</div>
              <div className="text-sm text-gray-500">{currentTranscript || "Start speaking..."}</div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              Press the microphone button and start speaking
            </div>
          )}
        </div>

        <div className="flex justify-center gap-4">
          <Button
            type="button"
            variant={isListening ? "destructive" : "default"}
            size="lg"
            className="rounded-full w-16 h-16"
            onClick={isListening ? stopRecording : startRecording}
          >
            {isListening ? (
              <MicOff className="h-6 w-6" />
            ) : (
              <Mic className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};
