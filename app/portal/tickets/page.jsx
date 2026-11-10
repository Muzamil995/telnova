"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRoleAuth } from "@/hooks/useRoleAuth";
import { supportAPI } from "@/lib/api";
import { C, HL, BD, SHADOW } from "@/components/landing/tokens";
import Icon from "@/components/landing/Icon";

const STATUS_PILL = {
  open: { bg: "#fee2e2", color: "#dc2626" },
  resolved: { bg: "#dcfce7", color: "#15803d" },
  closed: { bg: "#f3f4f6", color: "#374151" },
};

const PRIORITY_PILL = {
  urgent: { bg: "#fee2e2", color: "#dc2626" },
  high: { bg: "#fee2e2", color: "#dc2626" },
  medium: { bg: "#fef3c7", color: "#92400e" },
  low: { bg: "#dcfce7", color: "#15803d" },
};

function Pill({ label, map }) {
  const style = map[label?.toLowerCase()] || {
    bg: C.surfaceHigh,
    color: C.onSurfaceVariant,
  };
  return (
    <span
      style={{
        display: "inline-block",
        backgroundColor: style.bg,
        color: style.color,
        borderRadius: 6,
        padding: "2px 10px",
        fontSize: 12,
        fontWeight: 600,
        textTransform: "capitalize",
        ...BD,
      }}
    >
      {label}
    </span>
  );
}

function TokenCard({ children, style = {} }) {
  return (
    <div
      style={{
        backgroundColor: C.surfaceLowest,
        borderRadius: 16,
        border: `1px solid ${C.outlineVariant}44`,
        padding: "24px",
        ...SHADOW,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function PrimaryBtn({ children, onClick, disabled, size = "default" }) {
  const pad = size === "sm" ? "7px 14px" : "10px 20px";
  const fz = size === "sm" ? 13 : 14;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: disabled ? C.surfaceHigh : C.primaryContainer,
        color: disabled ? C.onSurfaceVariant : "#ffffff",
        border: "none",
        borderRadius: 9,
        padding: pad,
        fontSize: fz,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        ...BD,
      }}
    >
      {children}
    </button>
  );
}

function OutlineBtn({ children, onClick, disabled, size = "default" }) {
  const pad = size === "sm" ? "6px 13px" : "9px 19px";
  const fz = size === "sm" ? 13 : 14;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: "transparent",
        color: C.primaryContainer,
        border: `1.5px solid ${C.outlineVariant}`,
        borderRadius: 9,
        padding: pad,
        fontSize: fz,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        gap: 6,
        ...BD,
      }}
    >
      {children}
    </button>
  );
}

function StyledSelect({ value, onChange, children }) {
  return (
    <select
      value={value}
      onChange={onChange}
      style={{
        border: `1.5px solid ${C.outlineVariant}`,
        borderRadius: 10,
        padding: "10px 14px",
        fontSize: 14,
        color: C.onSurface,
        backgroundColor: C.surfaceLowest,
        outline: "none",
        cursor: "pointer",
        ...BD,
      }}
    >
      {children}
    </select>
  );
}

export default function PortalTicketsPage() {
  const router = useRouter();
  const { isLoading, user } = useRoleAuth({
    allowedRoles: ["admin", "operator"],
    redirectTo: "/portal",
  });

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [resolvingTicket, setResolvingTicket] = useState(null);
  const [resolveError, setResolveError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);

  const handleOpenTicketDialog = async (ticket) => {
    try {
      setDialogLoading(true);
      const response = await supportAPI.getPortalTicketDetails(
        ticket.ticketNumber,
      );
      if (response.success) {
        setSelectedTicket(response.ticket);
        setDialogOpen(true);
      }
    } catch (err) {
      console.error("Failed to fetch ticket details:", err);
    } finally {
      setDialogLoading(false);
    }
  };

  const handleMarkAsResolved = async (ticketNumber) => {
    try {
      setResolvingTicket(ticketNumber);
      setResolveError(null);
      const response = await supportAPI.markTicketAsResolved(ticketNumber);
      if (response.success) {
        setTickets((prev) =>
          prev.map((t) =>
            t.ticketNumber === ticketNumber ? { ...t, status: "resolved" } : t,
          ),
        );
      } else {
        setResolveError(
          response.message || "Failed to mark ticket as resolved",
        );
      }
    } catch (err) {
      setResolveError(err.message || "Failed to mark ticket as resolved");
    } finally {
      setResolvingTicket(null);
    }
  };

  useEffect(() => {
    const fetchAllTickets = async () => {
      try {
        setLoading(true);
        const filters = {};
        if (statusFilter) filters.status = statusFilter;
        if (priorityFilter) filters.priority = priorityFilter;
        if (searchQuery) filters.search = searchQuery;
        const response = await supportAPI.getAllTickets(
          currentPage,
          limit,
          filters,
        );
        if (response.success) {
          setTickets(response.tickets);
          setTotalPages(response.pagination.totalPages);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllTickets();
  }, [currentPage, limit, statusFilter, priorityFilter, searchQuery]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            className="animate-spin"
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: `4px solid ${C.outlineVariant}`,
              borderTopColor: "transparent",
              borderLeftColor: "var(--brand-violet)",
              margin: "0 auto",
            }}
          />
          <p
            style={{
              marginTop: 16,
              fontSize: 13,
              color: C.onSurfaceVariant,
              ...BD,
            }}
          >
            Loading portal...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", flex: 1, padding: "32px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 28,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: C.onSurface,
                ...HL,
                margin: 0,
              }}
            >
              Support Tickets
            </h1>
            <p
              style={{
                fontSize: 14,
                color: C.onSurfaceVariant,
                ...BD,
                margin: "6px 0 0",
              }}
            >
              Manage and review all customer support tickets
            </p>
          </div>
          <OutlineBtn onClick={() => router.push("/portal")}>
            ← Back to Portal
          </OutlineBtn>
        </div>

        {/* Filters */}
        <TokenCard style={{ marginBottom: 20 }}>
          <p
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: C.onSurface,
              ...BD,
              margin: "0 0 14px",
            }}
          >
            Filters
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 12,
            }}
          >
            {/* Search */}
            <div style={{ position: "relative" }}>
              <Icon
                name="search"
                size={18}
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: C.onSurfaceVariant,
                  pointerEvents: "none",
                }}
              />
              <input
                placeholder="Search ticket number, email, name..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  width: "100%",
                  border: `1.5px solid ${C.outlineVariant}`,
                  borderRadius: 10,
                  padding: "10px 14px 10px 38px",
                  fontSize: 14,
                  color: C.onSurface,
                  backgroundColor: C.surfaceLowest,
                  outline: "none",
                  boxSizing: "border-box",
                  ...BD,
                }}
              />
            </div>
            <StyledSelect
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All Statuses</option>
              <option value="open">Open</option>
              <option value="resolved">Resolved</option>
            </StyledSelect>
            <StyledSelect
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </StyledSelect>
            <OutlineBtn
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("");
                setPriorityFilter("");
                setCurrentPage(1);
              }}
            >
              Clear Filters
            </OutlineBtn>
          </div>
        </TokenCard>

        {/* Tickets table */}
        <TokenCard>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <p
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: C.onSurface,
                ...HL,
                margin: 0,
              }}
            >
              All Tickets
            </p>
            <p
              style={{
                fontSize: 13,
                color: C.onSurfaceVariant,
                ...BD,
                margin: 0,
              }}
            >
              Total: {tickets.length}/{totalPages * limit} tickets
            </p>
          </div>

          {loading && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "48px 0",
              }}
            >
              <div
                className="animate-spin"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: `4px solid ${C.outlineVariant}`,
                  borderTopColor: "transparent",
                  borderLeftColor: "var(--brand-violet)",
                }}
              />
            </div>
          )}

          {error && (
            <div
              style={{
                backgroundColor: "#fee2e2",
                border: "1px solid #fca5a5",
                borderRadius: 10,
                padding: "12px 16px",
                marginBottom: 12,
              }}
            >
              <p style={{ fontSize: 13, color: "#dc2626", ...BD, margin: 0 }}>
                Failed to load tickets: {error}
              </p>
            </div>
          )}

          {resolveError && (
            <div
              style={{
                backgroundColor: "#fee2e2",
                border: "1px solid #fca5a5",
                borderRadius: 10,
                padding: "12px 16px",
                marginBottom: 12,
              }}
            >
              <p style={{ fontSize: 13, color: "#dc2626", ...BD, margin: 0 }}>
                {resolveError}
              </p>
              <button
                onClick={() => setResolveError(null)}
                style={{
                  fontSize: 12,
                  color: "#dc2626",
                  textDecoration: "underline",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px 0 0",
                  ...BD,
                }}
              >
                Dismiss
              </button>
            </div>
          )}

          {!loading && tickets.length === 0 && (
            <p
              style={{
                textAlign: "center",
                padding: "48px 0",
                fontSize: 14,
                color: C.onSurfaceVariant,
                ...BD,
              }}
            >
              No tickets found
            </p>
          )}

          {!loading && tickets.length > 0 && (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr
                    style={{ borderBottom: `1px solid ${C.outlineVariant}44` }}
                  >
                    {[
                      "Ticket #",
                      "Customer",
                      "Category",
                      "Status",
                      "Resolved By",
                      "Priority",
                      "Created",
                      "Action",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "10px 14px",
                          textAlign: "left",
                          fontSize: 12,
                          fontWeight: 700,
                          color: C.onSurfaceVariant,
                          ...BD,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr
                      key={ticket.ticketNumber}
                      onClick={() => handleOpenTicketDialog(ticket)}
                      style={{
                        borderBottom: `1px solid ${C.outlineVariant}22`,
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = C.surfaceLow)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <td style={{ padding: "12px 14px" }}>
                        <code
                          style={{
                            fontSize: 11,
                            backgroundColor: C.surfaceLow,
                            padding: "2px 8px",
                            borderRadius: 6,
                            color: C.onSurface,
                            fontFamily: "monospace",
                          }}
                        >
                          {ticket.ticketNumber}
                        </code>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: C.onSurface,
                            ...BD,
                            margin: 0,
                          }}
                        >
                          {ticket.userName}
                        </p>
                        <p
                          style={{
                            fontSize: 12,
                            color: C.onSurfaceVariant,
                            ...BD,
                            margin: "2px 0 0",
                          }}
                        >
                          {ticket.userEmail}
                        </p>
                        <p
                          style={{
                            fontSize: 12,
                            color: C.onSurfaceVariant,
                            ...BD,
                            margin: "1px 0 0",
                          }}
                        >
                          {ticket.userPhoneNumber || "N/A"}
                        </p>
                      </td>
                      <td
                        style={{
                          padding: "12px 14px",
                          fontSize: 13,
                          color: C.onSurface,
                          ...BD,
                        }}
                      >
                        {ticket.category}
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <Pill label={ticket.status} map={STATUS_PILL} />
                      </td>
                      <td
                        style={{
                          padding: "12px 14px",
                          fontSize: 13,
                          color: ticket.resolvedBy
                            ? C.onSurface
                            : C.onSurfaceVariant,
                          fontWeight: ticket.resolvedBy ? 600 : 400,
                          ...BD,
                        }}
                      >
                        {ticket.resolvedBy || "—"}
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <Pill label={ticket.priority} map={PRIORITY_PILL} />
                      </td>
                      <td
                        style={{
                          padding: "12px 14px",
                          fontSize: 13,
                          color: C.onSurface,
                          ...BD,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </td>
                      <td
                        style={{ padding: "12px 14px" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <PrimaryBtn
                          size="sm"
                          onClick={() =>
                            handleMarkAsResolved(ticket.ticketNumber)
                          }
                          disabled={
                            ticket.status === "resolved" ||
                            resolvingTicket === ticket.ticketNumber
                          }
                        >
                          {resolvingTicket === ticket.ticketNumber
                            ? "Resolving…"
                            : "Mark Resolved"}
                        </PrimaryBtn>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 24,
              }}
            >
              <p style={{ fontSize: 13, color: C.onSurfaceVariant, ...BD }}>
                Page {currentPage} of {totalPages}
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <OutlineBtn
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <Icon name="chevron_left" size={16} /> Previous
                </OutlineBtn>
                <OutlineBtn
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next <Icon name="chevron_right" size={16} />
                </OutlineBtn>
              </div>
            </div>
          )}
        </TokenCard>
      </div>

      {/* Ticket Details Modal */}
      {dialogOpen && selectedTicket && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(17,28,45,0.5)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
          onClick={() => setDialogOpen(false)}
        >
          <div
            style={{
              backgroundColor: C.surfaceLowest,
              borderRadius: 20,
              width: "100%",
              maxWidth: 640,
              maxHeight: "84vh",
              overflowY: "auto",
              ...SHADOW,
              padding: "28px 28px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: C.onSurface,
                    ...HL,
                    margin: 0,
                  }}
                >
                  Ticket #{selectedTicket.ticketNumber}
                </h2>
                <p
                  style={{
                    fontSize: 13,
                    color: C.onSurfaceVariant,
                    ...BD,
                    margin: "4px 0 0",
                  }}
                >
                  <span style={{ fontWeight: 600, color: C.onSurface }}>
                    {selectedTicket.category}
                  </span>{" "}
                  • {selectedTicket.userName}
                </p>
              </div>
              <button
                onClick={() => setDialogOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: C.onSurfaceVariant,
                  padding: 4,
                }}
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            {/* Info grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                marginBottom: 20,
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: C.onSurfaceVariant,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    ...BD,
                    margin: "0 0 4px",
                  }}
                >
                  Status
                </p>
                <Pill label={selectedTicket.status} map={STATUS_PILL} />
              </div>
              <div>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: C.onSurfaceVariant,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    ...BD,
                    margin: "0 0 4px",
                  }}
                >
                  Priority
                </p>
                <Pill label={selectedTicket.priority} map={PRIORITY_PILL} />
              </div>
              <div>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: C.onSurfaceVariant,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    ...BD,
                    margin: "0 0 4px",
                  }}
                >
                  Created
                </p>
                <p
                  style={{ fontSize: 12, color: C.onSurface, ...BD, margin: 0 }}
                >
                  {new Date(selectedTicket.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: C.onSurfaceVariant,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    ...BD,
                    margin: "0 0 4px",
                  }}
                >
                  Last Updated
                </p>
                <p
                  style={{ fontSize: 12, color: C.onSurface, ...BD, margin: 0 }}
                >
                  {new Date(selectedTicket.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Conversation */}
            <div
              style={{
                backgroundColor: C.surfaceLow,
                borderRadius: 12,
                padding: "16px",
                maxHeight: 320,
                overflowY: "auto",
                marginBottom: 20,
              }}
            >
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.onSurface,
                  ...BD,
                  margin: "0 0 12px",
                }}
              >
                Conversation
              </p>
              {selectedTicket.conversationHistory &&
              selectedTicket.conversationHistory.length > 0 ? (
                selectedTicket.conversationHistory.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent:
                        msg.role === "user" ? "flex-end" : "flex-start",
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "70%",
                        padding: "8px 12px",
                        borderRadius: 10,
                        backgroundColor:
                          msg.role === "user"
                            ? C.primaryContainer
                            : C.surfaceLowest,
                        color: msg.role === "user" ? "#ffffff" : C.onSurface,
                        borderBottomRightRadius: msg.role === "user" ? 2 : 10,
                        borderBottomLeftRadius: msg.role === "user" ? 10 : 2,
                      }}
                    >
                      <p
                        style={{
                          fontSize: 13,
                          margin: 0,
                          ...BD,
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-words",
                        }}
                      >
                        {msg.content}
                      </p>
                      <p
                        style={{
                          fontSize: 11,
                          margin: "4px 0 0",
                          color:
                            msg.role === "user"
                              ? "#ffffff99"
                              : C.onSurfaceVariant,
                          ...BD,
                        }}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p
                  style={{
                    fontSize: 13,
                    color: C.onSurfaceVariant,
                    fontStyle: "italic",
                    ...BD,
                  }}
                >
                  No conversation history
                </p>
              )}
            </div>

            {/* Resolve action */}
            {selectedTicket.status !== "resolved" && (
              <PrimaryBtn
                onClick={() => {
                  handleMarkAsResolved(selectedTicket.ticketNumber);
                  setDialogOpen(false);
                }}
              >
                Mark as Resolved
              </PrimaryBtn>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
