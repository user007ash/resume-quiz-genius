
import Index from '@/pages/Index';
import { OnlineTest } from '@/pages/OnlineTest';
import NotFound from '@/pages/NotFound';
import ResumeAnalysis from '@/pages/ResumeAnalysis';
import Dashboard from '@/pages/Dashboard';

export const routes = [
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/resume-analysis',
    element: <ResumeAnalysis />,
  },
  {
    path: '/online-test',
    element: <OnlineTest />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
