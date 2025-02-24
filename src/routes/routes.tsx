import { lazy, Suspense, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Lazy load components
const LandingPage = lazy(() => import('@/components/landing/LandingPage').then(module => ({ default: module.LandingPage })));
const InterviewProcess = lazy(() => import('@/components/interview/InterviewProcess').then(module => ({ default: module.InterviewProcess })));
const NotFound = lazy(() => import('@/pages/NotFound'));
const OnlineTest = lazy(() => import('@/pages/OnlineTest').then(module => ({ default: module.OnlineTest })));
const Dashboard = lazy(() => import('@/pages/Dashboard'));

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
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('home');

  const handleNavigation = (section: string) => {
    if (section === 'dashboard') {
      toast({
        title: "Coming Soon",
        description: "The dashboard feature will be available soon!",
        variant: "default",
      });
    } else if (section === 'about') {
      toast({
        title: "Coming Soon",
        description: "The about section will be available soon!",
        variant: "default",
      });
    }
    setActiveSection(section);
  };

  return (
    <LandingPage
      activeSection={activeSection}
      onNavigate={handleNavigation}
      onGetStarted={() => {
        setActiveSection('resume-analysis');
        navigate('/resume-analysis');
      }}
    />
  );
};

// Interview process wrapper with required props
const InterviewProcessWrapper = () => {
  const navigate = useNavigate();
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
      onRestart={() => {
        navigate('/resume-analysis');
      }}
      onHome={() => {
        navigate('/');
      }}
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
    path: "/online-test",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <OnlineTest />
      </Suspense>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <ProtectedRoute>
          <Dashboard />
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
