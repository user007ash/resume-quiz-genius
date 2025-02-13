
import * as pdfjsLib from 'pdfjs-dist';

export interface GeneratedQuestion {
  question: string;
  type: 'hr' | 'technical';
}

export const generateQuestionsFromResume = async (resumeText: string): Promise<GeneratedQuestion[]> => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an interview question generator. Generate relevant interview questions based on the resume content. Focus on both technical skills and behavioral aspects."
          },
          {
            role: "user",
            content: `Generate 4 interview questions (2 HR and 2 technical) based on this resume content: ${resumeText}`
          }
        ]
      })
    });

    const data = await response.json();
    const rawQuestions = data.choices[0].message.content;
    
    // Parse the response and format questions
    const questions = rawQuestions.split('\n')
      .filter(q => q.trim().length > 0)
      .map(q => {
        const isHR = q.toLowerCase().includes('hr:') || 
                    q.toLowerCase().includes('behavioral:') ||
                    !q.toLowerCase().includes('technical:');
        return {
          question: q.replace(/^(HR:|Technical:)/i, '').trim(),
          type: isHR ? 'hr' : 'technical'
        };
      });

    return questions;
  } catch (error) {
    console.error('Error generating questions:', error);
    return [];
  }
};
