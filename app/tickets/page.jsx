"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

export default function TicketsPage() {
  useRoleAuth({
    allowedRoles: ["user"],
    redirectTo: "/portal",
  });
  const router = useRouter();
  const { user } = useAuthStore();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, open, in_progress, resolved, closed

  useEffect(() => {
    const fetchAllTickets = async () => {
      try {
        setLoading(true);
        const response = await supportAPI.getTickets();
        if (response.success) {
          setTickets(response.tickets);
        }
      } catch (err) {
        console.error("Failed to fetch tickets:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllTickets();
  }, []);

  const filteredTickets =
    filter === "all"
      ? tickets
      : tickets.filter((ticket) => ticket.status === filter);

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    inProgress: tickets.filter((t) => t.status === "in_progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
    closed: tickets.filter((t) => t.status === "closed").length,
  };

  return (
    <div style={{ backgroundColor: C.surface, minHeight: "100vh" }}>
      {user && <DashboardHeader user={user} />}

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-8 sm:px-8">
        <div className="space-y-8">
          {/* Page header */}
          <div>
            <h1
              className="text-3xl font-extrabold tracking-tight"
              style={{ ...HL, color: C.primary }}
            >
              Support Tickets
            </h1>
            <p
              className="mt-2 text-sm"
              style={{ color: C.onSurfaceVariant, ...BD }}
            >
              View and manage all your support requests
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: "Total", count: stats.total, bar: C.outlineVariant },
              { label: "Open", count: stats.open, bar: "#ef4444" },
              {
                label: "In Progress",
                count: stats.inProgress,
                bar: "var(--brand-violet)",
              },
              { label: "Resolved", count: stats.resolved, bar: "#22c55e" },
              { label: "Closed", count: stats.closed, bar: "#9ca3af" },
            ].map(({ label, count, bar }) => (
              <div
                key={label}
                className="rounded-2xl p-4"
                style={{
                  backgroundColor: C.surfaceLowest,
                  border: `1px solid ${C.outlineVariant}33`,
                  borderLeft: `4px solid ${bar}`,
                  ...SHADOW,
                }}
              >
                <p
                  className="text-xs font-semibold"
                  style={{ color: C.onSurfaceVariant, ...BD }}
                >
                  {label}
                </p>
                <p
                  className="text-2xl font-extrabold mt-1"
                  style={{ color: C.onSurface, ...HL }}
                >
                  {count}
                </p>
              </div>
            ))}
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "All Tickets" },
              { key: "open", label: "Open" },
              { key: "in_progress", label: "In Progress" },
              { key: "resolved", label: "Resolved" },
              { key: "closed", label: "Closed" },
            ].map((btn) => (
              <button
                key={btn.key}
                onClick={() => setFilter(btn.key)}
                className="px-4 py-2 rounded-full text-sm font-bold transition-all"
                style={
                  filter === btn.key
                    ? { backgroundColor: C.primary, color: "#ffffff", ...BD }
                    : {
                        backgroundColor: C.surfaceLowest,
                        color: C.onSurface,
                        border: `1.5px solid ${C.outlineVariant}`,
                        ...BD,
                      }
                }
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Tickets list */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: C.surfaceLowest,
              border: `1px solid ${C.outlineVariant}33`,
              ...SHADOW,
            }}
          >
            <div
              className="px-6 py-4"
              style={{ borderBottom: `1px solid ${C.outlineVariant}33` }}
            >
              <h2
                className="text-base font-extrabold"
                style={{ ...HL, color: C.primary }}
              >
                {filter === "all"
                  ? "All Tickets"
                  : statusLabels[filter] || "Tickets"}
              </h2>
              <p
                className="text-xs mt-0.5"
                style={{ color: C.onSurfaceVariant, ...BD }}
              >
                Showing {filteredTickets.length} of {tickets.length} tickets
              </p>
            </div>

            <div className="p-4 space-y-3">
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <p
                    className="text-sm"
                    style={{ color: C.onSurfaceVariant, ...BD }}
                  >
                    Loading tickets...
                  </p>
                </div>
              )}

              {error && (
                <div className="flex items-center justify-center py-12">
                  <p className="text-sm" style={{ color: "#dc2626", ...BD }}>
                    Failed to load tickets
                  </p>
                </div>
              )}

              {!loading && filteredTickets.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <Icon
                    name="inbox"
                    size={36}
                    style={{ color: C.outlineVariant }}
                  />
                  <p
                    className="text-sm"
                    style={{ color: C.onSurfaceVariant, ...BD }}
                  >
                    No
                    {filter !== "all"
                      ? ` ${statusLabels[filter]?.toLowerCase()}`
                      : ""}{" "}
                    tickets
                  </p>
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="px-5 py-2.5 rounded-xl font-bold text-sm transition-opacity hover:opacity-80"
                    style={{
                      border: `1.5px solid ${C.outlineVariant}`,
                      color: C.onSurface,
                      ...BD,
                    }}
                  >
                    Start a Support Chat
                  </button>
                </div>
              )}

              {!loading &&
                filteredTickets.map((ticket) => {
                  const sp = STATUS_PILL[ticket.status] || STATUS_PILL.open;
                  const pp =
                    PRIORITY_PILL[ticket.priority] || PRIORITY_PILL.medium;
                  const barColor = STATUS_BAR[ticket.status] || STATUS_BAR.open;

                  return (
                    <div
                      key={ticket.ticketNumber}
                      onClick={() =>
                        router.push(`/tickets/${ticket.ticketNumber}`)
                      }
                      className="cursor-pointer rounded-xl p-4 transition-all"
                      style={{
                        backgroundColor: C.surface,
                        border: `1px solid ${C.outlineVariant}22`,
                        borderLeft: `4px solid ${barColor}`,
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = C.surfaceLow)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = C.surface)
                      }
                    >
                      <div className="mb-3 flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-bold leading-tight"
                            style={{ color: C.onSurface, ...BD }}
                          >
                            {ticket.category}
                          </p>
                          <p
                            className="text-xs mt-0.5"
                            style={{ color: C.onSurfaceVariant, ...BD }}
                          >
                            {ticket.ticketNumber}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-bold"
                            style={{
                              backgroundColor: sp.bg,
                              color: sp.color,
                              ...BD,
                            }}
                          >
                            {statusLabels[ticket.status]}
                          </span>
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-semibold capitalize"
                            style={{
                              backgroundColor: pp.bg,
                              color: pp.color,
                              ...BD,
                            }}
                          >
                            {ticket.priority}
                          </span>
                        </div>
                      </div>

                      <div
                        className="grid grid-cols-2 gap-2 text-xs"
                        style={{ color: C.onSurfaceVariant, ...BD }}
                      >
                        <div>
                          <p className="font-semibold">Created</p>
                          {new Date(ticket.createdAt).toLocaleString()}
                        </div>
                        <div>
                          <p className="font-semibold">Updated</p>
                          {new Date(ticket.updatedAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
