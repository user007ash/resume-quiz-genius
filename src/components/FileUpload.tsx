
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, AlertCircle } from 'lucide-react';
import { Card } from './ui/card';
import { useToast } from './ui/use-toast';
import * as pdfjsLib from 'pdfjs-dist';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

interface FileUploadProps {
  onFileUpload: (file: File, resumeText: string) => void;
}

interface ResumeAnalysis {
  isResume: boolean;
  score: number;
  sections: {
    hasContact: boolean;
    hasEducation: boolean;
    hasExperience: boolean;
    hasSkills: boolean;
  };
  keywords: {
    total: number;
    matched: number;
  };
  formatting: {
    hasProperStructure: boolean;
    hasConsistentFormatting: boolean;
  };
  details: {
    missingFields: string[];
    suggestions: string[];
  };
}

export const FileUpload = ({ onFileUpload }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const analyzeResume = async (text: string): Promise<ResumeAnalysis> => {
    // Enhanced resume sections detection with more specific patterns
    const sections = {
      contact: /(?:contact|email|phone|address|linkedin|location)/i,
      education: /(?:education|university|college|degree|bachelor|master|phd|school)/i,
      experience: /(?:experience|work|employment|job|position|role|career)/i,
      skills: /(?:skills|technologies|tools|programming|languages|expertise|proficiencies)/i
    };

    // Extended keyword list for better accuracy
    const commonKeywords = [
      'experience', 'skills', 'education', 'project', 'achievement',
      'leadership', 'management', 'development', 'analysis', 'team',
      'communication', 'solution', 'implementation', 'strategy', 'results',
      'collaboration', 'innovative', 'problem-solving', 'optimization',
      'responsibility', 'initiative', 'coordination', 'planning'
    ];

    // More comprehensive resume indicators
    const resumeIndicators = [
      /resume|cv|curriculum\s*vitae/i,
      /work\s*experience|professional\s*experience/i,
      /education|qualification/i,
      /skills|expertise|competencies/i,
      /achievements|accomplishments/i
    ];

    const isResume = resumeIndicators.some(indicator => indicator.test(text));

    if (!isResume) {
      return {
        isResume: false,
        score: 0,
        sections: {
          hasContact: false,
          hasEducation: false,
          hasExperience: false,
          hasSkills: false
        },
        keywords: {
          total: commonKeywords.length,
          matched: 0
        },
        formatting: {
          hasProperStructure: false,
          hasConsistentFormatting: false
        },
        details: {
          missingFields: ['Valid resume format not detected'],
          suggestions: ['Please ensure the document is a properly formatted resume']
        }
      };
    }

    // Analyze sections
    const sectionsAnalysis = {
      hasContact: sections.contact.test(text),
      hasEducation: sections.education.test(text),
      hasExperience: sections.experience.test(text),
      hasSkills: sections.skills.test(text)
    };

    // Analyze keywords
    const matchedKeywords = commonKeywords.filter(keyword => 
      new RegExp(keyword, 'i').test(text)
    );

    // Enhanced formatting checks
    const hasProperStructure = 
      text.includes('\n') && 
      /[A-Z][a-z]+:/.test(text) && 
      text.split('\n').length > 10 &&
      /\d{4}/.test(text); // Contains years

    const hasConsistentFormatting = 
      (/•|\-|\*/).test(text) && // Has bullet points
      (/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\b/).test(text) && // Has months
      (/[A-Z][a-z]+,/).test(text); // Has proper comma usage

    // Calculate score with weighted components
    let score = 0;
    
    // Section scores (40%)
    score += sectionsAnalysis.hasContact ? 10 : 0;
    score += sectionsAnalysis.hasEducation ? 10 : 0;
    score += sectionsAnalysis.hasExperience ? 10 : 0;
    score += sectionsAnalysis.hasSkills ? 10 : 0;

    // Keyword matching (30%)
    const keywordScore = (matchedKeywords.length / commonKeywords.length) * 30;
    score += keywordScore;

    // Formatting (30%)
    score += hasProperStructure ? 15 : 0;
    score += hasConsistentFormatting ? 15 : 0;

    // Generate missing fields and suggestions
    const missingFields = [];
    const suggestions = [];

    if (!sectionsAnalysis.hasContact) {
      missingFields.push('Contact Information');
      suggestions.push('Add your email, phone number, and LinkedIn profile');
    }
    if (!sectionsAnalysis.hasEducation) {
      missingFields.push('Education');
      suggestions.push('Include your educational background with degrees and dates');
    }
    if (!sectionsAnalysis.hasExperience) {
      missingFields.push('Work Experience');
      suggestions.push('Add detailed work experience with dates and responsibilities');
    }
    if (!sectionsAnalysis.hasSkills) {
      missingFields.push('Skills');
      suggestions.push('List your relevant technical and soft skills');
    }
    if (!hasProperStructure) {
      suggestions.push('Improve document structure with clear section headings');
    }
    if (!hasConsistentFormatting) {
      suggestions.push('Use consistent formatting with bullet points and proper date formats');
    }

    return {
      isResume,
      score: Math.round(score),
      sections: sectionsAnalysis,
      keywords: {
        total: commonKeywords.length,
        matched: matchedKeywords.length
      },
      formatting: {
        hasProperStructure,
        hasConsistentFormatting
      },
      details: {
        missingFields,
        suggestions
      }
    };
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      toast({
        title: "Invalid File",
        description: "Please upload a PDF file.",
        variant: "destructive"
      });
      return;
    }

    const file = acceptedFiles[0];
    setIsProcessing(true);

    try {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size exceeds 5MB limit');
      }

      // Convert File to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Load PDF document
      const pdf = await pdfjsLib.getDocument({
        data: arrayBuffer,
        verbosity: 0
      }).promise;
      
      // Check if PDF is not blank
      if (pdf.numPages === 0) {
        throw new Error('The PDF file appears to be blank');
      }

      // Extract text from all pages
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }

      // Check if PDF has meaningful content
      if (fullText.trim().length < 100) {
        throw new Error('The PDF contains insufficient content');
      }

      const analysis = await analyzeResume(fullText);

      if (!analysis.isResume) {
        toast({
          title: "Invalid Resume Format",
          description: "The uploaded file doesn't appear to be a resume. Please ensure it contains standard resume sections.",
          variant: "destructive"
        });
        return;
      }

      onFileUpload(file, fullText);

      // Show detailed feedback
      toast({
        title: `Resume Analysis: ${analysis.score}%`,
        description: analysis.score < 70 
          ? `Areas to improve: ${analysis.details.missingFields.join(', ')}. ${analysis.details.suggestions[0]}`
          : "Great job! Your resume is well-optimized for ATS systems.",
        duration: 6000
      });

    } catch (error: any) {
      console.error('Error processing PDF:', error);
      toast({
        title: "Error Processing File",
        description: error.message || "Failed to process the PDF file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [onFileUpload, toast]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  return (
    <Card
      {...getRootProps()}
      className={`p-10 border-2 border-dashed transition-all duration-300 cursor-pointer 
        ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'}
        ${isProcessing ? 'opacity-50' : ''}
        hover:border-primary hover:bg-primary/5`}
      onDragEnter={() => setIsDragging(true)}
      onDragLeave={() => setIsDragging(false)}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        {isProcessing ? (
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        ) : (
          <Upload className="w-12 h-12 text-gray-400" />
        )}
        <div className="text-center">
          <p className="text-lg font-medium">
            {isProcessing ? 'Analyzing resume...' : 'Drop your resume here'}
          </p>
          <p className="text-sm text-gray-500">
            {isProcessing ? 'Please wait' : 'or click to browse'}
          </p>
        </div>
        <p className="text-xs text-gray-400 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Supports PDF (max 5MB)
        </p>
      </div>
    </Card>
  );
};
