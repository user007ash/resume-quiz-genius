
import { Upload, Brain, BarChart } from 'lucide-react';

export const Features = () => {
  return (
    <div className="container mx-auto px-6 pb-32">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="group p-8 rounded-3xl bg-white border border-gray-100 shadow-xl shadow-indigo-100/20 transform transition-all hover:scale-105 hover:-translate-y-1">
          <div className="mb-4 p-3 rounded-2xl bg-indigo-50 w-fit">
            <Upload className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-bold mb-4 text-gray-900">Resume Analysis</h3>
          <p className="text-gray-600">Get instant feedback on your resume with our AI-powered analysis system.</p>
        </div>
        
        <div className="group p-8 rounded-3xl bg-white border border-gray-100 shadow-xl shadow-indigo-100/20 transform transition-all hover:scale-105 hover:-translate-y-1">
          <div className="mb-4 p-3 rounded-2xl bg-indigo-50 w-fit">
            <Brain className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-bold mb-4 text-gray-900">AI Interview Practice</h3>
          <p className="text-gray-600">Practice with our AI interviewer and receive detailed performance feedback.</p>
        </div>
        
        <div className="group p-8 rounded-3xl bg-white border border-gray-100 shadow-xl shadow-indigo-100/20 transform transition-all hover:scale-105 hover:-translate-y-1">
          <div className="mb-4 p-3 rounded-2xl bg-indigo-50 w-fit">
            <BarChart className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-bold mb-4 text-gray-900">Progress Tracking</h3>
          <p className="text-gray-600">Monitor your improvement with detailed analytics and performance metrics.</p>
        </div>
      </div>
    </div>
  );
};
