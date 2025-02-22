
import { useState } from 'react';
import { LandingPage } from '@/components/landing/LandingPage';

export default function Index() {
  const [activeSection, setActiveSection] = useState('home');

  const handleNavigation = (section: string) => {
    setActiveSection(section);
  };

  return (
    <LandingPage
      activeSection={activeSection}
      onNavigate={handleNavigation}
      onGetStarted={() => null}
    />
  );
}
