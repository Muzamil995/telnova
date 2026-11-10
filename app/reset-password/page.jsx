import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="Create a new password"
      description="Choose a strong password to secure your account."
    >
      <ResetPasswordForm />
    </AuthShell>
  );
}
