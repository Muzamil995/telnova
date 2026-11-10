"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/landing/Icon";
import { C, HL, BD, SHADOW } from "@/components/landing/tokens";
import { toast } from "react-hot-toast";
import useAuthStore from "@/stores/authStore";

export function DashboardHeader({ user }) {
  const { logout } = useAuthStore();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const plan = user?.subscription?.plan || "free";
  const userName = user?.fullName || "User";
  const canManageSubscription = user?.role === "user";

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    toast.success("Logged out successfully");
    window.location.href = "/?logged_out=1";
  };

  return (
    <header
      className="sticky top-0 z-40"
      style={{
        backgroundColor: C.surfaceLowest,
        borderBottom: `1px solid ${C.outlineVariant}33`,
        boxShadow: "0 1px 12px rgba(25,28,30,0.06)",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.svg"
            alt="Telnova"
            width={100}
            height={40}
            priority
          />
        </Link>

        <div ref={ref} className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl font-semibold text-sm transition-colors"
            style={{
              border: `1.5px solid ${C.outlineVariant}`,
              color: C.onSurface,
              backgroundColor: open ? C.surfaceLow : "transparent",
              ...BD,
            }}
            onMouseEnter={(e) =>
              !open && (e.currentTarget.style.backgroundColor = C.surfaceLow)
            }
            onMouseLeave={(e) => {
              if (!open) e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0"
              style={{
                backgroundColor: C.primaryContainer,
                color: "#ffffff",
                ...HL,
              }}
            >
              {userName.charAt(0).toUpperCase()}
            </div>
            <span>{userName}</span>
            <Icon
              name="expand_more"
              size={18}
              style={{
                color: C.onSurfaceVariant,
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }}
            />
          </button>

          {open && (
            <div
              className="absolute right-0 top-full mt-2 w-56 rounded-2xl overflow-hidden z-50"
              style={{
                backgroundColor: C.surfaceLowest,
                boxShadow: "0 8px 30px rgba(25,28,30,0.12)",
                border: `1px solid ${C.outlineVariant}33`,
              }}
            >
              <div
                className="px-5 py-4"
                style={{ borderBottom: `1px solid ${C.outlineVariant}33` }}
              >
                <p
                  className="text-xs font-semibold"
                  style={{ color: C.onSurfaceVariant, ...BD }}
                >
                  Current plan
                </p>
                <p
                  className="text-sm font-bold capitalize mt-0.5"
                  style={{ color: C.onSurface, ...BD }}
                >
                  {canManageSubscription
                    ? plan === "free"
                      ? "Free plan"
                      : `${plan} plan`
                    : "Not applicable"}
                </p>
              </div>

              {canManageSubscription && (
                <a
                  href="/subscription"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 w-full px-5 py-3 text-sm font-semibold transition-colors"
                  style={{ color: C.onSurface, ...BD }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = C.surfaceLow)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <Icon
                    name="credit_card"
                    size={16}
                    style={{ color: C.onSurfaceVariant }}
                  />
                  Manage subscription
                </a>
              )}

              <div style={{ borderTop: `1px solid ${C.outlineVariant}33` }}>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-5 py-3 text-sm font-semibold transition-colors"
                  style={{ color: "#dc2626", ...BD }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#fee2e211")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <Icon name="logout" size={16} style={{ color: "#dc2626" }} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
