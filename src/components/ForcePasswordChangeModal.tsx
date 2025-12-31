import ResponsiveDialog from "@/components/ResponsiveDialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthState } from "@/hooks/useAuthState";
import { changePassword, updateUser } from "@/lib/auth-client";
import {
  changePasswordSchema,
  type ChangePasswordFormType,
} from "@/lib/validations/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface ForcePasswordChangeModalProps {
  open: boolean;
  onPasswordChanged: () => void;
}

export function ForcePasswordChangeModal({
  open,
  onPasswordChanged,
}: ForcePasswordChangeModalProps) {
  const { loading, setLoading, setSuccess, setError, resetState } =
    useAuthState();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ChangePasswordFormType>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormType) => {
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

        onSuccess: async () => {
          setSuccess("Password updated successfully!");
          toast.success("Password updated successfully!");

          try {
            await updateUser({
              isPasswordChanged: true,
            });
          } catch (error) {
            console.error("Failed to update password status:", error);
          }

          form.reset();
          setTimeout(() => {
            onPasswordChanged();
          }, 500);
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
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={() => {}}
      title="Change Your Password"
      description="Your account was just created. Please change your password before continuing."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      disabled={loading}
                      {...field}
                      placeholder="Current Password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      disabled={loading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Min 8 chars, 1 uppercase, 1 number"
                      disabled={loading}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      disabled={loading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter your new password"
                      disabled={loading}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      disabled={loading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={loading} className="w-full" size="lg">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Changing Password..." : "Change Password"}
          </Button>
        </form>
      </Form>

      <p className="text-xs text-muted-foreground text-center">
        This modal cannot be closed until you change your password
      </p>
    </ResponsiveDialog>
  );
}
