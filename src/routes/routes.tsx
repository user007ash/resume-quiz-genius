
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

export const routes = [
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LandingPage />
      </Suspense>
    ),
  },
  {
    path: "/resume-analysis",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <InterviewProcess />
      </Suspense>
    ),
  },
  {
    path: "/interview/:sessionId",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <ProtectedRoute>
          <InterviewProcess />
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
