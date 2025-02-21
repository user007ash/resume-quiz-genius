
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../layout/Navbar';
import { Hero } from './Hero';
import { Features } from './Features';

interface LandingPageProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  onGetStarted: () => void;
}

export const LandingPage = ({ activeSection, onNavigate, onGetStarted }: LandingPageProps) => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/resume-analysis');
    onGetStarted();
  };

  const handleLearnMore = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
    onNavigate('features');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#eef2ff]">
      <Navbar 
        activeSection={activeSection} 
        onNavigate={onNavigate} 
        onGetStarted={handleGetStarted}
      />
      <Hero 
        onGetStarted={handleGetStarted}
        onLearnMore={handleLearnMore}
      />
      <Features />
    </div>
  );
};
