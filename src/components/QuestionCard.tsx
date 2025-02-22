
import { useState, useEffect, useCallback } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Mic, MicOff } from 'lucide-react';
import { useToast } from './ui/use-toast';

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
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'en-US';
        
        recognitionInstance.onresult = (event) => {
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

        recognitionInstance.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          if (event.error !== 'no-speech') {
            toast({
              title: "Recognition Error",
              description: "There was an error with speech recognition. Please try again.",
              variant: "destructive"
            });
            stopRecording();
          }
        };

        recognitionInstance.onend = () => {
          setIsListening(false);
        };

        setRecognition(recognitionInstance);
      } else {
        toast({
          title: "Browser Not Supported",
          description: "Speech recognition is not supported in your browser. Please try Chrome or Edge.",
          variant: "destructive"
        });
      }
    }

    return () => {
      if (recognition) {
        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onend = null;
        try {
          recognition.stop();
        } catch (error) {
          console.error('Error stopping recognition:', error);
        }
      }
    };
  }, []);

  const startRecording = useCallback(() => {
    if (!recognition) {
      toast({
        title: "Error",
        description: "Speech recognition is not available.",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      console.warn('Recognition is already active');
      return;
    }

    try {
      setCurrentTranscript('');
      setHesitationCount(0);
      setConfidenceSum(0);
      setResultCount(0);
      setRecordingStartTime(Date.now());
      recognition.start();
      setIsListening(true);
    } catch (error) {
      console.error('Error starting recognition:', error);
      toast({
        title: "Error",
        description: "Failed to start recording. Please try again.",
        variant: "destructive"
      });
    }
  }, [recognition, isListening, toast]);

  const stopRecording = useCallback(() => {
    if (!recognition || !recordingStartTime) return;

    try {
      recognition.stop();
      const duration = (Date.now() - recordingStartTime) / 1000;
      const averageConfidence = resultCount > 0 ? confidenceSum / resultCount : 0;
      
      onAnswer({
        text: currentTranscript.trim(),
        hesitations: hesitationCount,
        duration,
        confidence: averageConfidence
      });
    } catch (error) {
      console.error('Error stopping recognition:', error);
      toast({
        title: "Error",
        description: "Failed to stop recording. Please try again.",
        variant: "destructive"
      });
    }
  }, [recognition, recordingStartTime, currentTranscript, hesitationCount, confidenceSum, resultCount, onAnswer, toast]);

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
            disabled={!recognition}
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
