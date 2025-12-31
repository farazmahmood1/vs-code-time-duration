import ResponsiveDialog from "@/components/ResponsiveDialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEmployeeActions } from "@/hooks/useEmployees";
import { AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";

interface DeactivateEmployeeModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  employee: {
    id: string;
    name: string;
    email: string;
    banned?: boolean | null;
  } | null;
  onSuccess?: () => void;
}

export const DeactivateEmployeeModal = ({
  isOpen,
  onOpenChange,
  employee,
  onSuccess,
}: DeactivateEmployeeModalProps) => {
  const [step, setStep] = useState<"confirm" | "reason">("confirm");
  const [banReason, setBanReason] = useState("");
  const { banUser, unbanUser, isLoading } = useEmployeeActions();
  const [serverError, setServerError] = useState<string | null>(null);

  if (!employee) return null;

  const isDeactivating = employee.banned === false;
  const isReactivating = employee.banned === true;

  const handleDeactivate = async () => {
    setServerError(null);
    const result = await banUser(
      employee.id,
      banReason || "Account deactivated"
    );

    if (result.success) {
      onOpenChange(false);
      setBanReason("");
      setStep("confirm");
      onSuccess?.();
    } else {
      setServerError(
        typeof result.error === "string"
          ? result.error
          : "Failed to deactivate user"
      );
    }
  };

  const handleReactivate = async () => {
    setServerError(null);
    const result = await unbanUser(employee.id);

    if (result.success) {
      onOpenChange(false);
      setBanReason("");
      setStep("confirm");
      onSuccess?.();
    } else {
      setServerError(
        typeof result.error === "string"
          ? result.error
          : "Failed to reactivate user"
      );
    }
  };

  return (
    <ResponsiveDialog
      open={isOpen}
      onOpenChange={onOpenChange}
      title={
        isReactivating
          ? `Reactivate ${employee.name}?`
          : `Deactivate ${employee.name}?`
      }
      description={
        isReactivating
          ? `Reactivating this employee will allow them to sign in and access the system again.`
          : `Deactivating this employee will prevent them from signing in and revoke all their active sessions.`
      }
    >
      <div className="space-y-6">
        {/* Deactivation Content */}
        {isDeactivating && step === "reason" && (
          <div className="space-y-4">
            {serverError && (
              <div className="flex gap-2 p-3 rounded-md bg-destructive/10 text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <p className="text-sm">{serverError}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="ban-reason">Reason (Optional)</Label>
              <Textarea
                id="ban-reason"
                placeholder="e.g., Left the company, Performance issues, etc."
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                className="min-h-24"
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={() => {
              if (step === "reason") {
                setStep("confirm");
                setServerError(null);
              } else {
                onOpenChange(false);
                setBanReason("");
                setStep("confirm");
              }
            }}
            disabled={isLoading}
          >
            {step === "reason" ? "Back" : "Cancel"}
          </Button>

          {isDeactivating && step === "confirm" && (
            <Button
              variant="destructive"
              onClick={() => setStep("reason")}
              disabled={isLoading}
            >
              Continue
            </Button>
          )}

          {isDeactivating && step === "reason" && (
            <Button
              variant="destructive"
              onClick={handleDeactivate}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Deactivate
            </Button>
          )}

          {isReactivating && (
            <Button onClick={handleReactivate} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reactivate
            </Button>
          )}
        </div>
      </div>
    </ResponsiveDialog>
  );
};
