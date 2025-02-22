
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Upload, Mic, ClipboardList, BarChart } from 'lucide-react';

export const AppNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const isResumeAnalysis = location.pathname === '/resume-analysis';

  const handleNavigation = (path: string) => {
    if (path === '/video-analysis') {
      return;
    }
    navigate(path);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center gap-2 cursor-pointer" onClick={() => handleNavigation('/')}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#7c3aed]"></div>
          <span className="font-bold text-lg bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] bg-clip-text text-transparent">
            Resume Genius
          </span>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Button
            variant={isActive('/') ? "secondary" : "ghost"}
            onClick={() => handleNavigation('/')}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
          <Button
            variant={isActive('/resume-analysis') ? "secondary" : "ghost"}
            onClick={() => handleNavigation('/resume-analysis')}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload Resume
          </Button>
          {!isResumeAnalysis && (
            <Button
              variant={isActive('/interview') ? "secondary" : "ghost"}
              onClick={() => handleNavigation('/interview')}
              className="flex items-center gap-2"
            >
              <Mic className="h-4 w-4" />
              AI Interview
            </Button>
          )}
          <Button
            variant={isActive('/online-test') ? "secondary" : "default"}
            onClick={() => handleNavigation('/online-test')}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
          >
            <ClipboardList className="h-4 w-4" />
            Take Test
          </Button>
          <Button
            variant={isActive('/results') ? "secondary" : "ghost"}
            onClick={() => handleNavigation('/results')}
            className="flex items-center gap-2"
          >
            <BarChart className="h-4 w-4" />
            Results
          </Button>
        </div>
      </div>
    </nav>
  );
};
