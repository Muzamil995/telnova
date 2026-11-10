"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Icon from "@/components/landing/Icon";
import { C, BD } from "@/components/landing/tokens";

const menuItems = [
  {
    label: "Dashboard",
    href: "/portal",
    icon: "dashboard",
    roles: ["admin", "operator", "partner"],
    match: "exact",
  },
  {
    label: "Support Tickets",
    href: "/portal/tickets",
    icon: "confirmation_number",
    roles: ["admin", "operator"],
    match: "prefix",
  },
  {
    label: "Users",
    href: "/users",
    icon: "group",
    roles: ["admin"],
    match: "exact",
  },
  {
    label: "Partners",
    href: "/portal/partners",
    icon: "handshake",
    roles: ["admin"],
    match: "prefix",
  },
  {
    label: "Payout Settings",
    href: "/portal/partner-settings",
    icon: "account_balance_wallet",
    roles: ["partner"],
    match: "exact",
  },
];

export function PortalSidebar({ user }) {
  const router = useRouter();
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState(null);

  const visibleMenuItems = user
    ? menuItems.filter((item) => item.roles.includes(user.role))
    : [];

  return (
    <aside
      className="hidden sm:flex w-[68px] flex-col items-center gap-2 py-6 relative shrink-0"
      style={{
        backgroundColor: C.surfaceLowest,
        borderRight: `1px solid ${C.outlineVariant}33`,
      }}
    >
      {visibleMenuItems.map((item) => {
        const isActive =
          item.match === "prefix"
            ? pathname === item.href || pathname.startsWith(`${item.href}/`)
            : pathname === item.href;

        return (
          <div key={item.href} className="relative">
            <button
              onClick={() => router.push(item.href)}
              onMouseEnter={() => setHoveredItem(item.href)}
              onMouseLeave={() => setHoveredItem(null)}
              title={item.label}
              className="flex items-center justify-center w-11 h-11 rounded-xl transition-all"
              style={{
                backgroundColor: isActive ? C.primaryContainer : "transparent",
                color: isActive ? "#ffffff" : C.onSurfaceVariant,
              }}
              onMouseEnter={(e) => {
                setHoveredItem(item.href);
                if (!isActive)
                  e.currentTarget.style.backgroundColor = C.surfaceLow;
              }}
              onMouseLeave={(e) => {
                setHoveredItem(null);
                if (!isActive)
                  e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <Icon
                name={item.icon}
                size={22}
                style={{ color: isActive ? "#ffffff" : C.onSurfaceVariant }}
              />
            </button>

            {hoveredItem === item.href && (
              <div
                className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap z-50 pointer-events-none"
                style={{
                  backgroundColor: C.primaryContainer,
                  color: "#ffffff",
                  ...BD,
                  boxShadow: "0 4px 16px rgba(17,28,45,0.18)",
                }}
              >
                {item.label}
                <div
                  className="absolute right-full top-1/2 -translate-y-1/2"
                  style={{
                    width: 0,
                    height: 0,
                    borderTop: "5px solid transparent",
                    borderBottom: "5px solid transparent",
                    borderRight: `6px solid ${C.primaryContainer}`,
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </aside>
  );
}
