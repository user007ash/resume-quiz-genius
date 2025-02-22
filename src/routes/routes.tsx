
import Index from '@/pages/Index';
import { OnlineTest } from '@/pages/OnlineTest';
import { VoiceTest } from '@/pages/VoiceTest';
import NotFound from '@/pages/NotFound';
import ResumeAnalysis from '@/pages/ResumeAnalysis';

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
    path: '/voice-test',
    element: <VoiceTest />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
