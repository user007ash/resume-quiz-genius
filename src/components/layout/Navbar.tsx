
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  onGetStarted: () => void;
}

export const Navbar = ({ activeSection, onNavigate, onGetStarted }: NavbarProps) => {
  const navigate = useNavigate();

  const handleNavigation = (section: string) => {
    if (section === 'home') {
      navigate('/');
    } else if (section === 'signin') {
      navigate('/signin');
    } else if (section === 'features') {
      const featuresSection = document.getElementById('features');
      if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
    onNavigate(section);
  };

  return (
    <nav className="container mx-auto px-6 py-6 flex justify-between items-center backdrop-blur-sm bg-white/70 fixed top-0 left-0 right-0 z-50 border-b border-gray-100">
      <div 
        className="flex items-center gap-2 cursor-pointer" 
        onClick={() => handleNavigation('home')}
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#7c3aed]"></div>
        <span className="font-bold text-xl bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] bg-clip-text text-transparent">
          Resume Genius
        </span>
      </div>
      <div className="flex items-center gap-6">
        <Button 
          variant="ghost" 
          onClick={() => handleNavigation('features')}
          className={activeSection === 'features' ? 'bg-gray-100' : ''}
        >
          Features
        </Button>
        <Button 
          variant="ghost" 
          onClick={() => handleNavigation('dashboard')}
          className={activeSection === 'dashboard' ? 'bg-gray-100' : ''}
        >
          Dashboard
        </Button>
        <Button 
          variant="ghost" 
          onClick={() => handleNavigation('about')}
          className={activeSection === 'about' ? 'bg-gray-100' : ''}
        >
          About
        </Button>
        <Button 
          variant="outline"
          onClick={() => handleNavigation('signin')}
        >
          Sign in
        </Button>
        <Button 
          onClick={onGetStarted}
          className="bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] hover:from-[#4338ca] hover:to-[#6d28d9] text-white shadow-lg shadow-indigo-500/20"
        >
          Get Started
        </Button>
      </div>
    </nav>
  );
};
