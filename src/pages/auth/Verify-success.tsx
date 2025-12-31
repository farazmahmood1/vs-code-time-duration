import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const VerifySuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="text-center space-y-6 max-w-md w-full">
        <CheckCircle className="w-20 h-20 text-green-600 mx-auto animate-pulse" />
        <h1 className="text-3xl font-bold text-gray-800">Email Verified!</h1>
        <p className="text-gray-600">
          Your account is now active. Redirecting to dashboard...
        </p>
        <Button
          onClick={() => navigate("/")}
          className="bg-primary hover:bg-primary/90"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default VerifySuccess;
