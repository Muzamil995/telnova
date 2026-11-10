import { AuthShell } from "@/components/auth/auth-shell";
import { SignupFlow } from "@/components/auth/signup-flow";

export function SignUpPage() {
  return (
    <AuthShell>
      <SignupFlow />
    </AuthShell>
  );
}
