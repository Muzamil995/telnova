"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

export function RecentTickets() {
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentTickets = async () => {
      try {
        setLoading(true);
        const response = await supportAPI.getRecentTickets(4);
        if (response.success) {
          setTickets(response.tickets);
        }
      } catch (err) {
        console.error("Failed to fetch recent tickets:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentTickets();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "resolved":
        return "border-l-green-500";
      case "in_progress":
        return "border-l-blue-500";
      case "waiting_customer":
        return "border-l-yellow-500";
      case "open":
      default:
        return "border-l-red-500";
    }
  };

  return (
    <div
      className="flex flex-col overflow-hidden rounded-2xl"
      style={{
        height: "600px",
        minHeight: "600px",
        backgroundColor: C.surfaceLowest,
        border: `1px solid ${C.outlineVariant}33`,
        ...SHADOW,
      }}
    >
      {/* Header */}
      <div
        className="px-6 py-4 shrink-0"
        style={{ borderBottom: `1px solid ${C.outlineVariant}33` }}
      >
        <h2
          className="text-base font-extrabold tracking-tight"
          style={{ ...HL, color: C.primary }}
        >
          Recent Tickets
        </h2>
        <p
          className="text-xs mt-0.5"
          style={{ color: C.onSurfaceVariant, ...BD }}
        >
          Your support request history
        </p>
      </div>

      {/* Ticket list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading && (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm" style={{ color: C.onSurfaceVariant, ...BD }}>
              Loading tickets...
            </p>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm" style={{ color: "#dc2626", ...BD }}>
              Failed to load tickets
            </p>
          </div>
        )}

        {!loading && tickets.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <Icon
              name="confirmation_number"
              size={32}
              style={{ color: C.outlineVariant }}
            />
            <p
              className="text-sm text-center"
              style={{ color: C.onSurfaceVariant, ...BD }}
            >
              No tickets yet. Visit the support chat to create one.
            </p>
          </div>
        )}

        {!loading &&
          tickets.map((ticket) => {
            const sp = STATUS_PILL[ticket.status] || STATUS_PILL.open;
            const pp = PRIORITY_PILL[ticket.priority] || PRIORITY_PILL.medium;
            const barColor = STATUS_BAR[ticket.status] || STATUS_BAR.open;

            return (
              <div
                key={ticket.ticketNumber}
                onClick={() => router.push(`/tickets/${ticket.ticketNumber}`)}
                className="group cursor-pointer rounded-xl p-4 transition-all"
                style={{
                  borderLeft: `4px solid ${barColor}`,
                  backgroundColor: C.surface,
                  border: `1px solid ${C.outlineVariant}22`,
                  borderLeftWidth: "4px",
                  borderLeftColor: barColor,
                  borderLeftStyle: "solid",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = C.surfaceLow)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = C.surface)
                }
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-bold leading-tight truncate"
                      style={{ color: C.onSurface, ...BD }}
                    >
                      {ticket.category}
                    </p>
                    <p
                      className="mt-0.5 text-xs"
                      style={{ color: C.onSurfaceVariant, ...BD }}
                    >
                      {ticket.ticketNumber}
                    </p>
                  </div>
                  <span
                    className="shrink-0 px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{ backgroundColor: sp.bg, color: sp.color, ...BD }}
                  >
                    {statusLabels[ticket.status]}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-semibold capitalize"
                    style={{ backgroundColor: pp.bg, color: pp.color, ...BD }}
                  >
                    {ticket.priority}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: C.onSurfaceVariant, ...BD }}
                  >
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })}
      </div>

      {/* Footer */}
      <div
        className="shrink-0 p-4"
        style={{ borderTop: `1px solid ${C.outlineVariant}33` }}
      >
        <button
          onClick={() => router.push("/tickets")}
          className="w-full py-3 rounded-xl font-bold text-sm transition-opacity hover:opacity-90"
          style={{ backgroundColor: C.primary, color: "#ffffff", ...BD }}
        >
          View All Tickets
        </button>
      </div>
    </div>
  );
}
