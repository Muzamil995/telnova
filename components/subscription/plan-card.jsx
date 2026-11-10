"use client";

import Icon from "@/components/landing/Icon";
import { C, HL, BD, SHADOW } from "@/components/landing/tokens";

export function PlanCard({
  planKey,
  name,
  price,
  tagline,
  features,
  ctaText,
  microcopy,
  popular = false,
  badge,
  current = false,
  onSelect,
  isLoading = false,
}) {
  const isPopular = popular;
  const darkCard = isPopular;

  return (
    <div
      className="relative flex flex-col rounded-2xl overflow-hidden"
      style={{
        backgroundColor: darkCard ? C.primaryContainer : C.surfaceLowest,
        border: current
          ? `2px solid var(--brand-violet)`
          : darkCard
            ? "none"
            : `1px solid ${C.outlineVariant}33`,
        boxShadow: darkCard
          ? "0 24px 48px rgba(17,28,45,0.28)"
          : (SHADOW.boxShadow ?? "0 20px 40px rgba(25,28,30,0.04)"),
      }}
    >
      {/* Badge row */}
      {(isPopular || badge || current) && (
        <div className="absolute top-4 right-4 flex gap-2">
          {isPopular && (
            <span
              className="px-2.5 py-1 rounded-full text-xs font-extrabold"
              style={{
                backgroundColor: "var(--brand-violet)",
                color: "#ffffff",
                ...BD,
              }}
            >
              Most popular
            </span>
          )}
          {badge && !isPopular && (
            <span
              className="px-2.5 py-1 rounded-full text-xs font-extrabold"
              style={{
                backgroundColor: C.secondaryFixed,
                color: C.onSecondaryFixedVariant,
                ...BD,
              }}
            >
              {badge}
            </span>
          )}
          {current && (
            <span
              className="px-2.5 py-1 rounded-full text-xs font-extrabold"
              style={{
                backgroundColor: `${C.outlineVariant}33`,
                color: C.onSurfaceVariant,
                ...BD,
              }}
            >
              Current
            </span>
          )}
        </div>
      )}

      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <h3
          className="text-lg font-extrabold tracking-tight"
          style={{ ...HL, color: darkCard ? "#ffffff" : C.primary }}
        >
          {name}
        </h3>
        <p
          className="mt-1 text-sm leading-relaxed"
          style={{
            color: darkCard ? C.primaryFixedDim : C.onSurfaceVariant,
            ...BD,
          }}
        >
          {tagline}
        </p>
        <p
          className="mt-4 text-3xl font-extrabold tracking-tight"
          style={{ ...HL, color: darkCard ? "#ffffff" : C.onSurface }}
        >
          {price}
        </p>
      </div>

      {/* Features */}
      <div className="flex-1 px-6 py-4">
        <ul className="space-y-2.5">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5">
              <Icon
                name="check_circle"
                size={16}
                style={{
                  color: darkCard ? C.secondaryFixedDim : "var(--brand-violet)",
                  marginTop: "2px",
                  flexShrink: 0,
                }}
              />
              <span
                className="text-sm leading-relaxed"
                style={{
                  color: darkCard ? `${C.primaryFixed}cc` : C.onSurfaceVariant,
                  ...BD,
                }}
              >
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="px-6 pb-6 pt-4 flex flex-col gap-2">
        <button
          disabled={current || isLoading}
          onClick={() => onSelect?.(planKey)}
          className="w-full py-3 rounded-xl font-bold text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{
            backgroundColor: current
              ? C.surfaceHigh
              : darkCard
                ? "#ffffff"
                : C.primary,
            color: current
              ? C.onSurfaceVariant
              : darkCard
                ? C.primaryContainer
                : "#ffffff",
            ...BD,
          }}
        >
          {current ? "Current plan" : isLoading ? "Redirecting..." : ctaText}
        </button>
        {microcopy && (
          <p
            className="text-xs text-center"
            style={{
              color: darkCard ? `${C.primaryFixed}99` : C.onSurfaceVariant,
              ...BD,
            }}
          >
            {microcopy}
          </p>
        )}
      </div>
    </div>
  );
}
