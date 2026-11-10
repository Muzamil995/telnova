"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { authAPI, APIError } from "@/lib/api";
import { C, BD } from "@/components/landing/tokens";
import {
  StyledInput,
  StyledLabel,
  PrimaryButton,
} from "@/components/auth/auth-ui";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);

    try {
      const response = await authAPI.forgotPassword({ email });
      toast.success(response.message || "Password reset email sent");
      setEmail("");
    } catch (error) {
      if (error instanceof APIError) {
        toast.error(error.message || "Failed to send reset email");
      } else {
        toast.error("Unable to connect to the server.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <StyledLabel htmlFor="email">Email</StyledLabel>
        <StyledInput
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={isSubmitting}
          required
        />
      </div>

      <PrimaryButton type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Sending link..." : "Send reset link"}
      </PrimaryButton>

      <p
        className="text-center text-sm"
        style={{ color: C.onSurfaceVariant, ...BD }}
      >
        Remembered your password?{" "}
        <Link
          href="/signin"
          className="font-semibold hover:underline"
          style={{ color: "var(--brand-violet)" }}
        >
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
