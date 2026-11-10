import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/landing/Icon";
import { C, HL, BD } from "@/components/landing/tokens";

const TRUST_POINTS = [
  {
    icon: "compare_arrows",
    text: "Compare providers and services in one place",
  },
  {
    icon: "support_agent",
    text: "Live specialists available to help you choose",
  },
  {
    icon: "bolt",
    text: "Manage all your home services from your dashboard",
  },
];

export function AuthShell({ children, title, description }) {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: C.surface }}>
      {/* Left brand panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-[44%] min-h-screen p-14"
        style={{ backgroundColor: C.primaryContainer }}
      >
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.svg"
            alt="Telnova"
            width={36}
            height={36}
            priority
          />
          <span
            className="text-white font-bold text-lg tracking-tight"
            style={HL}
          >
            Telnova.ai
          </span>
        </Link>

        <div>
          <h2
            className="text-4xl font-extrabold tracking-tighter leading-tight text-white mb-8"
            style={HL}
          >
            Manage your home services,{" "}
            <span style={{ color: C.secondaryFixedDim }}>
              all in one place.
            </span>
          </h2>
          <div className="flex flex-col gap-4">
            {TRUST_POINTS.map((p) => (
              <div key={p.text} className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${C.primaryFixed}18` }}
                >
                  <Icon
                    name={p.icon}
                    size={18}
                    style={{ color: C.secondaryFixedDim }}
                  />
                </div>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: C.primaryFixedDim, ...BD }}
                >
                  {p.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        <p
          className="text-xs"
          style={{ color: `${C.primaryFixedDim}66`, ...BD }}
        >
          © {new Date().getFullYear()} Telnova.ai. All rights reserved.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen px-8 py-12 lg:px-16">
        {/* Mobile-only logo */}
        <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
          <Image
            src="/logo.svg"
            alt="Telnova"
            width={30}
            height={30}
            priority
          />
          <span
            className="font-bold text-base tracking-tight"
            style={{ ...HL, color: C.onSurface }}
          >
            Telnova.ai
          </span>
        </Link>

        <div className="w-full max-w-[420px]">
          {title && (
            <div className="mb-8">
              <h1
                className="text-3xl font-extrabold tracking-tighter mb-2 leading-tight"
                style={{ ...HL, color: C.primary }}
              >
                {title}
              </h1>
              {description && (
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: C.onSurfaceVariant, ...BD }}
                >
                  {description}
                </p>
              )}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
