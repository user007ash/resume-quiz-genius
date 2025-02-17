
import { Navbar } from '../layout/Navbar';
import { Hero } from './Hero';
import { Features } from './Features';

interface LandingPageProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  onGetStarted: () => void;
}

export const LandingPage = ({ activeSection, onNavigate, onGetStarted }: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#eef2ff]">
      <Navbar 
        activeSection={activeSection} 
        onNavigate={onNavigate} 
        onGetStarted={onGetStarted}
      />
      <Hero 
        onGetStarted={onGetStarted}
        onLearnMore={() => onNavigate('features')}
      />
      <Features />
    </div>
  );
};
