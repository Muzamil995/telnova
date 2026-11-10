"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useRoleAuth } from "@/hooks/useRoleAuth";
import { partnersAPI } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function getInitialFormData() {
  return {
    partnerName: "",
    email: "",
    password: "",
    phoneNumber: "",
    partnerTFN: "",
    currentBalance: "0",
    totalWithdrawn: "0",
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

function buildPaymentMethodPayload(formData) {
  if (formData.paymentMethodType === "paypal") {
    return {
      type: "paypal",
      paypalEmail: formData.paypalEmail,
    };
  }

  if (formData.paymentMethodType === "bank") {
    return {
      type: "bank",
      bankDetails: formData.bankDetails,
    };
  }

  return { type: null };
}

export default function NewPartnerPage() {
  const router = useRouter();
  const { isLoading, user, hasAccess } = useRoleAuth({
    allowedRoles: ["admin"],
    redirectTo: "/portal",
  });
  const [formData, setFormData] = useState(getInitialFormData);
  const [saving, setSaving] = useState(false);

  const updateBankField = (field, value) => {
    setFormData((current) => ({
      ...current,
      bankDetails: {
        ...current.bankDetails,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      const response = await partnersAPI.createPartner({
        partnerName: formData.partnerName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        partnerTFN: formData.partnerTFN,
        currentBalance: Number(formData.currentBalance || 0),
        totalWithdrawn: Number(formData.totalWithdrawn || 0),
        paymentMethod: buildPaymentMethodPayload(formData),
      });

      if (response.success) {
        toast.success("Partner created successfully");
        router.push("/portal/partners");
      }
    } catch (error) {
      toast.error(error.message || "Failed to create partner");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mx-auto size-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading form...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess || !user) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-muted-foreground">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl p-4 sm:p-8">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Create Partner</h1>
            <p className="mt-2 text-muted-foreground">
              Create a partner account, opening balance, and payout details.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/portal/partners")}
          >
            Back to Partners
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Account Access</CardTitle>
            <CardDescription>
              The partner will use these credentials to access the portal.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Partner Name</label>
              <Input
                value={formData.partnerName}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    partnerName: event.target.value,
                  }))
                }
                placeholder="Acme Distribution"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Partner TFN</label>
              <Input
                value={formData.partnerTFN}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    partnerTFN: event.target.value,
                  }))
                }
                placeholder="TFN-001"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                placeholder="partner@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input
                value={formData.phoneNumber}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    phoneNumber: event.target.value,
                  }))
                }
                placeholder="+15551234567"
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Temporary Password</label>
              <Input
                type="password"
                value={formData.password}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
                placeholder="Use a strong temporary password"
                required
              />
              <p className="text-xs text-muted-foreground">
                Must include uppercase, lowercase, number, and special
                character.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Partner Finance</CardTitle>
            <CardDescription>
              Set the starting balances for this partner profile.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Balance</label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={formData.currentBalance}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    currentBalance: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Total Withdrawn</label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={formData.totalWithdrawn}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    totalWithdrawn: event.target.value,
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payout Method</CardTitle>
            <CardDescription>
              Save PayPal details or US bank details now, or leave it empty for
              later.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Method</label>
              <select
                value={formData.paymentMethodType}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    paymentMethodType: event.target.value,
                  }))
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Configure Later</option>
                <option value="paypal">PayPal</option>
                <option value="bank">US Bank</option>
              </select>
            </div>

            {formData.paymentMethodType === "paypal" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">PayPal Email</label>
                <Input
                  type="email"
                  value={formData.paypalEmail}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      paypalEmail: event.target.value,
                    }))
                  }
                  placeholder="paypal@example.com"
                />
              </div>
            )}

            {formData.paymentMethodType === "bank" && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Account Holder Name
                  </label>
                  <Input
                    value={formData.bankDetails.accountHolderName}
                    onChange={(event) =>
                      updateBankField("accountHolderName", event.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bank Name</label>
                  <Input
                    value={formData.bankDetails.bankName}
                    onChange={(event) =>
                      updateBankField("bankName", event.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Account Number</label>
                  <Input
                    value={formData.bankDetails.accountNumber}
                    onChange={(event) =>
                      updateBankField("accountNumber", event.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Routing Number</label>
                  <Input
                    value={formData.bankDetails.routingNumber}
                    onChange={(event) =>
                      updateBankField("routingNumber", event.target.value)
                    }
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Account Type</label>
                  <select
                    value={formData.bankDetails.accountType}
                    onChange={(event) =>
                      updateBankField("accountType", event.target.value)
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="checking">Checking</option>
                    <option value="savings">Savings</option>
                  </select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "Creating..." : "Create Partner"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setFormData(getInitialFormData())}
            disabled={saving}
          >
            Reset Form
          </Button>
        </div>
      </form>
    </div>
  );
}
