"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import useAuthStore from "@/stores/authStore";
import { partnersAPI } from "@/lib/api";
import { MIN_PARTNER_WITHDRAWAL_BALANCE } from "@/lib/partner-utils";
import { C, HL, BD, SHADOW } from "@/components/landing/tokens";
import Icon from "@/components/landing/Icon";

const roleDescriptions = {
  admin: "Full access to all system settings and user management",
  operator: "Manage support tickets and customer interactions",
  partner: "Partner access to specific business functions",
};

const adminDashboardData = {
  totalSupportTickets: 589,
  resolvedTickets: 531,
  bestOperator: { name: "Sarah Johnson", resolvedTickets: 142 },
};

const PILL = {
  pending: { bg: "#fef3c7", color: "#92400e" },
  paid: { bg: "#dcfce7", color: "#15803d" },
  delivered: { bg: "#dcfce7", color: "#15803d" },
};

function StatCard({
  iconName,
  label,
  value,
  trend,
  accentColor = "var(--brand-violet)",
}) {
  return (
    <div
      style={{
        backgroundColor: C.surfaceLowest,
        borderRadius: 16,
        border: `1px solid ${C.outlineVariant}44`,
        borderLeft: `4px solid ${accentColor}`,
        padding: "20px 24px",
        ...SHADOW,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div style={{ flex: 1 }}>
          <p
            style={{
              fontSize: 13,
              color: C.onSurfaceVariant,
              ...BD,
              margin: 0,
            }}
          >
            {label}
          </p>
          <p
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: C.onSurface,
              ...HL,
              margin: "6px 0 0",
            }}
          >
            {value}
          </p>
          {trend && (
            <p
              style={{
                fontSize: 12,
                color: "#16a34a",
                fontWeight: 600,
                margin: "4px 0 0",
                ...BD,
              }}
            >
              {trend}
            </p>
          )}
        </div>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: `${accentColor}18`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            marginLeft: 12,
          }}
        >
          <Icon name={iconName} size={22} style={{ color: accentColor }} />
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p
      style={{
        fontSize: 13,
        fontWeight: 700,
        color: C.onSurfaceVariant,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        ...BD,
        margin: "0 0 12px",
      }}
    >
      {children}
    </p>
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

function PrimaryBtn({ children, onClick, disabled, style = {} }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: disabled ? C.surfaceHigh : C.primaryContainer,
        color: disabled ? C.onSurfaceVariant : "#ffffff",
        border: "none",
        borderRadius: 10,
        padding: "11px 20px",
        fontSize: 14,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        width: "100%",
        ...BD,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function OutlineBtn({ children, onClick, disabled, style = {} }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: "transparent",
        color: disabled ? C.onSurfaceVariant : C.primaryContainer,
        border: `1.5px solid ${C.outlineVariant}`,
        borderRadius: 10,
        padding: "10px 20px",
        fontSize: 14,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        width: "100%",
        ...BD,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function TokenInput({
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  min,
  max,
  step,
  disabled,
  inputMode,
}) {
  return (
    <input
      id={id}
      type={type}
      inputMode={inputMode}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      style={{
        width: "100%",
        border: `1.5px solid ${C.outlineVariant}`,
        borderRadius: 10,
        padding: "10px 14px",
        fontSize: 14,
        color: C.onSurface,
        backgroundColor: disabled ? C.surfaceLow : C.surfaceLowest,
        outline: "none",
        boxSizing: "border-box",
        ...BD,
      }}
    />
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <p
        style={{
          fontSize: 11,
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
      <p
        style={{
          fontSize: 14,
          fontWeight: 500,
          color: C.onSurface,
          ...BD,
          margin: "4px 0 0",
        }}
      >
        {value}
      </p>
    </div>
  );
}

function StatusPill({ status }) {
  const pill = PILL[status] || { bg: C.surfaceHigh, color: C.onSurfaceVariant };
  return (
    <span
      style={{
        display: "inline-block",
        backgroundColor: pill.bg,
        color: pill.color,
        borderRadius: 6,
        padding: "2px 10px",
        fontSize: 12,
        fontWeight: 600,
        textTransform: "capitalize",
        ...BD,
      }}
    >
      {status}
    </span>
  );
}

export default function PortalPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [revenue, setRevenue] = useState({
    totalRevenue: null,
    thisMonthRevenue: null,
    loading: true,
    error: false,
  });
  const [userStats, setUserStats] = useState({
    totalUsers: null,
    totalSubscribedUsers: null,
    totalMonthlyPlanUsers: null,
    totalYearlyPlanUsers: null,
    totalLifetimePlanUsers: null,
    loading: true,
    error: false,
  });
  const [partnerProfile, setPartnerProfile] = useState(null);
  const [partnerWithdrawals, setPartnerWithdrawals] = useState([]);
  const [partnerStatements, setPartnerStatements] = useState([]);
  const [partnerLoading, setPartnerLoading] = useState(false);
  const [requestingWithdrawal, setRequestingWithdrawal] = useState(false);
  const [requestingStatement, setRequestingStatement] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState("");

  useEffect(() => {
    if (user?.role !== "admin") return;
    const fetchRevenue = async () => {
      try {
        const res = await fetch("/api/admin/revenue");
        const data = await res.json();
        if (data.success)
          setRevenue({
            totalRevenue: data.totalRevenue,
            thisMonthRevenue: data.thisMonthRevenue,
            loading: false,
            error: false,
          });
        else setRevenue((prev) => ({ ...prev, loading: false, error: true }));
      } catch {
        setRevenue((prev) => ({ ...prev, loading: false, error: true }));
      }
    };
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        if (data.success)
          setUserStats({
            totalUsers: data.totalUsers,
            totalSubscribedUsers: data.totalSubscribedUsers,
            totalMonthlyPlanUsers: data.totalMonthlyPlanUsers,
            totalYearlyPlanUsers: data.totalYearlyPlanUsers,
            totalLifetimePlanUsers: data.totalLifetimePlanUsers,
            loading: false,
            error: false,
          });
        else setUserStats((prev) => ({ ...prev, loading: false, error: true }));
      } catch {
        setUserStats((prev) => ({ ...prev, loading: false, error: true }));
      }
    };
    fetchRevenue();
    fetchStats();
  }, [user?.role]);

  useEffect(() => {
    if (user?.role !== "partner") return;
    let isMounted = true;
    async function loadPartnerProfile() {
      try {
        setPartnerLoading(true);
        const response = await partnersAPI.getPartnerProfile();
        if (!isMounted) return;
        const nextProfile = response.partner || null;
        setPartnerProfile(nextProfile);
        setPartnerWithdrawals(response.withdrawals || []);
        setPartnerStatements(response.statementRequests || []);
        setWithdrawalAmount(
          Number(nextProfile?.currentBalance || 0) > 0
            ? String(Number(nextProfile.currentBalance))
            : "",
        );
      } catch (error) {
        if (isMounted)
          toast.error(error.message || "Failed to load partner data");
      } finally {
        if (isMounted) setPartnerLoading(false);
      }
    }
    loadPartnerProfile();
    return () => {
      isMounted = false;
    };
  }, [user?.role]);

  const handleRequestWithdrawal = async () => {
    if (!partnerProfile) return;
    if (!partnerProfile.hasSavedPaymentMethod) {
      router.push("/portal/partner-settings");
      return;
    }
    const amount = Number(withdrawalAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error("Enter a valid withdrawal amount");
      return;
    }
    if (amount > Number(partnerProfile.currentBalance || 0)) {
      toast.error("Withdrawal amount cannot exceed your available balance");
      return;
    }
    try {
      setRequestingWithdrawal(true);
      const response = await partnersAPI.requestWithdrawal({ amount });
      if (response.success) {
        toast.success("Withdrawal request submitted");
        const refreshedProfile = await partnersAPI.getPartnerProfile();
        const refreshedPartner = refreshedProfile.partner || null;
        setPartnerProfile(refreshedPartner);
        setPartnerWithdrawals(refreshedProfile.withdrawals || []);
        setPartnerStatements(refreshedProfile.statementRequests || []);
        setWithdrawalAmount(
          Number(refreshedPartner?.currentBalance || 0) > 0
            ? String(Number(refreshedPartner.currentBalance))
            : "",
        );
      }
    } catch (error) {
      if (error.data?.requiresPaymentMethod) {
        router.push("/portal/partner-settings");
        return;
      }
      toast.error(error.message || "Failed to request withdrawal");
    } finally {
      setRequestingWithdrawal(false);
    }
  };

  const handleRequestStatement = async () => {
    if (!partnerProfile) return;
    try {
      setRequestingStatement(true);
      const response = await partnersAPI.requestStatement();
      if (response.success) {
        toast.success("TFN statement request submitted");
        const refreshedProfile = await partnersAPI.getPartnerProfile();
        setPartnerProfile(refreshedProfile.partner || null);
        setPartnerWithdrawals(refreshedProfile.withdrawals || []);
        setPartnerStatements(refreshedProfile.statementRequests || []);
      }
    } catch (error) {
      toast.error(error.message || "Failed to request TFN statement");
    } finally {
      setRequestingStatement(false);
    }
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(value || 0));

  const availableWithdrawalBalance = Number(
    partnerProfile?.currentBalance || 0,
  );
  const requestedWithdrawalAmount = Number(withdrawalAmount);
  const hasValidWithdrawalAmount =
    withdrawalAmount !== "" &&
    Number.isFinite(requestedWithdrawalAmount) &&
    requestedWithdrawalAmount > 0 &&
    requestedWithdrawalAmount <= availableWithdrawalBalance;
  const hasPendingStatementRequest = partnerStatements.some(
    (s) => s.status === "pending",
  );

  if (!user) {
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
          Loading portal...
        </p>
      </div>
    );
  }

  // ─── Admin Branch ───────────────────────────────────────────────
  if (user.role === "admin") {
    return (
      <div style={{ width: "100%", flex: 1, padding: "32px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* Hero header */}
          <div
            style={{
              backgroundColor: C.primaryContainer,
              borderRadius: 20,
              padding: "32px 40px",
              marginBottom: 32,
            }}
          >
            <h1
              style={{
                color: "#ffffff",
                ...HL,
                fontSize: 30,
                fontWeight: 700,
                margin: 0,
              }}
            >
              Admin Dashboard
            </h1>
            <p
              style={{
                color: "#ffffff99",
                ...BD,
                fontSize: 15,
                margin: "6px 0 0",
              }}
            >
              System overview and key business metrics
            </p>
          </div>

          {/* Revenue */}
          <div style={{ marginBottom: 32 }}>
            <SectionLabel>Revenue Overview</SectionLabel>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: 16,
              }}
            >
              <StatCard
                iconName="payments"
                label="Total Revenue"
                accentColor="#22c55e"
                value={
                  revenue.loading
                    ? "Loading…"
                    : revenue.error
                      ? "Unavailable"
                      : revenue.totalRevenue
                }
              />
              <StatCard
                iconName="trending_up"
                label="This Month Revenue"
                accentColor="var(--brand-violet)"
                value={
                  revenue.loading
                    ? "Loading…"
                    : revenue.error
                      ? "Unavailable"
                      : revenue.thisMonthRevenue
                }
              />
            </div>
          </div>

          {/* User analytics */}
          <div style={{ marginBottom: 32 }}>
            <SectionLabel>User Analytics</SectionLabel>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 16,
              }}
            >
              <StatCard
                iconName="group"
                label="Total Users"
                accentColor="#ef4444"
                value={
                  userStats.loading
                    ? "Loading…"
                    : userStats.error
                      ? "Unavailable"
                      : userStats.totalUsers?.toLocaleString()
                }
              />
              <StatCard
                iconName="verified_user"
                label="Subscribed Users"
                accentColor="#22c55e"
                value={
                  userStats.loading
                    ? "Loading…"
                    : userStats.error
                      ? "Unavailable"
                      : userStats.totalSubscribedUsers?.toLocaleString()
                }
              />
              <StatCard
                iconName="event_repeat"
                label="Monthly Plan"
                accentColor="#3b82f6"
                value={
                  userStats.loading
                    ? "Loading…"
                    : userStats.error
                      ? "Unavailable"
                      : userStats.totalMonthlyPlanUsers?.toLocaleString()
                }
              />
              <StatCard
                iconName="calendar_month"
                label="Yearly Plan"
                accentColor="#14b8a6"
                value={
                  userStats.loading
                    ? "Loading…"
                    : userStats.error
                      ? "Unavailable"
                      : userStats.totalYearlyPlanUsers?.toLocaleString()
                }
              />
              <StatCard
                iconName="all_inclusive"
                label="Lifetime Plan"
                accentColor="var(--brand-violet)"
                value={
                  userStats.loading
                    ? "Loading…"
                    : userStats.error
                      ? "Unavailable"
                      : userStats.totalLifetimePlanUsers?.toLocaleString()
                }
              />
            </div>
          </div>

          {/* Support performance */}
          <div style={{ marginBottom: 32 }}>
            <SectionLabel>Support Performance</SectionLabel>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: 16,
              }}
            >
              <StatCard
                iconName="confirmation_number"
                label="Total Support Tickets"
                trend="15 new this week"
                accentColor="#f59e0b"
                value={adminDashboardData.totalSupportTickets.toLocaleString()}
              />
              <StatCard
                iconName="check_circle"
                label="Resolved Tickets"
                trend="90.2% resolution rate"
                accentColor="#14b8a6"
                value={adminDashboardData.resolvedTickets.toLocaleString()}
              />
            </div>
          </div>

          {/* Best operator */}
          <TokenCard style={{ marginBottom: 24 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    backgroundColor: "#fef3c7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon name="star" size={24} style={{ color: "#f59e0b" }} />
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
                      margin: 0,
                    }}
                  >
                    Top Performer
                  </p>
                  <p
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: C.onSurface,
                      ...HL,
                      margin: "2px 0 0",
                    }}
                  >
                    {adminDashboardData.bestOperator.name}
                  </p>
                  <p
                    style={{
                      fontSize: 13,
                      color: C.onSurfaceVariant,
                      ...BD,
                      margin: "2px 0 0",
                    }}
                  >
                    {adminDashboardData.bestOperator.resolvedTickets} tickets
                    resolved this month
                  </p>
                </div>
              </div>
              <span
                style={{
                  backgroundColor: "#fef3c7",
                  color: "#92400e",
                  borderRadius: 8,
                  padding: "4px 14px",
                  fontSize: 13,
                  fontWeight: 700,
                  ...BD,
                }}
              >
                ⭐ Excellent
              </span>
            </div>
          </TokenCard>

          {/* Quick actions */}
          <TokenCard>
            <p
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: C.onSurface,
                ...HL,
                margin: "0 0 16px",
              }}
            >
              Quick Actions
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 12,
              }}
            >
              <PrimaryBtn
                onClick={() => router.push("/users")}
                style={{ borderRadius: 10 }}
              >
                View All Users
              </PrimaryBtn>
              <PrimaryBtn
                onClick={() => router.push("/portal/tickets")}
                style={{ borderRadius: 10 }}
              >
                Support Tickets
              </PrimaryBtn>
              <PrimaryBtn
                onClick={() => router.push("/portal/partners")}
                style={{ borderRadius: 10 }}
              >
                Manage Partners
              </PrimaryBtn>
            </div>
          </TokenCard>
        </div>
      </div>
    );
  }

  // ─── Partner Branch ─────────────────────────────────────────────
  if (user.role === "partner") {
    return (
      <div style={{ width: "100%", flex: 1, padding: "32px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* Hero header */}
          <div
            style={{
              backgroundColor: C.primaryContainer,
              borderRadius: 20,
              padding: "32px 40px",
              marginBottom: 32,
            }}
          >
            <h1
              style={{
                color: "#ffffff",
                ...HL,
                fontSize: 30,
                fontWeight: 700,
                margin: 0,
              }}
            >
              Partner Portal
            </h1>
            <p
              style={{
                color: "#ffffff99",
                ...BD,
                fontSize: 15,
                margin: "6px 0 0",
              }}
            >
              Review your TFN, track your available balance, and manage payout
              requests.
            </p>
          </div>

          {partnerLoading ? (
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
                  Loading partner data...
                </p>
              </div>
            </div>
          ) : !partnerProfile ? (
            <TokenCard>
              <p style={{ fontSize: 14, color: C.onSurfaceVariant, ...BD }}>
                Your partner profile is not available yet. Please contact an
                administrator.
              </p>
            </TokenCard>
          ) : (
            <>
              {/* Stat grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: 16,
                  marginBottom: 24,
                }}
              >
                <StatCard
                  iconName="account_balance_wallet"
                  label="Current Balance"
                  accentColor="#22c55e"
                  value={formatCurrency(partnerProfile.currentBalance)}
                />
                <StatCard
                  iconName="payments"
                  label="Total Withdrawn"
                  accentColor="#3b82f6"
                  value={formatCurrency(partnerProfile.totalWithdrawn)}
                />
                <StatCard
                  iconName="security"
                  label="Withdrawal Status"
                  accentColor="#f59e0b"
                  trend={`Min. balance: ${formatCurrency(MIN_PARTNER_WITHDRAWAL_BALANCE)}`}
                  value={
                    partnerProfile.currentBalance >
                    MIN_PARTNER_WITHDRAWAL_BALANCE
                      ? "Eligible"
                      : "Below threshold"
                  }
                />
              </div>

              {/* Partner details + Withdrawal action */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.3fr 0.9fr",
                  gap: 24,
                  marginBottom: 24,
                  flexWrap: "wrap",
                }}
                className="portal-detail-grid"
              >
                {/* Details card */}
                <TokenCard>
                  <p
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: C.onSurface,
                      ...HL,
                      margin: "0 0 20px",
                    }}
                  >
                    Partner Details
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 16,
                      marginBottom: 20,
                    }}
                  >
                    <InfoRow
                      label="Partner Name"
                      value={partnerProfile.partnerName}
                    />
                    <InfoRow label="TFN" value={partnerProfile.partnerTFN} />
                    <InfoRow label="Email" value={user.email} />
                    <InfoRow
                      label="Phone"
                      value={user.phoneNumber || "Not provided"}
                    />
                  </div>
                  <div
                    style={{
                      backgroundColor: C.surfaceLow,
                      borderRadius: 12,
                      padding: "14px 18px",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <Icon
                      name="account_balance"
                      size={18}
                      style={{ color: C.onSurfaceVariant, flexShrink: 0 }}
                    />
                    <div>
                      <p
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: C.onSurfaceVariant,
                          ...BD,
                          margin: 0,
                        }}
                      >
                        Saved Payment Method
                      </p>
                      <p
                        style={{
                          fontSize: 13,
                          color: C.onSurface,
                          ...BD,
                          margin: "3px 0 0",
                        }}
                      >
                        {partnerProfile.paymentMethodSummary}
                      </p>
                    </div>
                  </div>
                </TokenCard>

                {/* Withdrawal card */}
                <TokenCard>
                  <p
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: C.onSurface,
                      ...HL,
                      margin: "0 0 4px",
                    }}
                  >
                    Withdrawal Action
                  </p>
                  <p
                    style={{
                      fontSize: 13,
                      color: C.onSurfaceVariant,
                      ...BD,
                      margin: "0 0 20px",
                    }}
                  >
                    Enter payout amount once balance exceeds{" "}
                    {formatCurrency(MIN_PARTNER_WITHDRAWAL_BALANCE)}.
                  </p>

                  <div
                    style={{
                      backgroundColor: C.surfaceLow,
                      borderRadius: 12,
                      padding: "14px 18px",
                      marginBottom: 16,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: C.onSurfaceVariant,
                        ...BD,
                        margin: 0,
                      }}
                    >
                      Available for payout
                    </p>
                    <p
                      style={{
                        fontSize: 28,
                        fontWeight: 700,
                        color: C.onSurface,
                        ...HL,
                        margin: "4px 0 0",
                      }}
                    >
                      {formatCurrency(partnerProfile.currentBalance)}
                    </p>
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    <label
                      htmlFor="withdrawalAmount"
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: C.onSurface,
                        ...BD,
                        display: "block",
                        marginBottom: 6,
                      }}
                    >
                      Amount to withdraw
                    </label>
                    <TokenInput
                      id="withdrawalAmount"
                      type="number"
                      inputMode="decimal"
                      min="0.01"
                      step="0.01"
                      max={
                        availableWithdrawalBalance > 0
                          ? availableWithdrawalBalance
                          : undefined
                      }
                      value={withdrawalAmount}
                      onChange={(e) => setWithdrawalAmount(e.target.value)}
                      placeholder="Enter amount"
                      disabled={
                        requestingWithdrawal ||
                        !partnerProfile.hasSavedPaymentMethod
                      }
                    />
                    <p
                      style={{
                        fontSize: 12,
                        color: C.onSurfaceVariant,
                        ...BD,
                        margin: "4px 0 0",
                      }}
                    >
                      Up to {formatCurrency(availableWithdrawalBalance)}.
                    </p>
                    {withdrawalAmount !== "" && !hasValidWithdrawalAmount && (
                      <p
                        style={{
                          fontSize: 12,
                          color: "#dc2626",
                          ...BD,
                          margin: "4px 0 0",
                        }}
                      >
                        Enter a valid amount that does not exceed your available
                        balance.
                      </p>
                    )}
                  </div>

                  {!partnerProfile.hasSavedPaymentMethod && (
                    <div
                      style={{
                        backgroundColor: "#fff7ed",
                        border: "1px solid #fed7aa",
                        borderRadius: 10,
                        padding: "12px 14px",
                        fontSize: 13,
                        color: "#92400e",
                        ...BD,
                        marginBottom: 12,
                      }}
                    >
                      Add a PayPal email or US bank account before requesting a
                      withdrawal.
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    <PrimaryBtn
                      onClick={handleRequestWithdrawal}
                      disabled={
                        requestingWithdrawal ||
                        partnerProfile.currentBalance <=
                          MIN_PARTNER_WITHDRAWAL_BALANCE ||
                        !hasValidWithdrawalAmount
                      }
                    >
                      {requestingWithdrawal
                        ? "Submitting…"
                        : "Request Withdrawal"}
                    </PrimaryBtn>
                    <OutlineBtn
                      onClick={() => router.push("/portal/partner-settings")}
                    >
                      {partnerProfile.hasSavedPaymentMethod
                        ? "Update Payment Details"
                        : "Add Payment Details"}
                    </OutlineBtn>
                  </div>

                  {/* TFN Statement section */}
                  <div
                    style={{
                      marginTop: 20,
                      backgroundColor: C.surfaceLow,
                      borderRadius: 12,
                      padding: "14px 18px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        marginBottom: 8,
                      }}
                    >
                      <Icon
                        name="description"
                        size={18}
                        style={{
                          color: C.onSurfaceVariant,
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                      />
                      <div>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: C.onSurface,
                            ...BD,
                            margin: 0,
                          }}
                        >
                          Request TFN Statement
                        </p>
                        <p
                          style={{
                            fontSize: 12,
                            color: C.onSurfaceVariant,
                            ...BD,
                            margin: "3px 0 0",
                          }}
                        >
                          Submit a request and the admin team will email your
                          TFN statement manually.
                        </p>
                      </div>
                    </div>
                    {hasPendingStatementRequest && (
                      <p
                        style={{
                          fontSize: 12,
                          color: "#92400e",
                          ...BD,
                          margin: "0 0 8px",
                        }}
                      >
                        You already have a pending TFN statement request.
                      </p>
                    )}
                    <OutlineBtn
                      onClick={handleRequestStatement}
                      disabled={
                        requestingStatement || hasPendingStatementRequest
                      }
                      style={{ marginTop: 4 }}
                    >
                      {requestingStatement
                        ? "Submitting…"
                        : "Request Statement"}
                    </OutlineBtn>
                  </div>
                </TokenCard>
              </div>

              {/* Withdrawal history */}
              <TokenCard style={{ marginBottom: 24 }}>
                <p
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: C.onSurface,
                    ...HL,
                    margin: "0 0 4px",
                  }}
                >
                  Withdrawal History
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: C.onSurfaceVariant,
                    ...BD,
                    margin: "0 0 20px",
                  }}
                >
                  Track every payout request and admin payment status.
                </p>
                {partnerWithdrawals.length === 0 ? (
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
                    No withdrawal requests yet.
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table
                      style={{ width: "100%", borderCollapse: "collapse" }}
                    >
                      <thead>
                        <tr
                          style={{
                            borderBottom: `1px solid ${C.outlineVariant}44`,
                          }}
                        >
                          {[
                            "Requested",
                            "Amount",
                            "Status",
                            "Payment Method",
                            "Paid At",
                          ].map((h) => (
                            <th
                              key={h}
                              style={{
                                padding: "10px 16px",
                                textAlign: "left",
                                fontSize: 12,
                                fontWeight: 700,
                                color: C.onSurfaceVariant,
                                ...BD,
                              }}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {partnerWithdrawals.map((w) => (
                          <tr
                            key={w._id}
                            style={{
                              borderBottom: `1px solid ${C.outlineVariant}22`,
                            }}
                          >
                            <td
                              style={{
                                padding: "12px 16px",
                                fontSize: 13,
                                color: C.onSurface,
                                ...BD,
                              }}
                            >
                              {new Date(w.requestedAt).toLocaleString()}
                            </td>
                            <td
                              style={{
                                padding: "12px 16px",
                                fontSize: 13,
                                fontWeight: 600,
                                color: C.onSurface,
                                ...BD,
                              }}
                            >
                              {formatCurrency(w.amount)}
                            </td>
                            <td style={{ padding: "12px 16px" }}>
                              <StatusPill status={w.status} />
                            </td>
                            <td
                              style={{
                                padding: "12px 16px",
                                fontSize: 13,
                                color: C.onSurface,
                                ...BD,
                              }}
                            >
                              {w.paymentMethodSummary}
                            </td>
                            <td
                              style={{
                                padding: "12px 16px",
                                fontSize: 13,
                                color: C.onSurfaceVariant,
                                ...BD,
                              }}
                            >
                              {w.paidAt
                                ? new Date(w.paidAt).toLocaleString()
                                : "Pending"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </TokenCard>

              {/* TFN Statement requests */}
              <TokenCard>
                <p
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: C.onSurface,
                    ...HL,
                    margin: "0 0 4px",
                  }}
                >
                  TFN Statement Requests
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: C.onSurfaceVariant,
                    ...BD,
                    margin: "0 0 20px",
                  }}
                >
                  Track each statement request and delivery status.
                </p>
                {partnerStatements.length === 0 ? (
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
                    No TFN statement requests yet.
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table
                      style={{ width: "100%", borderCollapse: "collapse" }}
                    >
                      <thead>
                        <tr
                          style={{
                            borderBottom: `1px solid ${C.outlineVariant}44`,
                          }}
                        >
                          {["Requested", "Status", "Delivered At", "Notes"].map(
                            (h) => (
                              <th
                                key={h}
                                style={{
                                  padding: "10px 16px",
                                  textAlign: "left",
                                  fontSize: 12,
                                  fontWeight: 700,
                                  color: C.onSurfaceVariant,
                                  ...BD,
                                }}
                              >
                                {h}
                              </th>
                            ),
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {partnerStatements.map((s) => (
                          <tr
                            key={s._id}
                            style={{
                              borderBottom: `1px solid ${C.outlineVariant}22`,
                            }}
                          >
                            <td
                              style={{
                                padding: "12px 16px",
                                fontSize: 13,
                                color: C.onSurface,
                                ...BD,
                              }}
                            >
                              {new Date(s.requestedAt).toLocaleString()}
                            </td>
                            <td style={{ padding: "12px 16px" }}>
                              <StatusPill status={s.status} />
                            </td>
                            <td
                              style={{
                                padding: "12px 16px",
                                fontSize: 13,
                                color: C.onSurfaceVariant,
                                ...BD,
                              }}
                            >
                              {s.deliveredAt
                                ? new Date(s.deliveredAt).toLocaleString()
                                : "Pending"}
                            </td>
                            <td
                              style={{
                                padding: "12px 16px",
                                fontSize: 13,
                                color: C.onSurfaceVariant,
                                ...BD,
                              }}
                            >
                              {s.notes || "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </TokenCard>
            </>
          )}
        </div>
      </div>
    );
  }

  // ─── Generic / Operator Branch ──────────────────────────────────
  return (
    <div style={{ width: "100%", flex: 1, padding: "32px 32px" }}>
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        <div style={{ marginBottom: 28 }}>
          <h1
            style={{
              fontSize: 30,
              fontWeight: 700,
              color: C.onSurface,
              ...HL,
              margin: 0,
            }}
          >
            Partner Portal
          </h1>
          <p
            style={{
              fontSize: 15,
              color: C.onSurfaceVariant,
              ...BD,
              margin: "6px 0 0",
            }}
          >
            Access your role-specific dashboard and management tools
          </p>
        </div>

        {/* Role card */}
        <TokenCard
          style={{
            borderLeft: `4px solid var(--brand-violet)`,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 20,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: C.onSurface,
                  ...HL,
                  margin: 0,
                }}
              >
                Your Role
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: C.onSurfaceVariant,
                  ...BD,
                  margin: "3px 0 0",
                }}
              >
                Your account has the following access level
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 20,
            }}
          >
            <span
              style={{
                backgroundColor: "#dbe1ff",
                color: "#003ea8",
                borderRadius: 8,
                padding: "6px 16px",
                fontSize: 13,
                fontWeight: 700,
                textTransform: "capitalize",
                ...BD,
              }}
            >
              {user.role}
            </span>
            <div>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: C.onSurface,
                  ...BD,
                  margin: 0,
                }}
              >
                {user.fullName || "User"}
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: C.onSurfaceVariant,
                  ...BD,
                  margin: "2px 0 0",
                }}
              >
                {user.email}
              </p>
            </div>
          </div>

          <div
            style={{
              backgroundColor: C.surfaceLow,
              borderRadius: 12,
              padding: "14px 18px",
              marginBottom: 20,
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
                margin: "0 0 4px",
              }}
            >
              Permissions
            </p>
            <p style={{ fontSize: 14, color: C.onSurface, ...BD, margin: 0 }}>
              {roleDescriptions[user.role] ||
                "View your account information and settings"}
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              borderTop: `1px solid ${C.outlineVariant}44`,
              paddingTop: 20,
            }}
          >
            <InfoRow label="Full Name" value={user.fullName || "N/A"} />
            <InfoRow label="Email" value={user.email} />
            <InfoRow label="Phone" value={user.phoneNumber || "Not provided"} />
            <InfoRow
              label="Member Since"
              value={
                user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "N/A"
              }
            />
          </div>
        </TokenCard>

        {/* Portal features */}
        <TokenCard style={{ marginBottom: 24 }}>
          <p
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: C.onSurface,
              ...HL,
              margin: "0 0 16px",
            }}
          >
            Portal Features
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {user.role === "operator" && (
              <>
                {[
                  {
                    icon: "confirmation_number",
                    title: "Ticket Management",
                    desc: "View and manage customer support tickets",
                  },
                  {
                    icon: "support_agent",
                    title: "Customer Interactions",
                    desc: "Handle customer support requests and communications",
                  },
                  {
                    icon: "bar_chart",
                    title: "Performance Stats",
                    desc: "Track your performance metrics and customer feedback",
                  },
                ].map((f) => (
                  <div
                    key={f.title}
                    style={{
                      backgroundColor: C.surface,
                      border: `1px solid ${C.outlineVariant}44`,
                      borderRadius: 12,
                      padding: "14px 18px",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                    }}
                  >
                    <Icon
                      name={f.icon}
                      size={18}
                      style={{
                        color: C.onSurfaceVariant,
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    />
                    <div>
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: C.onSurface,
                          ...BD,
                          margin: 0,
                        }}
                      >
                        {f.title}
                      </p>
                      <p
                        style={{
                          fontSize: 13,
                          color: C.onSurfaceVariant,
                          ...BD,
                          margin: "3px 0 0",
                        }}
                      >
                        {f.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            )}
            {user.role === "partner" && (
              <>
                {[
                  {
                    icon: "dashboard",
                    title: "Partner Dashboard",
                    desc: "View partnership metrics and business performance",
                  },
                  {
                    icon: "receipt_long",
                    title: "Revenue Reports",
                    desc: "Access detailed revenue and commission reports",
                  },
                  {
                    icon: "integration_instructions",
                    title: "Integration Tools",
                    desc: "Manage partner integrations and API keys",
                  },
                ].map((f) => (
                  <div
                    key={f.title}
                    style={{
                      backgroundColor: C.surface,
                      border: `1px solid ${C.outlineVariant}44`,
                      borderRadius: 12,
                      padding: "14px 18px",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                    }}
                  >
                    <Icon
                      name={f.icon}
                      size={18}
                      style={{
                        color: C.onSurfaceVariant,
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    />
                    <div>
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: C.onSurface,
                          ...BD,
                          margin: 0,
                        }}
                      >
                        {f.title}
                      </p>
                      <p
                        style={{
                          fontSize: 13,
                          color: C.onSurfaceVariant,
                          ...BD,
                          margin: "3px 0 0",
                        }}
                      >
                        {f.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </TokenCard>

        <OutlineBtn
          onClick={() => router.push("/dashboard")}
          style={{ width: "auto", padding: "10px 24px" }}
        >
          ← Back to Dashboard
        </OutlineBtn>
      </div>
    </div>
  );
}
