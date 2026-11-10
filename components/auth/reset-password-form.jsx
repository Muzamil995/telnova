"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { authAPI, APIError } from "@/lib/api";
import { C, BD } from "@/components/landing/tokens";
import Icon from "@/components/landing/Icon";
import {
  StyledInput,
  StyledLabel,
  PrimaryButton,
} from "@/components/auth/auth-ui";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      toast.error("Missing reset token. Please request a new reset link.");
      return;
    }

    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must be 8+ chars with uppercase, lowercase, number, and special character.",
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await authAPI.resetPassword({ token, password });
      toast.success(response.message || "Password reset successful");
      router.push("/signin");
    } catch (error) {
      if (error instanceof APIError) {
        toast.error(error.message || "Failed to reset password");
      } else {
        toast.error("Unable to connect to the server.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="space-y-5">
        <p
          className="text-sm leading-relaxed"
          style={{ color: C.onSurfaceVariant, ...BD }}
        >
          This reset link is missing required information or has expired.
        </p>
        <Link
          href="/forgot-password"
          className="block text-center text-sm font-semibold hover:underline"
          style={{ color: "var(--brand-violet)", ...BD }}
        >
          Request a new reset link
        </Link>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <StyledLabel htmlFor="password">New password</StyledLabel>
        <div className="relative">
          <StyledInput
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Enter your new password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isSubmitting}
            required
            className="pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2"
            style={{ color: C.onSurfaceVariant }}
            tabIndex={-1}
          >
            <Icon
              name={showPassword ? "visibility_off" : "visibility"}
              size={18}
            />
          </button>
        </div>
      </div>

      <div>
        <StyledLabel htmlFor="confirmPassword">
          Confirm new password
        </StyledLabel>
        <div className="relative">
          <StyledInput
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            disabled={isSubmitting}
            required
            className="pr-12"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2"
            style={{ color: C.onSurfaceVariant }}
            tabIndex={-1}
          >
            <Icon
              name={showConfirmPassword ? "visibility_off" : "visibility"}
              size={18}
            />
          </button>
        </div>
      </div>

      <PrimaryButton type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Resetting password..." : "Reset password"}
      </PrimaryButton>

      <p
        className="text-center text-sm"
        style={{ color: C.onSurfaceVariant, ...BD }}
      >
        Back to{" "}
        <Link
          href="/signin"
          className="font-semibold hover:underline"
          style={{ color: "var(--brand-violet)" }}
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
