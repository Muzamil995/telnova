"use client";

import { useState } from "react";
import { C, BD } from "@/components/landing/tokens";

export function StyledLabel({ htmlFor, children }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-semibold mb-1.5"
      style={{ color: C.onSurface, ...BD }}
    >
      {children}
    </label>
  );
}

export function StyledInput({
  id,
  name,
  type = "text",
  value,
  onChange,
  disabled,
  required,
  placeholder,
  autoComplete,
  maxLength,
  inputMode,
  className = "",
  style = {},
  ...rest
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      placeholder={placeholder}
      autoComplete={autoComplete}
      maxLength={maxLength}
      inputMode={inputMode}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-all disabled:opacity-50 ${className}`}
      style={{
        border: `1.5px solid ${focused ? "var(--brand-violet)" : C.outlineVariant}`,
        backgroundColor: C.surfaceLowest,
        color: C.onSurface,
        boxShadow: focused ? "0 0 0 3px rgba(0,81,213,0.10)" : "none",
        ...BD,
        ...style,
      }}
      {...rest}
    />
  );
}

export function PrimaryButton({
  children,
  type = "button",
  disabled,
  onClick,
  className = "",
  style = {},
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`px-6 py-3.5 rounded-xl font-bold text-sm transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 ${className}`}
      style={{ backgroundColor: C.primary, color: "#ffffff", ...BD, ...style }}
    >
      {children}
    </button>
  );
}

export function OutlineButton({
  children,
  type = "button",
  disabled,
  onClick,
  className = "",
  style = {},
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`px-5 py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={{
        border: `1.5px solid ${C.outlineVariant}`,
        color: C.onSurface,
        backgroundColor: "transparent",
        ...BD,
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.backgroundColor = C.surfaceLow;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      {children}
    </button>
  );
}
