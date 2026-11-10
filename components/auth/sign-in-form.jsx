"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import useAuthStore from "@/stores/authStore";
import { authAPI, APIError } from "@/lib/api";
import { C, BD } from "@/components/landing/tokens";
import Icon from "@/components/landing/Icon";
import {
  StyledInput,
  StyledLabel,
  PrimaryButton,
} from "@/components/auth/auth-ui";

export function SignInForm() {
  const router = useRouter();
  const { login, setLoading, setError } = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setLoading(true);

    try {
      const response = await authAPI.signin({
        email: formData.email,
        password: formData.password,
      });

      if (response.success) {
        // Save user and token to store
        login(response.user, response.token);

        toast.success("Welcome back!", {
          duration: 3000,
        });

        // Check user role and redirect accordingly
        if (response.user.role && response.user.role !== "user") {
          // User is admin, operator, or partner - redirect to portal
          router.push("/portal");
        } else {
          // Regular user - redirect to dashboard
          router.push("/dashboard");
        }
      }
    } catch (error) {
      if (error instanceof APIError) {
        const errorMsg = error.message || "Failed to sign in";
        setError(errorMsg);

        toast.error(errorMsg);

        // Handle specific error cases
        if (error.status === 403) {
          setError("Please verify your email or phone number.");
          toast("Please verify your email or phone number.");
        }
      } else {
        setError("Network error. Please try again.");
        toast.error("Unable to connect to the server.");
      }
    } finally {
      setIsSubmitting(false);
      setLoading(false);
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
          value={formData.email}
          onChange={handleChange}
          disabled={isSubmitting}
          required
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <StyledLabel htmlFor="password">Password</StyledLabel>
          <Link
            href="/forgot-password"
            className="text-xs font-semibold hover:underline"
            style={{ color: "var(--brand-violet)", ...BD }}
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <StyledInput
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            disabled={isSubmitting}
            required
            className="pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
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

      <PrimaryButton type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Signing in..." : "Sign in"}
      </PrimaryButton>

      <p
        className="text-center text-sm"
        style={{ color: C.onSurfaceVariant, ...BD }}
      >
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-semibold hover:underline"
          style={{ color: "var(--brand-violet)" }}
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
