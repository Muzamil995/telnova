"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SignupStepIndicator } from "@/components/auth/signup-step-indicator";
import { SignupDetailsStep } from "@/components/auth/signup-details-step";
import { SignupVerificationStep } from "@/components/auth/signup-verification-step";
import { SignupOtpStep } from "@/components/auth/signup-otp-step";
import { toast } from "react-hot-toast";
import useAuthStore from "@/stores/authStore";
import { authAPI } from "@/lib/api";
import { C, BD, HL } from "@/components/landing/tokens";

const initialForm = {
  fullName: "",
  email: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
};

export function SignupFlow() {
  const router = useRouter();
  const { login, setLoading } = useAuthStore();
  const [step, setStep] = useState(1);
  const [formValues, setFormValues] = useState(initialForm);
  const [verificationType, setVerificationType] = useState("phone");
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stepCopy = useMemo(() => {
    if (step === 1) {
      return {
        title: "Create your account",
        description: "Enter your details to get started.",
      };
    }

    if (step === 2) {
      return {
        title: "Choose verification method",
        description: "Select how you want to receive your one-time code.",
      };
    }

    return {
      title: "Enter verification code",
      description: "Complete signup by confirming your code.",
    };
  }, [step]);

  const passwordChecks = useMemo(() => {
    const password = formValues.password || "";

    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialCharacter = /[@$!%*?&]/.test(password);
    const hasOnlyAllowedCharacters = /^[A-Za-z\d@$!%*?&]+$/.test(password);

    return {
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialCharacter,
      hasOnlyAllowedCharacters,
      isValid:
        hasMinLength &&
        hasUppercase &&
        hasLowercase &&
        hasNumber &&
        hasSpecialCharacter &&
        hasOnlyAllowedCharacters,
    };
  }, [formValues.password]);

  const passwordsMatch =
    formValues.password.length > 0 &&
    formValues.confirmPassword.length > 0 &&
    formValues.password === formValues.confirmPassword;

  const canContinueDetails = Boolean(
    formValues.fullName.trim() &&
    formValues.email.trim() &&
    formValues.phoneNumber.trim() &&
    passwordChecks.isValid &&
    passwordsMatch,
  );

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleDetailsContinue(event) {
    event.preventDefault();

    // Validate passwords match
    if (!passwordsMatch) {
      toast.error("Passwords don't match");
      return;
    }

    // Validate password strength
    if (!passwordChecks.isValid) {
      toast.error(
        "Password must include 8+ characters, uppercase, lowercase, number, and special character (@$!%*?&)",
      );
      return;
    }

    setStep(2);
  }

  async function handleVerificationContinue() {
    setIsSubmitting(true);
    setLoading(true);

    try {
      const response = await authAPI.signup({
        fullName: formValues.fullName,
        email: formValues.email,
        password: formValues.password,
        phoneNumber: formValues.phoneNumber,
        verificationType,
      });

      if (response.success) {
        // Save user ID for verification
        setUserId(response.user._id);

        toast.success(response.message || "Account created successfully");

        setStep(3);
      }
    } catch (error) {
      // If email or phone already exists, go back to step 1
      if (error?.status === 409) {
        toast.error(error.message || "Email or phone is already registered");
        setStep(1);
      } else {
        toast.error(error?.message || "Failed to create account");
      }
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  }

  async function handleOtpVerify(event) {
    event.preventDefault();

    if (!otp.trim()) {
      toast.error("Please enter the verification code");
      return;
    }

    if (otp.length !== 6) {
      toast.error("Verification code must be 6 digits");
      return;
    }

    setIsSubmitting(true);
    setLoading(true);

    try {
      const response = await authAPI.verifyOTP({
        userId,
        email: formValues.email,
        otp,
        type: verificationType,
      });

      if (response.success) {
        // Update auth state with user and token from the verify endpoint.
        login(response.user, response.token);

        toast.success("Verification successful");

        // Redirect based on user role
        setTimeout(() => {
          if (response.user.role && response.user.role !== "user") {
            // User is admin, operator, or partner - redirect to portal
            router.push("/portal");
          } else {
            // Regular user - redirect to dashboard
            router.push("/dashboard");
          }
        }, 1000);
      }
    } catch (error) {
      toast.error(error?.message || "Verification failed");
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  }

  async function handleResendCode() {
    if (!userId) {
      toast.error("User not found. Please restart signup.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await authAPI.resendOTP({
        userId,
        email: formValues.email,
        type: verificationType,
        purpose: "verification",
      });

      if (response.success) {
        setOtp(""); // Clear current OTP input
        toast.success(response.message || "Code resent successfully");
      }
    } catch (error) {
      if (error?.status === 429 && error?.data?.remainingSeconds) {
        const minutes = Math.ceil(error.data.remainingSeconds / 60);
        toast(`Try again in ${minutes} minute${minutes > 1 ? "s" : ""}`);
      } else {
        toast.error(error?.message || "Failed to resend code");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      {/* Step indicator */}
      <div className="mb-8">
        <SignupStepIndicator currentStep={step} />
      </div>

      {/* Step title */}
      <div className="mb-6">
        <h1
          className="text-3xl font-extrabold tracking-tighter mb-1.5 leading-tight"
          style={{ ...HL, color: C.primary }}
        >
          {stepCopy.title}
        </h1>
        <p
          className="text-sm leading-relaxed"
          style={{ color: C.onSurfaceVariant, ...BD }}
        >
          {stepCopy.description}
        </p>
      </div>

      {/* Step content */}
      {step === 1 && (
        <SignupDetailsStep
          values={formValues}
          onChange={handleInputChange}
          onContinue={handleDetailsContinue}
          passwordChecks={passwordChecks}
          passwordsMatch={passwordsMatch}
          canContinue={canContinueDetails}
          disabled={isSubmitting}
        />
      )}

      {step === 2 && (
        <SignupVerificationStep
          value={verificationType}
          onChange={setVerificationType}
          onBack={() => setStep(1)}
          onContinue={handleVerificationContinue}
          disabled={isSubmitting}
        />
      )}

      {step === 3 && (
        <SignupOtpStep
          verificationType={verificationType}
          otp={otp}
          onOtpChange={(event) => setOtp(event.target.value)}
          onBack={() => setStep(2)}
          onVerify={handleOtpVerify}
          onResend={handleResendCode}
          disabled={isSubmitting}
        />
      )}

      {/* Footer */}
      <p
        className="mt-6 text-center text-sm"
        style={{ color: C.onSurfaceVariant, ...BD }}
      >
        Already have an account?{" "}
        <Link
          href="/signin"
          className="font-semibold hover:underline"
          style={{ color: "var(--brand-violet)" }}
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
