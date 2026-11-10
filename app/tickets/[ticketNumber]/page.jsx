"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useRoleAuth } from "@/hooks/useRoleAuth";
import useAuthStore from "@/stores/authStore";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import Icon from "@/components/landing/Icon";
import { C, HL, BD, SHADOW } from "@/components/landing/tokens";
import { supportAPI } from "@/lib/api";

const STATUS_BAR = {
  open: "#ef4444",
  in_progress: "var(--brand-violet)",
  waiting_customer: "#f59e0b",
  resolved: "#22c55e",
  closed: "#9ca3af",
};

const STATUS_PILL = {
  open: { bg: "#fee2e2", color: "#dc2626" },
  in_progress: { bg: "#dbe1ff", color: "#003ea8" },
  waiting_customer: { bg: "#fef3c7", color: "#92400e" },
  resolved: { bg: "#dcfce7", color: "#15803d" },
  closed: { bg: "#f3f4f6", color: "#374151" },
};

const PRIORITY_PILL = {
  urgent: { bg: "#fee2e2", color: "#dc2626" },
  high: { bg: "#fee2e2", color: "#dc2626" },
  medium: { bg: "#fef3c7", color: "#92400e" },
  low: { bg: "#dcfce7", color: "#15803d" },
};

const statusLabels = {
  open: "Open",
  in_progress: "In Progress",
  waiting_customer: "Waiting",
  resolved: "Resolved",
  closed: "Closed",
};

export default function TicketDetailPage() {
  useRoleAuth({
    allowedRoles: ["user"],
    redirectTo: "/portal",
  });
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();
  const ticketNumber = params.ticketNumber;

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTicketDetails = async () => {
      if (!ticketNumber) return;

      try {
        setLoading(true);
        const response = await supportAPI.getTicketDetails(ticketNumber);
        if (response.success) {
          setTicket(response.ticket);
        }
      } catch (err) {
        console.error("Failed to fetch ticket details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketDetails();
  }, [ticketNumber]);

  return (
    <div style={{ backgroundColor: C.surface, minHeight: "100vh" }}>
      {user && <DashboardHeader user={user} />}

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-8 sm:px-8">
        <div className="space-y-8">
          {/* Back button + title */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm transition-colors"
              style={{
                border: `1.5px solid ${C.outlineVariant}`,
                color: C.onSurface,
                ...BD,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = C.surfaceLow)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <Icon name="arrow_back" size={16} />
              Back
            </button>
            <div>
              <h1
                className="text-2xl font-extrabold tracking-tight"
                style={{ ...HL, color: C.primary }}
              >
                Ticket Details
              </h1>
              <p
                className="text-sm mt-0.5"
                style={{ color: C.onSurfaceVariant, ...BD }}
              >
                View and manage your support request
              </p>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div
                  className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
                  style={{
                    borderColor: C.outlineVariant,
                    borderTopColor: "transparent",
                    borderLeftColor: "var(--brand-violet)",
                  }}
                />
                <p
                  className="mt-4 text-sm"
                  style={{ color: C.onSurfaceVariant, ...BD }}
                >
                  Loading ticket details...
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div
              className="rounded-2xl p-6 text-center"
              style={{
                backgroundColor: C.surfaceLowest,
                border: `1px solid #fee2e2`,
                ...SHADOW,
              }}
            >
              <p className="text-sm" style={{ color: "#dc2626", ...BD }}>
                Failed to load ticket: {error}
              </p>
              <button
                onClick={() => router.back()}
                className="mt-4 px-5 py-2 rounded-xl font-bold text-sm"
                style={{
                  border: `1.5px solid ${C.outlineVariant}`,
                  color: C.onSurface,
                  ...BD,
                }}
              >
                Go Back
              </button>
            </div>
          )}

          {/* Ticket */}
          {ticket && !loading && (
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: C.surfaceLowest,
                border: `1px solid ${C.outlineVariant}33`,
                borderLeft: `4px solid ${
                  STATUS_BAR[ticket.status] || STATUS_BAR.open
                }`,
                ...SHADOW,
              }}
            >
              {/* Ticket header */}
              <div
                className="px-6 py-5"
                style={{ borderBottom: `1px solid ${C.outlineVariant}33` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h2
                      className="text-xl font-extrabold tracking-tight"
                      style={{ ...HL, color: C.primary }}
                    >
                      {ticket.category}
                    </h2>
                    <p
                      className="mt-1 text-sm"
                      style={{ color: C.onSurfaceVariant, ...BD }}
                    >
                      Ticket #{ticket.ticketNumber}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span
                      className="px-3 py-1 rounded-full text-sm font-bold"
                      style={{
                        backgroundColor: (
                          STATUS_PILL[ticket.status] || STATUS_PILL.open
                        ).bg,
                        color: (STATUS_PILL[ticket.status] || STATUS_PILL.open)
                          .color,
                        ...BD,
                      }}
                    >
                      {statusLabels[ticket.status]}
                    </span>
                    <span
                      className="px-3 py-1 rounded-full text-sm font-semibold capitalize"
                      style={{
                        backgroundColor: (
                          PRIORITY_PILL[ticket.priority] || PRIORITY_PILL.medium
                        ).bg,
                        color: (
                          PRIORITY_PILL[ticket.priority] || PRIORITY_PILL.medium
                        ).color,
                        ...BD,
                      }}
                    >
                      {ticket.priority} Priority
                    </span>
                  </div>
                </div>
              </div>

              {/* Info grid */}
              <div className="px-6 py-6">
                <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                  <div>
                    <p
                      className="text-xs font-bold uppercase tracking-wide"
                      style={{ color: C.onSurfaceVariant, ...BD }}
                    >
                      Created
                    </p>
                    <p
                      className="mt-1.5 text-sm font-semibold"
                      style={{ color: C.onSurface, ...BD }}
                    >
                      {new Date(ticket.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-xs font-bold uppercase tracking-wide"
                      style={{ color: C.onSurfaceVariant, ...BD }}
                    >
                      Last Updated
                    </p>
                    <p
                      className="mt-1.5 text-sm font-semibold"
                      style={{ color: C.onSurface, ...BD }}
                    >
                      {new Date(ticket.updatedAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-xs font-bold uppercase tracking-wide"
                      style={{ color: C.onSurfaceVariant, ...BD }}
                    >
                      Submitted By
                    </p>
                    <p
                      className="mt-1.5 text-sm font-semibold"
                      style={{ color: C.onSurface, ...BD }}
                    >
                      {ticket.userName}
                    </p>
                  </div>
                  {ticket.resolvedAt && (
                    <div>
                      <p
                        className="text-xs font-bold uppercase tracking-wide"
                        style={{ color: C.onSurfaceVariant, ...BD }}
                      >
                        Resolved On
                      </p>
                      <p
                        className="mt-1.5 text-sm font-semibold"
                        style={{ color: C.onSurface, ...BD }}
                      >
                        {new Date(ticket.resolvedAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
