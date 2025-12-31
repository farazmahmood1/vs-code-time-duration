import { useSession } from "@/lib/auth-client";
import { Suspense, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const AuthLayout = () => {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending && session) {
      navigate("/");
    }
  }, [session, isPending, navigate]);

  if (isPending) return null;

  return (
    <div className="h-screen flex">
      <div
        className="hidden bg-[#253D90] lg:flex lg:w-[40%] items-center justify-center bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: `url('/imgs/brand-bg.png')` }}
      ></div>

      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="w-full max-w-md">
          <Suspense
            fallback={<p className="text-md font-medium loading-text"></p>}
          >
            <Outlet />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
