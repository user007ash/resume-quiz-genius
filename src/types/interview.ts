
export type QuestionType = 'technical' | 'hr' | 'behavioral';

export interface InterviewQuestion {
  question: string;
  type: QuestionType;
}

export interface Answer {
  question: string;
  analysis: AnswerAnalysis;
  type: QuestionType;
}

export interface AnswerAnalysis {
  text: string;
  hesitations: number;
  duration: number;
  confidence: number;
}
