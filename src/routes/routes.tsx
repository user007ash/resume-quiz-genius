
import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

// Lazy load components
const LandingPage = lazy(() => import('@/components/landing/LandingPage').then(module => ({ default: module.LandingPage })));
const InterviewProcess = lazy(() => import('@/components/interview/InterviewProcess').then(module => ({ default: module.InterviewProcess })));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Loading component for suspense fallback
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4f46e5]"></div>
  </div>
);

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();
  const isAuthenticated = false; // Replace with your auth logic

  if (!isAuthenticated) {
    toast({
      title: "Authentication Required",
      description: "Please sign in to access this page",
      variant: "destructive",
    });
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
};

// Landing page wrapper with required props
const LandingPageWrapper = () => {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState('home');

  const handleNavigation = (section: string) => {
    if (section === 'dashboard') {
      toast({
        title: "Coming Soon",
        description: "The dashboard feature will be available soon!",
        variant: "default",
      });
    }
    setActiveSection(section);
  };

  return (
    <LandingPage
      activeSection={activeSection}
      onNavigate={handleNavigation}
      onGetStarted={() => handleNavigation('resume-analysis')}
    />
  );
};

// Interview process wrapper with required props
const InterviewProcessWrapper = () => {
  const initialState = {
    step: 1,
    atsScore: null,
    currentQuestionIndex: 0,
    allQuestions: [],
    analysisResult: {
      hrScore: 0,
      technicalScore: 0,
      feedback: []
    }
  };

  const handleFileUpload = (file: File, resumeText: string) => {
    console.log('File uploaded:', file, resumeText);
    // Implement file upload logic
  };

  const handleAnswer = (answer: any) => {
    console.log('Answer submitted:', answer);
    // Implement answer handling logic
  };

  return (
    <InterviewProcess
      {...initialState}
      onFileUpload={handleFileUpload}
      onAnswer={handleAnswer}
      onNextStep={() => console.log('Next step')}
      onRestart={() => console.log('Restart')}
      onHome={() => console.log('Home')}
    />
  );
};

export const routes = [
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LandingPageWrapper />
      </Suspense>
    ),
  },
  {
    path: "/resume-analysis",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <InterviewProcessWrapper />
      </Suspense>
    ),
  },
  {
    path: "/interview/:sessionId",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <ProtectedRoute>
          <InterviewProcessWrapper />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <ProtectedRoute>
          <div>Dashboard (Coming Soon)</div>
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: "/signin",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <div>Sign In (Coming Soon)</div>
      </Suspense>
    ),
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <NotFound />
      </Suspense>
    ),
  },
];
