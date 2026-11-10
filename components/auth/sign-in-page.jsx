import { AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/sign-in-form";

export function SignInPage() {
  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to access your account."
    >
      <SignInForm />
    </AuthShell>
  );
}
