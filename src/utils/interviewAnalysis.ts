
import { Answer } from '../types/interview';

export const analyzeAnswers = (allAnswers: Answer[]) => {
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

export const generateFeedback = (answers: Answer[]): string[] => {
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
