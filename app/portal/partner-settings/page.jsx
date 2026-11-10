"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useRoleAuth } from "@/hooks/useRoleAuth";
import { partnersAPI } from "@/lib/api";
import { C, HL, BD, SHADOW } from "@/components/landing/tokens";

function getDefaultState() {
  return {
    paymentMethodType: "",
    paypalEmail: "",
    bankDetails: {
      accountHolderName: "",
      bankName: "",
      accountNumber: "",
      routingNumber: "",
      accountType: "checking",
    },
  };
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value || 0));
}

function buildPaymentMethodPayload(formData) {
  if (formData.paymentMethodType === "paypal") {
    return {
      type: "paypal",
      paypalEmail: formData.paypalEmail,
    };
  }

  return {
    type: "bank",
    bankDetails: formData.bankDetails,
  };
}

export default function PartnerSettingsPage() {
  const router = useRouter();
  const { isLoading, user, hasAccess } = useRoleAuth({
    allowedRoles: ["partner"],
    redirectTo: "/portal",
  });
  const [formData, setFormData] = useState(getDefaultState);
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordSaving, setPasswordSaving] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "partner") {
      return;
    }

    let isMounted = true;

    async function loadPartnerProfile() {
      try {
        setLoading(true);
        const response = await partnersAPI.getPartnerProfile();

        if (!isMounted) {
          return;
        }

        const paymentMethod = response.partner?.paymentMethod || {};
        setPartner(response.partner || null);
        setFormData({
          paymentMethodType: paymentMethod.type || "paypal",
          paypalEmail: paymentMethod.paypalEmail || "",
          bankDetails: {
            accountHolderName:
              paymentMethod.bankDetails?.accountHolderName || "",
            bankName: paymentMethod.bankDetails?.bankName || "",
            accountNumber: paymentMethod.bankDetails?.accountNumber || "",
            routingNumber: paymentMethod.bankDetails?.routingNumber || "",
            accountType: paymentMethod.bankDetails?.accountType || "checking",
          },
        });
      } catch (error) {
        toast.error(error.message || "Failed to load payout settings");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadPartnerProfile();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const updateBankField = (field, value) => {
    setFormData((current) => ({
      ...current,
      bankDetails: {
        ...current.bankDetails,
        [field]: value,
      },
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      const response = await partnersAPI.savePaymentMethod(
        buildPaymentMethodPayload(formData),
      );

      if (response.success) {
        toast.success("Payment method saved");
        const profile = await partnersAPI.getPartnerProfile();
        setPartner(profile.partner || null);
      }
    } catch (error) {
      toast.error(error.message || "Failed to save payment method");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New password and confirm password must match");
      return;
    }

    try {
      setPasswordSaving(true);
      const response = await partnersAPI.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      if (response.success) {
        toast.success("Password updated successfully");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setPasswordSaving(false);
    }
  };

  if (isLoading || loading) {
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
            Loading payout settings...
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

  const fieldStyle = {
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
  };

  const labelStyle = {
    fontSize: 13,
    fontWeight: 600,
    color: C.onSurface,
    ...BD,
    display: "block",
    marginBottom: 6,
  };

  const cardStyle = {
    backgroundColor: C.surfaceLowest,
    borderRadius: 16,
    border: `1px solid ${C.outlineVariant}44`,
    padding: "24px",
    ...SHADOW,
    marginBottom: 20,
  };

  return (
    <div style={{ width: "100%", flex: 1, padding: "32px 32px" }}>
      <form style={{ maxWidth: 900, margin: "0 auto" }} onSubmit={handleSave}>
        {/* Page header */}
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
              Payout Settings
            </h1>
            <p
              style={{
                fontSize: 14,
                color: C.onSurfaceVariant,
                ...BD,
                margin: "6px 0 0",
              }}
            >
              Add your PayPal email or US bank details before requesting a
              withdrawal.
            </p>
          </div>
          <button
            type="button"
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
        </div>

        {/* Partner snapshot */}
        {partner && (
          <div style={cardStyle}>
            <p
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: C.onSurface,
                ...HL,
                margin: "0 0 16px",
              }}
            >
              Partner Snapshot
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
                gap: 16,
              }}
            >
              {[
                { label: "TFN", value: partner.partnerTFN },
                {
                  label: "Current Balance",
                  value: formatCurrency(partner.currentBalance),
                },
                {
                  label: "Current Payout Method",
                  value: partner.paymentMethodSummary,
                },
              ].map((row) => (
                <div key={row.label}>
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
                    {row.label}
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
                    {row.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment details */}
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
            Payment Details
          </p>
          <p
            style={{
              fontSize: 13,
              color: C.onSurfaceVariant,
              ...BD,
              margin: "0 0 20px",
            }}
          >
            Select one payout method and complete the required fields.
          </p>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Payment Method</label>
            <select
              value={formData.paymentMethodType}
              onChange={(e) =>
                setFormData((c) => ({
                  ...c,
                  paymentMethodType: e.target.value,
                }))
              }
              style={{ ...fieldStyle, cursor: "pointer" }}
            >
              <option value="paypal">PayPal</option>
              <option value="bank">US Bank</option>
            </select>
          </div>

          {formData.paymentMethodType === "paypal" ? (
            <div>
              <label style={labelStyle}>PayPal Email</label>
              <input
                type="email"
                value={formData.paypalEmail}
                onChange={(e) =>
                  setFormData((c) => ({ ...c, paypalEmail: e.target.value }))
                }
                placeholder="paypal@example.com"
                style={fieldStyle}
              />
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 16,
              }}
            >
              {[
                {
                  label: "Account Holder Name",
                  field: "accountHolderName",
                  type: "text",
                },
                { label: "Bank Name", field: "bankName", type: "text" },
                {
                  label: "Account Number",
                  field: "accountNumber",
                  type: "text",
                },
                {
                  label: "Routing Number",
                  field: "routingNumber",
                  type: "text",
                },
              ].map((f) => (
                <div key={f.field}>
                  <label style={labelStyle}>{f.label}</label>
                  <input
                    type={f.type}
                    value={formData.bankDetails[f.field]}
                    onChange={(e) => updateBankField(f.field, e.target.value)}
                    style={fieldStyle}
                  />
                </div>
              ))}
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Account Type</label>
                <select
                  value={formData.bankDetails.accountType}
                  onChange={(e) =>
                    updateBankField("accountType", e.target.value)
                  }
                  style={{ ...fieldStyle, cursor: "pointer" }}
                >
                  <option value="checking">Checking</option>
                  <option value="savings">Savings</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Change password */}
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
            Change Password
          </p>
          <p
            style={{
              fontSize: 13,
              color: C.onSurfaceVariant,
              ...BD,
              margin: "0 0 20px",
            }}
          >
            Update your partner portal password.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            {[
              {
                label: "Current Password",
                key: "currentPassword",
                placeholder: "Enter current password",
              },
              {
                label: "New Password",
                key: "newPassword",
                placeholder: "Enter new password",
              },
              {
                label: "Confirm Password",
                key: "confirmPassword",
                placeholder: "Confirm new password",
              },
            ].map((f) => (
              <div key={f.key}>
                <label style={labelStyle}>{f.label}</label>
                <input
                  type="password"
                  value={passwordForm[f.key]}
                  onChange={(e) =>
                    setPasswordForm((c) => ({ ...c, [f.key]: e.target.value }))
                  }
                  placeholder={f.placeholder}
                  style={fieldStyle}
                />
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
              marginTop: 16,
            }}
          >
            <p
              style={{
                fontSize: 12,
                color: C.onSurfaceVariant,
                ...BD,
                margin: 0,
              }}
            >
              Password must include uppercase, lowercase, number, and special
              character.
            </p>
            <button
              type="button"
              onClick={handleChangePassword}
              disabled={passwordSaving}
              style={{
                backgroundColor: passwordSaving
                  ? C.surfaceHigh
                  : C.primaryContainer,
                color: passwordSaving ? C.onSurfaceVariant : "#ffffff",
                border: "none",
                borderRadius: 10,
                padding: "10px 20px",
                fontSize: 14,
                fontWeight: 600,
                cursor: passwordSaving ? "not-allowed" : "pointer",
                ...BD,
                whiteSpace: "nowrap",
              }}
            >
              {passwordSaving ? "Updating..." : "Change Password"}
            </button>
          </div>
        </div>

        {/* Bottom action buttons */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              backgroundColor: saving ? C.surfaceHigh : C.primaryContainer,
              color: saving ? C.onSurfaceVariant : "#ffffff",
              border: "none",
              borderRadius: 10,
              padding: "11px 24px",
              fontSize: 14,
              fontWeight: 600,
              cursor: saving ? "not-allowed" : "pointer",
              ...BD,
            }}
          >
            {saving ? "Saving..." : "Save Payment Method"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/portal")}
            disabled={saving}
            style={{
              backgroundColor: "transparent",
              color: C.primaryContainer,
              border: `1.5px solid ${C.outlineVariant}`,
              borderRadius: 10,
              padding: "10px 24px",
              fontSize: 14,
              fontWeight: 600,
              cursor: saving ? "not-allowed" : "pointer",
              ...BD,
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
