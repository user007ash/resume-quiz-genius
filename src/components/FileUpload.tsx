import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { Card } from './ui/card';
import { useToast } from './ui/use-toast';
import * as pdfjsLib from 'pdfjs-dist';

// Initialize PDF.js with a bundled worker
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
}

export const FileUpload = ({ onFileUpload }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const analyzeResume = async (text: string): Promise<ResumeAnalysis> => {
    // Common resume sections and keywords
    const sections = {
      contact: /(?:email|phone|address|linkedin)/i,
      education: /(?:education|university|college|degree|bachelor|master|phd)/i,
      experience: /(?:experience|work|employment|job|position|role)/i,
      skills: /(?:skills|technologies|tools|programming|languages)/i
    };

    const commonKeywords = [
      'experience', 'skills', 'education', 'project', 'achievement',
      'leadership', 'management', 'development', 'analysis', 'team',
      'communication', 'solution', 'implementation', 'strategy', 'results'
    ];

    // Check if it's actually a resume
    const resumeIndicators = [
      /resume|cv|curriculum\s*vitae/i,
      /work\s*experience/i,
      /education|qualification/i,
      /skills|expertise/i
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

    // Check formatting
    const hasProperStructure = text.includes('\n') && 
      /[A-Z][a-z]+:/.test(text) && 
      text.split('\n').length > 10;

    const hasConsistentFormatting = 
      (/•|\-|\*/).test(text) && // Has bullet points
      (/\d{4}/).test(text) &&   // Has years
      (/[A-Z][a-z]+,/).test(text); // Has proper comma usage

    // Calculate score
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
      }
    };
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      try {
        // Convert File to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        
        // Load PDF document
        const pdf = await pdfjsLib.getDocument({
          data: arrayBuffer,
          verbosity: 0
        }).promise;
        
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

        const analysis = await analyzeResume(fullText);

        if (!analysis.isResume) {
          toast({
            title: "Invalid Document",
            description: "The uploaded file doesn't appear to be a resume. Please upload a valid resume.",
            variant: "destructive"
          });
          return;
        }

        onFileUpload(file, fullText);

        toast({
          title: "Resume Analysis Complete",
          description: `Score: ${analysis.score}%. ${
            analysis.score < 70 
              ? "Consider improving your resume's structure and content." 
              : "Great job! Your resume is well-optimized."
          }`,
          duration: 5000
        });

      } catch (error) {
        console.error('Error processing PDF:', error);
        toast({
          title: "Error",
          description: "Failed to process the PDF file. Please try again.",
          variant: "destructive"
        });
      }
    }
  }, [onFileUpload, toast]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
  });

  return (
    <Card
      {...getRootProps()}
      className={`p-10 border-2 border-dashed transition-all duration-300 cursor-pointer 
        ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'}
        hover:border-primary hover:bg-primary/5`}
      onDragEnter={() => setIsDragging(true)}
      onDragLeave={() => setIsDragging(false)}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        <Upload className="w-12 h-12 text-gray-400" />
        <div className="text-center">
          <p className="text-lg font-medium">Drop your resume here</p>
          <p className="text-sm text-gray-500">or click to browse</p>
        </div>
        <p className="text-xs text-gray-400">Supports PDF</p>
      </div>
    </Card>
  );
};
