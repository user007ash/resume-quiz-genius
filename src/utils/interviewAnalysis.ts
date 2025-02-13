
import { Answer } from '../types/interview';

export const analyzeAnswers = (allAnswers: Answer[]) => {
  let hrScore = 0;
  let technicalScore = 0;
  
  allAnswers.forEach(answer => {
    // Base score calculation
    let answerScore = 0;
    
    // Confidence score (40% weight)
    const confidenceScore = Math.round(answer.analysis.confidence * 40);
    
    // Duration score (30% weight)
    let durationScore = 0;
    if (answer.analysis.duration >= 30 && answer.analysis.duration <= 120) {
      durationScore = 30; // Optimal duration
    } else if (answer.analysis.duration > 0 && answer.analysis.duration < 30) {
      durationScore = Math.round((answer.analysis.duration / 30) * 30); // Partial score for short answers
    } else if (answer.analysis.duration > 120) {
      durationScore = Math.round((120 / answer.analysis.duration) * 30); // Penalty for very long answers
    }

    // Hesitation penalty (30% weight)
    const hesitationPenalty = Math.min(answer.analysis.hesitations * 10, 30);

    // Calculate final score for this answer
    answerScore = Math.min(Math.max(confidenceScore + durationScore - hesitationPenalty, 0), 100);

    // No answer detection
    if (answer.analysis.text.trim().length === 0 || answer.analysis.duration < 5) {
      answerScore = 0;
    }
    
    if (answer.type === 'hr') {
      hrScore += answerScore;
    } else {
      technicalScore += answerScore;
    }
  });

  // Calculate average scores
  const hrQuestions = allAnswers.filter(a => a.type === 'hr').length || 1;
  const technicalQuestions = allAnswers.filter(a => a.type === 'technical').length || 1;
  
  hrScore = Math.round(hrScore / hrQuestions);
  technicalScore = Math.round(technicalScore / technicalQuestions);

  return {
    hrScore,
    technicalScore,
    overallScore: Math.round((hrScore + technicalScore) / 2),
    feedback: generateFeedback(allAnswers, hrScore, technicalScore)
  };
};

const generateFeedback = (answers: Answer[], hrScore: number, technicalScore: number): string[] => {
  const feedback: string[] = [];
  
  // General performance feedback
  if (hrScore < 50 || technicalScore < 50) {
    feedback.push("Significant improvement needed in interview responses");
  }

  // No response or very short responses
  const shortOrEmptyAnswers = answers.filter(a => 
    a.analysis.text.trim().length === 0 || a.analysis.duration < 10
  ).length;
  
  if (shortOrEmptyAnswers > 0) {
    feedback.push(`${shortOrEmptyAnswers} question(s) received no response or very brief responses`);
  }

  // Analyze confidence
  const avgConfidence = answers.reduce((sum, ans) => sum + ans.analysis.confidence, 0) / answers.length;
  if (avgConfidence < 0.7) {
    feedback.push("Work on speaking more confidently and clearly");
  }

  // Analyze hesitations
  const totalHesitations = answers.reduce((sum, ans) => sum + ans.analysis.hesitations, 0);
  if (totalHesitations > answers.length * 2) {
    feedback.push("Reduce the use of filler words (um, uh) in your responses");
  }

  // Analyze answer length
  const avgDuration = answers.reduce((sum, ans) => sum + ans.analysis.duration, 0) / answers.length;
  if (avgDuration < 30) {
    feedback.push("Provide more detailed responses to showcase your experience");
  } else if (avgDuration > 120) {
    feedback.push("Try to be more concise in your answers while maintaining key details");
  }

  // Add general improvement suggestions
  feedback.push("Practice using the STAR method for behavioral questions");
  
  return feedback;
};
