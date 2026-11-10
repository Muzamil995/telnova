import { C, BD } from "@/components/landing/tokens";
import {
  StyledInput,
  StyledLabel,
  PrimaryButton,
  OutlineButton,
} from "@/components/auth/auth-ui";

export function SignupOtpStep({
  verificationType,
  otp,
  onOtpChange,
  onBack,
  onVerify,
  onResend,
  disabled = false,
}) {
  return (
    <form className="space-y-5" onSubmit={onVerify}>
      <div>
        <StyledLabel htmlFor="otp">Verification code</StyledLabel>
        <StyledInput
          id="otp"
          name="otp"
          inputMode="numeric"
          placeholder="Enter 6-digit code"
          value={otp}
          onChange={onOtpChange}
          maxLength={6}
          disabled={disabled}
          required
        />
        <p
          className="mt-1.5 text-xs"
          style={{ color: C.onSurfaceVariant, ...BD }}
        >
          We sent a code to your{" "}
          {verificationType === "email" ? "email" : "phone"}. It expires in 5
          minutes.
        </p>
      </div>

      <div className="flex gap-3 justify-end">
        <OutlineButton type="button" onClick={onBack} disabled={disabled}>
          Back
        </OutlineButton>
        <OutlineButton type="button" onClick={onResend} disabled={disabled}>
          Resend code
        </OutlineButton>
        <PrimaryButton type="submit" disabled={disabled} className="px-8">
          {disabled ? "Verifying..." : "Verify account"}
        </PrimaryButton>
      </div>
    </form>
  );
}
