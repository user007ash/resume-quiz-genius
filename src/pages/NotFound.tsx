
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8fafc] to-[#eef2ff]">
      <div className="text-center space-y-6 px-4">
        <div className="mb-8">
          <Search className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button
              className="bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] hover:from-[#4338ca] hover:to-[#6d28d9]"
            >
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="border-[#4f46e5] text-[#4f46e5] hover:bg-[#4f46e5] hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Popular pages you might be looking for:</p>
          <ul className="mt-2 space-y-1">
            <li>
              <Link to="/resume-analysis" className="text-indigo-600 hover:underline">
                Resume Analysis
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="text-indigo-600 hover:underline">
                Dashboard
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
