"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useRoleAuth } from "@/hooks/useRoleAuth";
import { partnersAPI } from "@/lib/api";
import { C, HL, BD, SHADOW } from "@/components/landing/tokens";
import Icon from "@/components/landing/Icon";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value || 0));
}

export default function PartnersPage() {
  const router = useRouter();
  const { isLoading, user, hasAccess } = useRoleAuth({
    allowedRoles: ["admin"],
    redirectTo: "/portal",
  });
  const [partners, setPartners] = useState([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [pendingStatements, setPendingStatements] = useState([]);
  const [summary, setSummary] = useState({
    totalPartners: 0,
    totalCurrentBalance: 0,
    totalWithdrawn: 0,
    pendingWithdrawals: 0,
  });
  const [loading, setLoading] = useState(true);
  const [markingWithdrawalId, setMarkingWithdrawalId] = useState("");
  const [markingStatementId, setMarkingStatementId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [balanceInput, setBalanceInput] = useState("");
  const [balanceSaving, setBalanceSaving] = useState(false);
  const limit = 20;

  async function loadData({ keepLoadingState = true } = {}) {
    try {
      if (keepLoadingState) {
        setLoading(true);
      }

      const [partnersResponse, withdrawalsResponse, statementsResponse] =
        await Promise.all([
          partnersAPI.getAdminPartners(currentPage, limit, searchQuery),
          partnersAPI.getAdminWithdrawals("pending", 25),
          partnersAPI.getAdminStatements("pending", 25),
        ]);

      setPartners(partnersResponse.partners || []);
      setSummary(
        partnersResponse.summary || {
          totalPartners: 0,
          totalCurrentBalance: 0,
          totalWithdrawn: 0,
          pendingWithdrawals: 0,
        },
      );
      setPendingWithdrawals(withdrawalsResponse.withdrawals || []);
      setPendingStatements(statementsResponse.statementRequests || []);
      setTotalPages(partnersResponse.pagination?.totalPages || 1);
      setTotalCount(partnersResponse.pagination?.totalCount || 0);
    } catch (error) {
      toast.error(error.message || "Failed to load partners");
    } finally {
      if (keepLoadingState) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentPage(1);
      setSearchQuery(searchInput.trim());
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      return;
    }

    let isMounted = true;

    async function triggerLoadData() {
      await Promise.resolve();

      if (!isMounted) {
        return;
      }

      await loadData({ keepLoadingState: true });
    }

    triggerLoadData();

    return () => {
      isMounted = false;
    };
  }, [user, currentPage, searchQuery]);

  const showingFrom = useMemo(() => {
    if (!totalCount) return 0;
    return (currentPage - 1) * limit + 1;
  }, [currentPage, totalCount]);

  const showingTo = useMemo(() => {
    if (!totalCount) return 0;
    return Math.min(currentPage * limit, totalCount);
  }, [currentPage, totalCount]);

  const handleMarkPaid = async (withdrawalId) => {
    try {
      setMarkingWithdrawalId(withdrawalId);
      const response = await partnersAPI.markWithdrawalPaid(withdrawalId);
      if (response.success) {
        toast.success("Withdrawal marked as paid");
        await loadData({ keepLoadingState: false });
      }
    } catch (error) {
      toast.error(error.message || "Failed to update withdrawal");
    } finally {
      setMarkingWithdrawalId("");
    }
  };

  const handleMarkStatementDelivered = async (statementId) => {
    try {
      setMarkingStatementId(statementId);
      const response = await partnersAPI.markStatementDelivered(statementId);
      if (response.success) {
        toast.success("Statement marked as delivered");
        await loadData({ keepLoadingState: false });
      }
    } catch (error) {
      toast.error(error.message || "Failed to update statement request");
    } finally {
      setMarkingStatementId("");
    }
  };

  const handleViewPartner = (partnerId) => {
    router.push(`/portal/partners/${partnerId}`);
  };

  const handleOpenEditPartner = (partner) => {
    setSelectedPartner(partner);
    setBalanceInput(String(partner.currentBalance ?? 0));
    setEditDialogOpen(true);
  };

  const handleSaveBalance = async () => {
    if (!selectedPartner) {
      return;
    }

    try {
      setBalanceSaving(true);
      const response = await partnersAPI.updatePartnerBalance(
        selectedPartner._id,
        Number(balanceInput),
      );

      if (response.success) {
        toast.success("Partner balance updated");
        setEditDialogOpen(false);
        setSelectedPartner(null);
        await loadData({ keepLoadingState: false });
      }
    } catch (error) {
      toast.error(error.message || "Failed to update partner balance");
    } finally {
      setBalanceSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "64px 0",
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
            Loading partners...
          </p>
        </div>
      </div>
    );
  }

  if (!hasAccess || !user) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 0",
        }}
      >
        <p style={{ fontSize: 14, color: C.onSurfaceVariant, ...BD }}>
          Redirecting...
        </p>
      </div>
    );
  }

  const cardStyle = {
    backgroundColor: C.surfaceLowest,
    borderRadius: 16,
    border: `1px solid ${C.outlineVariant}44`,
    padding: "24px",
    ...SHADOW,
    marginBottom: 20,
  };

  function StatMini({ iconName, label, value, accentColor }) {
    return (
      <div
        style={{
          backgroundColor: C.surfaceLowest,
          borderRadius: 14,
          border: `1px solid ${C.outlineVariant}44`,
          borderLeft: `4px solid ${accentColor}`,
          padding: "16px 20px",
          ...SHADOW,
        }}
      >
        <p
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: C.onSurfaceVariant,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            ...BD,
            margin: 0,
          }}
        >
          {label}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 6,
          }}
        >
          <Icon name={iconName} size={18} style={{ color: accentColor }} />
          <p
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: C.onSurface,
              ...HL,
              margin: 0,
            }}
          >
            {value}
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
            flexWrap: "wrap",
            alignItems: "flex-start",
            justifyContent: "space-between",
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
              Partners
            </h1>
            <p
              style={{
                fontSize: 14,
                color: C.onSurfaceVariant,
                ...BD,
                margin: "6px 0 0",
              }}
            >
              Manage partner profiles, balances, and withdrawal payouts.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => router.push("/portal")}
              style={{
                backgroundColor: "transparent",
                color: C.primaryContainer,
                border: `1.5px solid ${C.outlineVariant}`,
                borderRadius: 10,
                padding: "10px 20px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                ...BD,
              }}
            >
              Back to Portal
            </button>
            <button
              onClick={() => router.push("/portal/partners/new")}
              style={{
                backgroundColor: C.primaryContainer,
                color: "#ffffff",
                border: "none",
                borderRadius: 10,
                padding: "10px 20px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                ...BD,
              }}
            >
              Create Partner
            </button>
          </div>
        </div>

        {/* Summary stat cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
            gap: 14,
            marginBottom: 24,
          }}
        >
          <StatMini
            iconName="group"
            label="Total Partners"
            accentColor="#3b82f6"
            value={summary.totalPartners}
          />
          <StatMini
            iconName="account_balance_wallet"
            label="Current Balance"
            accentColor="#22c55e"
            value={formatCurrency(summary.totalCurrentBalance)}
          />
          <StatMini
            iconName="payments"
            label="Total Withdrawn"
            accentColor="var(--brand-violet)"
            value={formatCurrency(summary.totalWithdrawn)}
          />
          <StatMini
            iconName="handshake"
            label="Pending Withdrawals"
            accentColor="#f59e0b"
            value={summary.pendingWithdrawals}
          />
          <StatMini
            iconName="description"
            label="Pending Statements"
            accentColor="#0ea5e9"
            value={pendingStatements.length}
          />
        </div>

        {/* Search */}
        <div style={cardStyle}>
          <p
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: C.onSurface,
              ...BD,
              margin: "0 0 12px",
            }}
          >
            Search Partners
          </p>
          <div style={{ position: "relative", maxWidth: 520 }}>
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
              placeholder="Search by name, TFN, email, or phone..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
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
        </div>

        {/* Partner directory table */}
        <div style={cardStyle}>
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
              Partner Directory
            </p>
            <p
              style={{
                fontSize: 13,
                color: C.onSurfaceVariant,
                ...BD,
                margin: 0,
              }}
            >
              Showing {showingFrom}-{showingTo} of {totalCount} partners
            </p>
          </div>

          {loading ? (
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
          ) : partners.length === 0 ? (
            <p
              style={{
                textAlign: "center",
                padding: "48px 0",
                fontSize: 14,
                color: C.onSurfaceVariant,
                ...BD,
              }}
            >
              No partners found.
            </p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr
                    style={{ borderBottom: `1px solid ${C.outlineVariant}44` }}
                  >
                    {[
                      "Partner",
                      "TFN",
                      "Current Balance",
                      "Total Withdrawn",
                      "Payment Method",
                      "Status",
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
                  {partners.map((partner) => (
                    <tr
                      key={partner._id}
                      onClick={() => handleViewPartner(partner._id)}
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
                      <td
                        style={{ padding: "12px 14px", verticalAlign: "top" }}
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewPartner(partner._id);
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            padding: 0,
                            cursor: "pointer",
                            textAlign: "left",
                          }}
                        >
                          <p
                            style={{
                              fontSize: 14,
                              fontWeight: 600,
                              color: C.onSurface,
                              ...BD,
                              margin: 0,
                            }}
                          >
                            {partner.partnerName}
                          </p>
                        </button>
                        <p
                          style={{
                            fontSize: 12,
                            color: C.onSurfaceVariant,
                            ...BD,
                            margin: "2px 0 0",
                          }}
                        >
                          {partner.user?.email || "No email"}
                        </p>
                        <p
                          style={{
                            fontSize: 12,
                            color: C.onSurfaceVariant,
                            ...BD,
                            margin: "1px 0 0",
                          }}
                        >
                          {partner.user?.phoneNumber || "No phone"}
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
                        {partner.partnerTFN}
                      </td>
                      <td
                        style={{
                          padding: "12px 14px",
                          fontSize: 13,
                          fontWeight: 600,
                          color: C.onSurface,
                          ...BD,
                        }}
                      >
                        {formatCurrency(partner.currentBalance)}
                      </td>
                      <td
                        style={{
                          padding: "12px 14px",
                          fontSize: 13,
                          color: C.onSurface,
                          ...BD,
                        }}
                      >
                        {formatCurrency(partner.totalWithdrawn)}
                      </td>
                      <td
                        style={{ padding: "12px 14px", verticalAlign: "top" }}
                      >
                        <p
                          style={{
                            fontSize: 13,
                            color: C.onSurface,
                            ...BD,
                            margin: 0,
                          }}
                        >
                          {partner.paymentMethodSummary}
                        </p>
                        {!partner.hasSavedPaymentMethod && (
                          <p
                            style={{
                              fontSize: 12,
                              color: "#92400e",
                              ...BD,
                              margin: "2px 0 0",
                            }}
                          >
                            Payment details missing
                          </p>
                        )}
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            backgroundColor: partner.user?.isActive
                              ? "#dcfce7"
                              : C.surfaceHigh,
                            color: partner.user?.isActive
                              ? "#15803d"
                              : C.onSurfaceVariant,
                            borderRadius: 6,
                            padding: "2px 10px",
                            fontSize: 12,
                            fontWeight: 600,
                            ...BD,
                          }}
                        >
                          {partner.user?.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td
                        style={{ padding: "12px 14px" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => handleOpenEditPartner(partner)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            backgroundColor: "transparent",
                            color: C.primaryContainer,
                            border: `1.5px solid ${C.outlineVariant}`,
                            borderRadius: 9,
                            padding: "7px 13px",
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: "pointer",
                            ...BD,
                          }}
                        >
                          <Icon name="edit" size={15} /> Edit Balance
                        </button>
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
                <button
                  onClick={() => setCurrentPage((v) => Math.max(v - 1, 1))}
                  disabled={currentPage === 1}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    backgroundColor: "transparent",
                    color: C.primaryContainer,
                    border: `1.5px solid ${C.outlineVariant}`,
                    borderRadius: 9,
                    padding: "7px 13px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    ...BD,
                  }}
                >
                  <Icon name="chevron_left" size={16} /> Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((v) => Math.min(v + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    backgroundColor: "transparent",
                    color: C.primaryContainer,
                    border: `1.5px solid ${C.outlineVariant}`,
                    borderRadius: 9,
                    padding: "7px 13px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor:
                      currentPage === totalPages ? "not-allowed" : "pointer",
                    ...BD,
                  }}
                >
                  Next <Icon name="chevron_right" size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Pending withdrawal requests */}
        <div style={cardStyle}>
          <p
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: C.onSurface,
              ...HL,
              margin: "0 0 4px",
            }}
          >
            Pending Withdrawal Requests
          </p>
          <p
            style={{
              fontSize: 13,
              color: C.onSurfaceVariant,
              ...BD,
              margin: "0 0 20px",
            }}
          >
            Manually pay partners, then mark the request as paid.
          </p>
          {pendingWithdrawals.length === 0 ? (
            <div
              style={{
                border: `1.5px dashed ${C.outlineVariant}`,
                borderRadius: 12,
                padding: "24px",
                fontSize: 13,
                color: C.onSurfaceVariant,
                textAlign: "center",
                ...BD,
              }}
            >
              No pending withdrawal requests right now.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {pendingWithdrawals.map((w) => (
                <div
                  key={w._id}
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    backgroundColor: C.surfaceLow,
                    borderRadius: 14,
                    padding: "16px 20px",
                    border: `1px solid ${C.outlineVariant}33`,
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 4,
                      }}
                    >
                      <p
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: C.onSurface,
                          ...BD,
                          margin: 0,
                        }}
                      >
                        {w.partnerName}
                      </p>
                      <span
                        style={{
                          backgroundColor: "#fef3c7",
                          color: "#92400e",
                          borderRadius: 6,
                          padding: "2px 8px",
                          fontSize: 12,
                          fontWeight: 600,
                          ...BD,
                        }}
                      >
                        Pending
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: 12,
                        color: C.onSurfaceVariant,
                        ...BD,
                        margin: "2px 0",
                      }}
                    >
                      TFN: {w.partnerTFN}
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        color: C.onSurfaceVariant,
                        ...BD,
                        margin: "2px 0",
                      }}
                    >
                      Requested {new Date(w.requestedAt).toLocaleString()}
                    </p>
                    <p
                      style={{
                        fontSize: 13,
                        color: C.onSurface,
                        ...BD,
                        margin: "4px 0 0",
                      }}
                    >
                      Payment Method: {w.paymentMethodSummary}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: C.onSurface,
                        ...HL,
                        margin: 0,
                      }}
                    >
                      {formatCurrency(w.amount)}
                    </p>
                    <button
                      onClick={() => handleMarkPaid(w._id)}
                      disabled={markingWithdrawalId === w._id}
                      style={{
                        backgroundColor:
                          markingWithdrawalId === w._id
                            ? C.surfaceHigh
                            : C.primaryContainer,
                        color:
                          markingWithdrawalId === w._id
                            ? C.onSurfaceVariant
                            : "#ffffff",
                        border: "none",
                        borderRadius: 10,
                        padding: "10px 20px",
                        fontSize: 14,
                        fontWeight: 600,
                        cursor:
                          markingWithdrawalId === w._id
                            ? "not-allowed"
                            : "pointer",
                        ...BD,
                      }}
                    >
                      {markingWithdrawalId === w._id
                        ? "Saving..."
                        : "Mark as Paid"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending TFN statement requests */}
        <div style={cardStyle}>
          <p
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: C.onSurface,
              ...HL,
              margin: "0 0 4px",
            }}
          >
            Pending TFN Statement Requests
          </p>
          <p
            style={{
              fontSize: 13,
              color: C.onSurfaceVariant,
              ...BD,
              margin: "0 0 20px",
            }}
          >
            Email the statement manually, then mark the request as delivered.
          </p>
          {pendingStatements.length === 0 ? (
            <div
              style={{
                border: `1.5px dashed ${C.outlineVariant}`,
                borderRadius: 12,
                padding: "24px",
                fontSize: 13,
                color: C.onSurfaceVariant,
                textAlign: "center",
                ...BD,
              }}
            >
              No pending TFN statement requests right now.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {pendingStatements.map((s) => (
                <div
                  key={s._id}
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    backgroundColor: C.surfaceLow,
                    borderRadius: 14,
                    padding: "16px 20px",
                    border: `1px solid ${C.outlineVariant}33`,
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 4,
                      }}
                    >
                      <p
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: C.onSurface,
                          ...BD,
                          margin: 0,
                        }}
                      >
                        {s.partnerName}
                      </p>
                      <span
                        style={{
                          backgroundColor: "#fef3c7",
                          color: "#92400e",
                          borderRadius: 6,
                          padding: "2px 8px",
                          fontSize: 12,
                          fontWeight: 600,
                          ...BD,
                        }}
                      >
                        Pending
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: 12,
                        color: C.onSurfaceVariant,
                        ...BD,
                        margin: "2px 0",
                      }}
                    >
                      TFN: {s.partnerTFN}
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        color: C.onSurfaceVariant,
                        ...BD,
                        margin: "2px 0",
                      }}
                    >
                      Requested {new Date(s.requestedAt).toLocaleString()}
                    </p>
                    {s.user?.email && (
                      <p
                        style={{
                          fontSize: 12,
                          color: C.onSurfaceVariant,
                          ...BD,
                          margin: "2px 0 0",
                        }}
                      >
                        Email: {s.user.email}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleMarkStatementDelivered(s._id)}
                    disabled={markingStatementId === s._id}
                    style={{
                      backgroundColor:
                        markingStatementId === s._id
                          ? C.surfaceHigh
                          : C.primaryContainer,
                      color:
                        markingStatementId === s._id
                          ? C.onSurfaceVariant
                          : "#ffffff",
                      border: "none",
                      borderRadius: 10,
                      padding: "10px 20px",
                      fontSize: 14,
                      fontWeight: 600,
                      cursor:
                        markingStatementId === s._id
                          ? "not-allowed"
                          : "pointer",
                      ...BD,
                    }}
                  >
                    {markingStatementId === s._id
                      ? "Saving..."
                      : "Mark as Delivered"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit balance modal */}
      {editDialogOpen && selectedPartner && (
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
          onClick={() => setEditDialogOpen(false)}
        >
          <div
            style={{
              backgroundColor: C.surfaceLowest,
              borderRadius: 20,
              width: "100%",
              maxWidth: 440,
              ...SHADOW,
              padding: "28px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
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
                    fontSize: 18,
                    fontWeight: 700,
                    color: C.onSurface,
                    ...HL,
                    margin: 0,
                  }}
                >
                  Edit Partner Balance
                </h2>
                <p
                  style={{
                    fontSize: 13,
                    color: C.onSurfaceVariant,
                    ...BD,
                    margin: "4px 0 0",
                  }}
                >
                  Update the current balance for the selected partner.
                </p>
              </div>
              <button
                onClick={() => setEditDialogOpen(false)}
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

            <div style={{ marginBottom: 20 }}>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: C.onSurface,
                  ...BD,
                  margin: 0,
                }}
              >
                {selectedPartner.partnerName}
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: C.onSurfaceVariant,
                  ...BD,
                  margin: "3px 0 0",
                }}
              >
                TFN: {selectedPartner.partnerTFN}
              </p>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: C.onSurface,
                  ...BD,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Current Balance
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={balanceInput}
                onChange={(e) => setBalanceInput(e.target.value)}
                style={{
                  width: "100%",
                  border: `1.5px solid ${C.outlineVariant}`,
                  borderRadius: 10,
                  padding: "10px 14px",
                  fontSize: 14,
                  color: C.onSurface,
                  backgroundColor: C.surfaceLowest,
                  outline: "none",
                  boxSizing: "border-box",
                  ...BD,
                }}
              />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={handleSaveBalance}
                disabled={balanceSaving}
                style={{
                  flex: 1,
                  backgroundColor: balanceSaving
                    ? C.surfaceHigh
                    : C.primaryContainer,
                  color: balanceSaving ? C.onSurfaceVariant : "#ffffff",
                  border: "none",
                  borderRadius: 10,
                  padding: "11px",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: balanceSaving ? "not-allowed" : "pointer",
                  ...BD,
                }}
              >
                {balanceSaving ? "Saving..." : "Save Balance"}
              </button>
              <button
                onClick={() => setEditDialogOpen(false)}
                disabled={balanceSaving}
                style={{
                  flex: 1,
                  backgroundColor: "transparent",
                  color: C.primaryContainer,
                  border: `1.5px solid ${C.outlineVariant}`,
                  borderRadius: 10,
                  padding: "10px",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: balanceSaving ? "not-allowed" : "pointer",
                  ...BD,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
