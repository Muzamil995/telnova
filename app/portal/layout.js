"use client";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { PortalSidebar } from "@/components/portal/portal-sidebar";
import { useRoleAuth } from "@/hooks/useRoleAuth";
import { C, BD } from "@/components/landing/tokens";

export default function PortalLayout({ children }) {
  const { isLoading, user, hasAccess } = useRoleAuth({
    allowedRoles: ["admin", "operator", "partner"],
    redirectTo: "/dashboard",
  });

  if (isLoading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: C.surface }}
      >
        <div className="text-center">
          <div
            className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
            style={{
              borderColor: C.outlineVariant,
              borderTopColor: "transparent",
              borderLeftColor: "var(--brand-violet)",
            }}
          />
          <p className="mt-4 text-sm" style={{ color: C.onSurfaceVariant, ...BD }}>
            Loading portal...
          </p>
        </div>
      </div>
    );
  }

  if (!hasAccess || !user) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: C.surface }}
      >
        <p className="text-sm" style={{ color: C.onSurfaceVariant, ...BD }}>
          Redirecting you to dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: C.surface }}>
      {user && <DashboardHeader user={user} />}

      <div className="flex flex-1">
        <PortalSidebar user={user} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

