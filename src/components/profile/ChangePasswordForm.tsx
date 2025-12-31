import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useAuthState } from "@/hooks/useAuthState";
import { changePassword } from "@/lib/auth-client";
import {
  changePasswordSchema,
  type ChangePasswordFormType,
} from "@/lib/validations/user";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export const ChangePasswordForm = () => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { loading, setLoading, setSuccess, setError, resetState } =
    useAuthState();

  const form = useForm<ChangePasswordFormType>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormType) => {
    try {
      await changePassword(
        {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
        {
          onRequest: () => {
            resetState();
            setLoading(true);
          },

          onResponse: () => {
            setLoading(false);
          },

          onSuccess: () => {
            setSuccess("Password updated successfully!");
            toast.success("Password updated successfully!");
            form.reset();
          },

          onError: (ctx) => {
            const code = ctx.error?.code;
            const msg = ctx.error?.message;

            let finalMessage = "Failed to update password";

            if (code === "INVALID_CREDENTIALS" || code === "INVALID_PASSWORD") {
              finalMessage = "Your current password is incorrect.";
            } else if (!msg || msg.toLowerCase().includes("invalid")) {
              finalMessage =
                "Unable to update password. Please check your inputs.";
            }

            toast.error(finalMessage);
            setError(finalMessage);
          },
        }
      );
    } catch (err) {
      console.error("Change password error:", err);
      toast.error("Something went wrong");
      setError("Something went wrong");
      setLoading(false);
    }
  };

  const newPassword = form.watch("newPassword");
  const confirmPassword = form.watch("confirmPassword");

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Update your password to keep your account secure
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label>Current Password</Label>
            <div className="relative">
              <Input
                type={showCurrent ? "text" : "password"}
                {...form.register("currentPassword")}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-xs text-red-500">
              {form.formState.errors.currentPassword?.message}
            </p>
          </div>

          <div className="space-y-2">
            <Label>New Password</Label>
            <div className="relative">
              <Input
                type={showNew ? "text" : "password"}
                {...form.register("newPassword")}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Must be at least 8 characters long.
            </p>
            <p className="text-xs text-red-500">
              {form.formState.errors.newPassword?.message}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Confirm New Password</Label>
            <div className="relative">
              <Input
                type={showConfirm ? "text" : "password"}
                {...form.register("confirmPassword")}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-xs text-red-500">
              {form.formState.errors.confirmPassword?.message ||
                (newPassword &&
                newPassword.length >= 8 &&
                confirmPassword &&
                confirmPassword.length >= 8 &&
                confirmPassword !== newPassword
                  ? "Passwords do not match"
                  : "")}
            </p>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="bg-brand hover:bg-brand/90"
          >
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
