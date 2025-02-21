
import { Button } from '@/components/ui/button';
import { Upload, ArrowRight, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface HeroProps {
  onGetStarted: () => void;
  onLearnMore: () => void;
  atsScore?: number | null;
}

export const Hero = ({ onGetStarted, onLearnMore, atsScore }: HeroProps) => {
  const navigate = useNavigate();
  const [showHighlight, setShowHighlight] = useState(false);

  useEffect(() => {
    if (atsScore !== null && atsScore >= 40) {
      setShowHighlight(true);
    } else {
      setShowHighlight(false);
    }
  }, [atsScore]);

  const handleTakeTest = () => {
    navigate('/online-test');
  };

  return (
    <div className="container mx-auto px-6 pt-32 pb-20">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h1 className="text-6xl font-bold leading-tight bg-gradient-to-r from-[#4f46e5] via-[#7c3aed] to-[#9333ea] bg-clip-text text-transparent">
          Elevate Your Career with AI-Powered Interviews
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Transform your interview preparation with our intelligent platform. Get personalized feedback, practice with AI, and land your dream job.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
          <Button 
            size="lg" 
            onClick={onGetStarted}
            className="bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] hover:from-[#4338ca] hover:to-[#6d28d9] text-white shadow-lg shadow-indigo-500/20 text-lg px-8 py-6 h-auto"
          >
            Upload Resume
            <Upload className="ml-2 w-5 h-5" />
          </Button>
          <Button 
            size="lg" 
            onClick={handleTakeTest}
            className={`${
              showHighlight 
                ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 animate-pulse' 
                : 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700'
            } text-white shadow-lg shadow-green-500/20 text-lg px-8 py-6 h-auto transition-all duration-300`}
            disabled={!showHighlight}
          >
            Take Test
            <ClipboardList className="ml-2 w-5 h-5" />
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={onLearnMore}
            className="border-[#4f46e5] text-[#4f46e5] hover:bg-[#4f46e5] hover:text-white text-lg px-8 py-6 h-auto"
          >
            Learn More
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
