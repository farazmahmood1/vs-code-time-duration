import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/lib/validations/auth";
import { forgetPassword } from "@/lib/auth-client";
import { useAuthState } from "@/hooks/useAuthState";

const ForgotPassword = () => {
  const { loading, setLoading, setError, setSuccess, resetState } =
    useAuthState();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgetPassword(
        {
          email: data.email,
          redirectTo: `${window.location.origin}/reset-password`,
        },
        {
          onResponse: () => {
            setLoading(false);
          },

          onRequest: () => {
            resetState();
            setLoading(true);
          },

          onSuccess: () => {
            setSuccess("Password reset link sent!");
            toast.success("Password reset link sent to your email!");
          },

          onError: (ctx) => {
            const message = ctx.error.message || "Failed to send reset link";

            toast.error(message);
            setError(message);
          },
        }
      );
    } catch (error) {
      console.error("Forgot password error:", error);

      toast.error("Something went wrong");
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <Card className="border-0">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Forgot Password?
        </CardTitle>
        <CardDescription className="text-center">
          Enter your email address and we'll send you a link to reset your
          password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              {...register("email")}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>

          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </form>
      </CardContent>
    </Card>
  );
};

export default ForgotPassword;
