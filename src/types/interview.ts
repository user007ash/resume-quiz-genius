
export interface AnswerAnalysis {
  text: string;
  hesitations: number;
  duration: number;
  confidence: number;
}

export interface Answer {
  question: string;
  analysis: AnswerAnalysis;
  type: 'hr' | 'technical';
}

export interface InterviewQuestion {
  question: string;
  type: 'hr' | 'technical';
}
