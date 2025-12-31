import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-100 to-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 -mr-40 -mt-40"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -ml-40 -mb-40"></div>
      </div>

      {/* Content */}
      <div className="max-w-3xl w-full relative z-10">
        <div className="flex flex-col items-center">
          {/* Illustration Side */}

          {/* Text Side */}
          <div className="text-center">
            {/* Large 404 */}
            <div className="mb-6">
              <span className="text-8xl md:text-9xl font-black text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-clip-text">
                404
              </span>
            </div>

            {/* Catchy Title */}
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3 leading-tight">
              Oops! Lost in <span className="text-blue-600">the Workflow</span>
            </h2>

            {/* Catchy Tagline */}
            <p className="text-lg text-slate-600 mb-2 font-medium">
              This page took an unplanned leave!
            </p>

            {/* Description */}
            <p className="text-slate-500 mb-8 leading-relaxed">
              The page you're looking for has drifted away. Don't worry, we'll
              get you back on track faster than completing a task.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                size="lg"
                className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 font-semibold"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Go Back
              </Button>
              <Button
                onClick={() => navigate("/")}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-blue-600/50"
              >
                <Home className="mr-2 h-5 w-5" />
                Back Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
