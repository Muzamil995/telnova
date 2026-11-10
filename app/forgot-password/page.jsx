import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Reset your password"
      description="We’ll send a secure reset link to your email."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
