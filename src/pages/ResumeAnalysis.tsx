
import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { ATSScore } from '@/components/ATSScore';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { PerformanceReview } from '@/components/PerformanceReview';

export default function ResumeAnalysis() {
  const [file, setFile] = useState<File | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (uploadedFile: File, resumeText: string) => {
    setFile(uploadedFile);
    setIsAnalyzing(true);

    try {
      // Simulate ATS analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      const simulatedScore = Math.floor(Math.random() * 40) + 60; // Random score between 60-100
      setScore(simulatedScore);
      
      toast({
        title: "Analysis Complete",
        description: "Your resume has been analyzed successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRestart = () => {
    setFile(null);
    setScore(null);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#eef2ff] py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8">Resume Analysis</h1>
        
        <Card className="p-6 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold mb-2">Upload Your Resume</h2>
            <p className="text-gray-600">
              Our AI will analyze your resume and provide detailed feedback
            </p>
          </div>
          
          <FileUpload
            onFileUpload={handleFileUpload}
          />
        </Card>

        {score !== null && (
          <>
            <ATSScore score={score} />
            <PerformanceReview 
              onRestart={handleRestart}
              hrScore={score}
              technicalScore={Math.round(score * 0.9)} // Simulated technical score
              feedback={[
                "Strong professional experience section",
                "Clear presentation of skills and achievements",
                "Well-structured resume format",
                "Consider adding more quantifiable achievements"
              ]}
            />
          </>
        )}
      </div>
    </div>
  );
}
