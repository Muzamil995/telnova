import { useState } from "react";
import Icon from "@/components/landing/Icon";
import { PhoneInput } from "@/components/ui/phone-input";
import { C, BD } from "@/components/landing/tokens";
import {
  StyledInput,
  StyledLabel,
  PrimaryButton,
} from "@/components/auth/auth-ui";

export function SignupDetailsStep({
  values,
  onChange,
  onContinue,
  passwordChecks,
  passwordsMatch,
  canContinue,
  disabled = false,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const passwordRequirements = [
    {
      label: "At least 8 characters",
      met: Boolean(passwordChecks?.hasMinLength),
    },
    {
      label: "One uppercase letter",
      met: Boolean(passwordChecks?.hasUppercase),
    },
    {
      label: "One lowercase letter",
      met: Boolean(passwordChecks?.hasLowercase),
    },
    {
      label: "One number",
      met: Boolean(passwordChecks?.hasNumber),
    },
    {
      label: "One special character (@$!%*?&)",
      met: Boolean(passwordChecks?.hasSpecialCharacter),
    },
    {
      label: "Only letters, numbers, and @$!%*?&",
      met: Boolean(passwordChecks?.hasOnlyAllowedCharacters),
    },
  ];

  return (
    <form className="space-y-4" onSubmit={onContinue}>
      <div>
        <StyledLabel htmlFor="fullName">Full name</StyledLabel>
        <StyledInput
          id="fullName"
          name="fullName"
          value={values.fullName}
          onChange={onChange}
          disabled={disabled}
          required
        />
      </div>

      <div>
        <StyledLabel htmlFor="email">Email</StyledLabel>
        <StyledInput
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={onChange}
          disabled={disabled}
          required
        />
      </div>

      <div>
        <StyledLabel htmlFor="phoneNumber">Phone number</StyledLabel>
        <PhoneInput
          value={values.phoneNumber}
          onChange={onChange}
          disabled={disabled}
        />
      </div>

      <div>
        <StyledLabel htmlFor="password">Password</StyledLabel>
        <div className="relative">
          <StyledInput
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={values.password}
            onChange={onChange}
            disabled={disabled}
            required
            className="pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
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
        {values.password.length > 0 && (
          <ul className="mt-2 space-y-1">
            {passwordRequirements.map((req) => (
              <li
                key={req.label}
                className="flex items-center gap-2 text-xs"
                style={{
                  color: req.met ? C.primary : C.onSurfaceVariant,
                  ...BD,
                }}
              >
                <Icon
                  name={req.met ? "check_circle" : "radio_button_unchecked"}
                  size={13}
                  fill={req.met ? 1 : 0}
                />
                {req.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <StyledLabel htmlFor="confirmPassword">Confirm password</StyledLabel>
        <div className="relative">
          <StyledInput
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            value={values.confirmPassword}
            onChange={onChange}
            disabled={disabled}
            required
            className="pr-12"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
        {values.confirmPassword.length > 0 && !passwordsMatch && (
          <p className="mt-1 text-xs" style={{ color: "#c0392b", ...BD }}>
            Passwords do not match.
          </p>
        )}
      </div>

      <PrimaryButton
        type="submit"
        disabled={disabled || !canContinue}
        className="w-full"
      >
        {disabled ? "Processing..." : "Continue"}
      </PrimaryButton>
    </form>
  );
}
